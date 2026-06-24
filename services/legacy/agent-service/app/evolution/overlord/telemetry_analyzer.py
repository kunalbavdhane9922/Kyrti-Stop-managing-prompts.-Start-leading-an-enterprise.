import time
import threading
from typing import Dict
from app.telemetry.metrics.exporter import PrometheusMetrics

class OverlordAnalyst:
    """
    The Singularity Core.
    Continuously monitors Prometheus metrics. If it detects that a specific Swarm Node
    is failing repeatedly (e.g., QA Panel rejecting React code), it triggers an Architectural Mutation.
    """
    def __init__(self, failure_threshold: int = 3):
        self.failure_threshold = failure_threshold
        self.active = True
        
        # Simulates a rolling window of failure counts per component
        self.failure_counters: Dict[str, int] = {
            "QA_Consensus": 0,
            "Developer_Swarm": 0
        }

    def start_monitoring(self):
        print("[OVERLORD] Telemetry Analysis Matrix online. Monitoring for structural weakness.")
        thread = threading.Thread(target=self._analysis_loop, daemon=True)
        thread.start()

    def record_failure(self, component: str):
        """Called by the Swarm Graph when a node fails its execution loop."""
        if component in self.failure_counters:
            self.failure_counters[component] += 1
            print(f"[OVERLORD] Failure detected in {component}. Count: {self.failure_counters[component]}")

    def _analysis_loop(self):
        from app.evolution.compiler.ast_mutator import ArchitecturalMutator
        
        while self.active:
            time.sleep(10) # Poll every 10 seconds
            
            for component, count in self.failure_counters.items():
                if count >= self.failure_threshold:
                    print(f"\n[OVERLORD] 🚨 CRITICAL WEAKNESS DETECTED IN {component}. INITIATING SELF-EVOLUTION 🚨")
                    
                    # Reset counter
                    self.failure_counters[component] = 0
                    
                    # Trigger the AST Mutator to rewrite the Python code
                    mutator = ArchitecturalMutator()
                    mutator.mutate_graph_compiler(component)
