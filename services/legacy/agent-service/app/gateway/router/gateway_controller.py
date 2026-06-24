import time
from typing import Dict, Any, List
from langchain_community.llms import Ollama
from langchain_core.language_models.llms import BaseLLM
from app.core.config import settings

class GatewayController:
    """
    Massive API Load Balancer for LLM execution.
    Abstracts all LLM interactions away from the LangGraph Engine.
    Implements Provider Fallbacks and Circuit Breakers to prevent GPU crashes at scale.
    """
    def __init__(self):
        # We define a tier list of providers
        self.providers = {
            "primary": Ollama(base_url=settings.OLLAMA_BASE_URL, model=settings.OLLAMA_MODEL, temperature=0.2),
            "secondary": Ollama(base_url="http://ollama-cluster-b:11434", model=settings.OLLAMA_MODEL, temperature=0.2),
            # "emergency": OpenAI(api_key=settings.OPENAI_API_KEY)
        }
        
        self.circuit_breakers = {
            "primary": {"failures": 0, "status": "CLOSED", "last_trip": 0},
            "secondary": {"failures": 0, "status": "CLOSED", "last_trip": 0}
        }
        self.max_failures = 3
        self.cooldown_seconds = 60

    def _get_healthy_provider(self) -> BaseLLM:
        """Dynamically routes to the best available LLM cluster."""
        current_time = time.time()
        
        for name, provider in self.providers.items():
            breaker = self.circuit_breakers.get(name)
            if not breaker:
                return provider # Emergency provider has no circuit breaker
                
            if breaker["status"] == "OPEN":
                # Check if cooldown has expired
                if current_time - breaker["last_trip"] > self.cooldown_seconds:
                    print(f"[GATEWAY] Cooldown expired. Resetting circuit for {name} cluster.")
                    breaker["status"] = "HALF_OPEN"
                else:
                    continue
                    
            return provider
            
        raise RuntimeError("CRITICAL: All LLM Providers have failed. Total system collapse.")

    def invoke_llm(self, prompt: str) -> str:
        """Intercepts the prompt and routes it securely."""
        for attempt in range(len(self.providers)):
            provider = self._get_healthy_provider()
            provider_name = [k for k, v in self.providers.items() if v == provider][0]
            
            try:
                print(f"[GATEWAY] Routing prompt via {provider_name} cluster...")
                response = provider.invoke(prompt)
                
                # If Half-Open succeeds, close the breaker
                breaker = self.circuit_breakers.get(provider_name)
                if breaker and breaker["status"] == "HALF_OPEN":
                    breaker["status"] = "CLOSED"
                    breaker["failures"] = 0
                    
                return response
                
            except Exception as e:
                print(f"[GATEWAY ALERT] {provider_name} cluster failed: {e}")
                breaker = self.circuit_breakers.get(provider_name)
                if breaker:
                    breaker["failures"] += 1
                    if breaker["failures"] >= self.max_failures:
                        print(f"[GATEWAY CRITICAL] Tripping circuit breaker for {provider_name}!")
                        breaker["status"] = "OPEN"
                        breaker["last_trip"] = time.time()
                        
        raise RuntimeError("Gateway exhausted all fallbacks.")
