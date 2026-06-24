import json
import re

class HallucinationGuard:
    """
    Massive execution safeguard.
    Sits between the LLM and the Agent Engine. Scans the raw text response 
    for catastrophic hallucinations (e.g. malformed JSON that will crash the parser,
    or attempting to execute lethal system commands).
    """
    @staticmethod
    def validate_and_sanitize(llm_response: str) -> str:
        # 1. Look for lethal commands hallucinated by the model
        lethal_commands = ["rm -rf /", "mkfs", "dd if=/dev/zero"]
        for lethal in lethal_commands:
            if lethal in llm_response:
                print(f"[HALLUCINATION GUARD] CRITICAL: Lethal command hallucination detected. Purging response.")
                raise ValueError("Hallucinated lethal command intercepted.")

        # 2. Force valid JSON if the model attempted a tool call
        if "EXECUTE:" in llm_response and "{" in llm_response:
            try:
                # Extract the JSON payload part
                start_idx = llm_response.find("{")
                end_idx = llm_response.rfind("}") + 1
                json_part = llm_response[start_idx:end_idx]
                
                # If this fails, it's a hallucination
                json.loads(json_part) 
                
            except json.JSONDecodeError as e:
                print(f"[HALLUCINATION GUARD] Model generated malformed JSON: {e}. Forcing retry.")
                raise ValueError("Malformed JSON output. You must format your response as valid JSON.")

        # 3. Strip hallucinatory markdown wrapping around plain text tools
        if llm_response.startswith("```json") and llm_response.endswith("```"):
            return llm_response.replace("```json\n", "").replace("```", "").strip()
            
        return llm_response
