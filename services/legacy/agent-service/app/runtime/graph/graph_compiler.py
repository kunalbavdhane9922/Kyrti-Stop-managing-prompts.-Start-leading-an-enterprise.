from typing import TypedDict, Annotated, Sequence, Dict
from langchain_core.messages import BaseMessage
from langgraph.graph import StateGraph, END
from app.runtime.graph.node_factory import DynamicNodeFactory

class DynamicAgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], "The conversation history"]
    task: str
    metadata: dict

class DynamicGraphCompiler:
    """
    Reads the Digital Professional's ProfessionTemplate DNA and compiles 
    a custom LangGraph StateMachine tailored exclusively to their role.
    """
    def __init__(self):
        self.node_factory = DynamicNodeFactory()

    def compile_graph(self, dna_profile: dict) -> StateGraph:
        """
        Dynamically builds the execution graph.
        e.g., A Frontend Engineer gets a UI-focused analysis node.
        A Data Scientist gets a Python Jupyter analysis node.
        """
        workflow = StateGraph(DynamicAgentState)
        role = dna_profile.get("role", "Generic Agent")
        skills = dna_profile.get("skills", [])
        
        print(f"[GRAPH COMPILER] Building dynamic graph for Role: {role}")
        
        # Core Reasoning Node
        reasoning_node = self.node_factory.create_reasoning_node(
            role_name=role,
            skills=skills,
            constraints="Strictly adhere to the Company Architecture Docs."
        )
        
        # Core Tool Node
        # In a real system, we look up the allowed tools based on DNA
        tool_node = self.node_factory.create_tool_execution_node(allowed_tools=[])
        
        workflow.add_node("reasoning", reasoning_node)
        workflow.add_node("tool_execution", tool_node)
        
        workflow.set_entry_point("reasoning")
        
        # Dynamic Edge Routing (simplified conditional edge)
        workflow.add_conditional_edges(
            "reasoning",
            self._route_logic,
            {
                "execute_tool": "tool_execution",
                "finish": END
            }
        )
        workflow.add_edge("tool_execution", "reasoning")
        
        return workflow.compile()

    def _route_logic(self, state: DynamicAgentState) -> str:
        last_message = state["messages"][-1].content
        if "FINAL_ANSWER" in last_message:
            return "finish"
        return "execute_tool"
