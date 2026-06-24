import time
from typing import Dict, Any, List
from langchain_core.messages import ToolMessage
from app.runtime.graph.nodes.base_node import BaseNodeStrategy
from app.runtime.graph.models.state_models import DynamicAgentState
from app.sandboxing.manager.warden import DockerWarden
from app.sandboxing.bridge.executor import SecureExecutorBridge

class ToolExecutionNodeStrategy(BaseNodeStrategy):
    """
    Highly secure Tool Execution Node.
    Prevents the LLM from executing raw shell code on the host machine. 
    Intercepts the tool request, spins up an isolated Docker Warden prison, 
    executes the command via the secure gRPC bridge, and destroys the prison.
    """
    def __init__(self, allowed_tools: List[str]):
        super().__init__(node_name="ToolExecution_Warden")
        self.allowed_tools = allowed_tools
        self.warden = DockerWarden()
        self.bridge = SecureExecutorBridge()

    def estimate_token_cost(self, state: DynamicAgentState) -> float:
        # Tool execution consumes near zero LLM tokens, but we charge a flat fee for the compute
        return 0.001

    def execute(self, state: DynamicAgentState) -> Dict[str, Any]:
        start_time = time.time()
        
        last_message = state.messages[-1].content
        print(f"[{self.node_name}] Intercepted Tool Execution Request: {last_message}")
        
        # In a real environment, we would parse the JSON tool payload from the LLM here.
        # For scaffolding, we simulate executing a system command.
        requested_command = last_message.replace("EXECUTE:", "").strip()
        
        # 1. Boot the Prison (with Cgroups & Seccomp)
        jail_name = f"saep-jail-{state.tenant_id}"
        self.warden.create_jail(tenant_id=state.tenant_id)
        
        try:
            # 2. Execute via Secure Bridge
            exit_code, output = self.bridge.execute_in_jail(jail_name, requested_command)
            
            if exit_code != 0:
                print(f"[WARDEN] Tool execution failed in jail. Exit code: {exit_code}")
                # We format this clearly so the Reasoning node can see the exact error and self-correct
                result_content = f"TOOL EXECUTION FAILED:\n{output}"
            else:
                print(f"[WARDEN] Tool executed successfully.")
                result_content = output
                
        finally:
            # 3. Destroy the Prison immediately to free Cgroups RAM
            self.warden.destroy_jail(jail_name)

        execution_time = time.time() - start_time
        print(f"[{self.node_name}] Executed in {execution_time:.2f}s")
        
        return {"messages": [ToolMessage(content=result_content, tool_call_id="jail_exec")]}
