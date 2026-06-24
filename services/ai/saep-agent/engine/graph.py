"""
Digital Professional Execution Graph (LangGraph)

This is the core LangGraph execution engine for SAEP Digital Professionals.
It implements the Standard Agent Graph from LangGraph.md:

    Task Received → Context Loading → Memory Retrieval → Reasoning →
    Tool Selection → Tool Execution → Result Evaluation → Response

Architecture (from Runtime.md):
    Task → Runtime → LangGraph → Tools → Services → Result

Rules enforced:
    - Every Digital Professional Executes Through LangGraph (LangGraph.md Rule 1)
    - Agents Must Use Approved Tools Only (LangGraph.md Rule 2)
    - Memory Access Must Respect Permissions (LangGraph.md Rule 3)
    - Agents Do Not Possess Governance Authority (LangGraph.md Rule 5)
    - Human Approval Remains Required For Governance Actions (LangGraph.md Rule 6)
"""

import json
import os
import logging
from typing import TypedDict, Annotated, Sequence
import operator
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage, BaseMessage
from engine.memory import memory_client, graph_client
from engine.governance import governance_client
from engine.tools import standard_tools

logger = logging.getLogger(__name__)

# LLM Provider configuration (from environment, never hardcoded)
_PROVIDER = os.getenv("LLM_PROVIDER", "ollama").lower()

if _PROVIDER == "ollama":
    llm = ChatOllama(
        model=os.getenv("OLLAMA_MODEL", "llama3"),
        base_url=os.getenv("OLLAMA_BASE_URL", "http://ollama:11434"),
    )
else:
    llm = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-4"),
        api_key=os.getenv("OPENAI_API_KEY"),
    )


class AgentState(TypedDict):
    task_id: str
    worker_id: str
    input_text: str
    memory_context: str
    graph_context: str
    reasoning: str
    decision: str
    requires_approval: bool
    status: str
    messages: Annotated[Sequence[BaseMessage], operator.add]
    action_payload: dict


def retrieve_context(state: AgentState) -> dict:
    """
    Context Loading + Memory Retrieval (LangGraph.md Standard Agent Graph steps 2-3).

    1. Structural Knowledge from Neo4j (via saep-graph API)
    2. Semantic Knowledge from Qdrant (via saep-memory API)
    """
    # 1. Structural Knowledge from Neo4j
    graph_context = graph_client.get_worker_context(state["worker_id"])

    # 2. Semantic Knowledge from Qdrant
    from context import tenant_id_ctx
    tenant_id = tenant_id_ctx.get()
    try:
        memories = memory_client.search_memories(
            tenant_id=tenant_id, query=state["input_text"], scope="PERSONAL", limit=3
        )
        if memories:
            memory_context = "\n".join([m.get("content", "") for m in memories])
        else:
            memory_context = "No relevant past memories found."
    except Exception:
        memory_context = "No relevant past memories found."

    # Initialize the messages list with system prompt if this is the first run
    messages = state.get("messages", [])
    if not messages:
        system_prompt = (
            f"You are a Digital Professional operating in the SAEP ecosystem.\n"
            f"Your ID is: {state['worker_id']}\n"
            f"Your structural graph context: {json.dumps(graph_context)}\n"
            f"Your past semantic memories: {memory_context}\n\n"
            f"You have access to a set of tools. You may use them to gather "
            f"information or send communications.\n"
            f"When you have gathered all necessary context and are ready to "
            f"finalize your task, output a JSON response containing exactly:\n"
            f'- "reasoning": your thought process\n'
            f'- "decision": the final action (e.g., RECOMMEND_HIRE, PROPOSE_STRATEGY)\n'
            f'- "action_payload": any data for the action'
        )
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=state["input_text"]),
        ]

    return {
        "graph_context": json.dumps(graph_context),
        "memory_context": memory_context,
        "messages": messages,
    }


def reason(state: AgentState) -> dict:
    """
    Reasoning node — invokes the LLM with bound SAEP tools.

    If the LLM requests a tool call, returns the message for routing to ToolNode.
    If the LLM returns a final JSON response, extracts reasoning/decision/action_payload.
    """
    # Bind the available SAEP tools to the LLM
    bound_llm = llm.bind_tools(standard_tools)

    response = bound_llm.invoke(state["messages"])

    # If the LLM called a tool, return the message so the graph routes to ToolNode
    if response.tool_calls:
        return {"messages": [response]}

    # Otherwise, it should be the final JSON response
    try:
        data = json.loads(response.content)
        return {
            "reasoning": data.get("reasoning", ""),
            "decision": data.get("decision", ""),
            "action_payload": data.get("action_payload", {}),
            "messages": [response],
        }
    except (json.JSONDecodeError, TypeError):
        # LLM returned non-JSON — treat as reasoning text with unknown decision
        return {
            "reasoning": response.content,
            "decision": "UNKNOWN",
            "action_payload": {},
            "messages": [response],
        }


def validate_policy(state: AgentState) -> dict:
    """
    Governance validation — synchronous call to saep-governance API.

    Per AgentPermissions.md: "Governance Actions Require Human Approval" (Rule 8).
    The governance service returns whether the action needs approval, is rejected, or is allowed.
    """
    validation = governance_client.validate_policy(
        worker_id=state["worker_id"],
        action_type=state.get("decision", "UNKNOWN"),
        proposed_payload=state.get("action_payload", {}),
    )

    if validation["status"] in ("REJECTED", "ERROR"):
        return {
            "status": "Failed",
            "requires_approval": False,
            "decision": "ACCESS_DENIED",
            "reasoning": f"Governance validation failed: {validation.get('error', 'Unknown Error')}",
        }

    return {
        "status": "Review" if validation["requires_approval"] else "Completed",
        "requires_approval": validation["requires_approval"],
    }


def execute_action(state: AgentState) -> dict:
    """
    Action execution — only runs if saep-governance approved the action.
    """
    return {"status": "Completed"}


def build_graph():
    """
    Build the Standard Agent Graph (LangGraph.md):

        retrieve_context → reason → (tools ↔ reason) → validate_policy → execute_action → END
    """
    workflow = StateGraph(AgentState)

    workflow.add_node("retrieve_context", retrieve_context)
    workflow.add_node("reason", reason)
    workflow.add_node("tools", ToolNode(standard_tools))
    workflow.add_node("validate_policy", validate_policy)
    workflow.add_node("execute_action", execute_action)

    workflow.set_entry_point("retrieve_context")
    workflow.add_edge("retrieve_context", "reason")

    # Dynamic routing from reason: if LLM requested tools → ToolNode, else → governance
    def route_reasoning(state: AgentState) -> str:
        messages = state.get("messages", [])
        last_message = messages[-1] if messages else None
        if last_message and hasattr(last_message, "tool_calls") and last_message.tool_calls:
            return "tools"
        return "validate_policy"

    workflow.add_conditional_edges(
        "reason",
        route_reasoning,
        {"tools": "tools", "validate_policy": "validate_policy"},
    )
    workflow.add_edge("tools", "reason")

    # Post-governance routing: if failed or needs approval → END, else → execute
    def check_approval(state: AgentState) -> str:
        if state.get("status") == "Failed":
            return "end"
        if state.get("requires_approval"):
            return "end"
        return "execute"

    workflow.add_conditional_edges(
        "validate_policy",
        check_approval,
        {"end": END, "execute": "execute_action"},
    )
    workflow.add_edge("execute_action", END)

    return workflow.compile()


agent_executor = build_graph()
