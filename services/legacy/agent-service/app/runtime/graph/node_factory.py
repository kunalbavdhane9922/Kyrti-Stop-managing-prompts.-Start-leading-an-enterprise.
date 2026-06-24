import json
from langchain_core.messages import AIMessage
from langchain_community.llms import Ollama
from app.core.config import settings

class DynamicNodeFactory:
    """
    Dynamically generates LangGraph nodes based on the ProfessionTemplate DNA.
    Instead of hardcoded 'coder' or 'qa' nodes, this factory constructs specialized nodes
    with tailored system prompts and tool bindings on the fly.
    """
    def __init__(self):
        self.llm = Ollama(base_url=settings.OLLAMA_BASE_URL, model=settings.OLLAMA_MODEL, temperature=0)

    def create_reasoning_node(self, role_name: str, skills: list, constraints: str):
        """Generates a callable node function optimized for a specific cognitive role."""
        
        system_prompt = f"""You are acting in the role of {role_name}.
Your primary skills are: {', '.join(skills)}.
Constraints: {constraints}

Analyze the task state and determine the best course of action.
"""
        def node_function(state):
            messages = state.get("messages", [])
            history = "\n".join([m.content for m in messages[-5:]])
            prompt = f"{system_prompt}\n\nCurrent Task State:\n{history}\n\nWhat is your output?"
            
            # OpenTelemetry trace injection would occur here in Phase 6
            print(f"[NODE EXECUTING: {role_name}]")
            response = self.llm.invoke(prompt)
            return {"messages": [AIMessage(content=f"[{role_name} Output]: {response}")]}
            
        return node_function

    def create_tool_execution_node(self, allowed_tools: list):
        """Generates a node specifically bound to a restricted set of tools."""
        from langgraph.prebuilt import ToolExecutor, ToolInvocation
        from langchain_core.messages import HumanMessage
        
        executor = ToolExecutor(allowed_tools)
        
        def tool_node(state):
            last_message = state['messages'][-1].content
            # Complex tool parsing logic goes here.
            # Simplified for structure:
            print(f"[TOOL EXECUTOR NODE] Processing tools...")
            # If a tool call is detected, parse and invoke
            return {"messages": [HumanMessage(content="Tool execution simulated in factory setup.")]}
            
        return tool_node
