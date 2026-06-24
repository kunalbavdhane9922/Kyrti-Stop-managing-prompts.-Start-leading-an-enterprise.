from temporalio import activity
from app.runtime.graph.compiler.graph_compiler import DynamicGraphCompiler
from langchain_core.messages import HumanMessage

@activity.defn
async def execute_dynamic_agent_graph(tenant_id: str, professional_dna: dict, task: str) -> str:
    """
    Temporal Activity that invokes the dynamically compiled LangGraph.
    This runs the actual cognitive loop and reports the final result back to the Workflow.
    """
    print(f"[TEMPORAL ACTIVITY] Starting Agent Execution for Tenant: {tenant_id}")
    
    # 1. Compile the Custom Graph using the massive new Graph Compiler
    compiler = DynamicGraphCompiler()
    
    # Inject basic required DNA parameters if missing (for scaffolding)
    if "role" not in professional_dna:
        professional_dna["role"] = "Generic Agent"
    if "allowed_tools" not in professional_dna:
        professional_dna["allowed_tools"] = ["list_directory", "view_file"]
        
    graph = compiler.compile_graph(professional_dna)
    
    # 2. Initialize the Pydantic State (DynamicAgentState)
    initial_state = {
        "messages": [HumanMessage(content=f"TASK: {task}")],
        "task": task,
        "tenant_id": tenant_id,
        "professional_id": "DP-" + tenant_id[:8], # Mock ID
        "current_node": "START",
        "execution_history": [],
        "shared_memory": {},
        "is_paused": False
    }
    
    # 3. Execute
    try:
        activity.heartbeat("Executing massive LangGraph loop...")
        result = graph.invoke(initial_state, {"recursion_limit": 100}) # Increased recursion limit
        
        final_message = result.get("messages", [])[-1].content
        return final_message
    except Exception as e:
        print(f"[TEMPORAL ERROR] Graph execution failed: {e}")
        raise
