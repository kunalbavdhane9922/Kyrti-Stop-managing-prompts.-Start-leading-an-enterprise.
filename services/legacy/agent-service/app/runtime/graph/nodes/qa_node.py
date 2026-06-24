import time
from typing import Dict, Any, List
from langchain_core.messages import AIMessage
from app.runtime.graph.nodes.base_node import BaseNodeStrategy
from app.runtime.graph.models.state_models import DynamicAgentState

class QAValidationNodeStrategy(BaseNodeStrategy):
    """
    Acts as a strict auditor. Can be parallelized to run multiple tests simultaneously.
    If it fails, it throws a strict exception forcing the router to backoff to the reasoning node.
    """
    def __init__(self, validation_type: str):
        super().__init__(node_name=f"QA_{validation_type}")
        self.validation_type = validation_type

    def estimate_token_cost(self, state: DynamicAgentState) -> float:
        return 0.005 # Flat estimation for a simple QA review

    def execute(self, state: DynamicAgentState) -> Dict[str, Any]:
        print(f"[{self.node_name}] Starting deep AST validation on code...")
        time.sleep(1) # Simulating heavy linting/testing
        
        # Look at the shared memory to find the recently edited file
        edited_files = state.shared_memory.get("recently_edited", [])
        
        if not edited_files:
            return {"messages": [AIMessage(content="[QA] No files to validate. Passing.")]}
            
        # Simulate strict failure
        if "syntax_error" in state.messages[-1].content.lower():
            raise RuntimeError("QA FAILED: Syntax error detected by parallel linter.")
            
        return {"messages": [AIMessage(content=f"[QA] Validation passed for {self.validation_type}")]}
