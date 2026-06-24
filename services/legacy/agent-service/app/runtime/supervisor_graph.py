import json
from typing import TypedDict, Annotated, Sequence, List
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langgraph.graph import StateGraph, END
from langchain_community.llms import Ollama
from app.core.config import settings

# Import Tools
from app.runtime.tools.analysis_tools import list_directory, view_file, grep_search
from app.runtime.tools.coding_tools import write_to_file, replace_file_content
from app.runtime.tools.devops_tools import run_shell_command, clone_company_repository, create_feature_branch, commit_and_push_changes, create_pull_request
from langgraph.prebuilt import ToolExecutor, ToolInvocation, create_react_agent

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], "The conversation history"]
    next_agent: str
    task: str

class SAEPUniversalEngine:
    """
    The Ultimate Cognitive Architecture.
    Implements a Supervisor Network that routes tasks to specialized subagents.
    """
    def __init__(self, tenant_id: str, github_repo_url: str, github_token: str, professional_dna: dict):
        # Initialize context for tools
        from app.runtime.tools.core import AgentContext
        AgentContext.tenant_id = tenant_id
        AgentContext.github_repo_url = github_repo_url
        AgentContext.github_token = github_token
        
        self.llm = Ollama(base_url=settings.OLLAMA_BASE_URL, model=settings.OLLAMA_MODEL, temperature=0)
        
        # Tool Executors and ReAct Agents for subagents
        self.analysis_executor = ToolExecutor([list_directory, view_file, grep_search])
        self.coder_executor = ToolExecutor([write_to_file, replace_file_content])
        self.devops_executor = ToolExecutor([clone_company_repository, create_feature_branch, commit_and_push_changes, create_pull_request, run_shell_command])
        
        self.coder_agent = create_react_agent(self.llm, tools=[write_to_file, replace_file_content])
        self.qa_agent = create_react_agent(self.llm, tools=[list_directory, view_file, grep_search])
        self.devops_agent = create_react_agent(self.llm, tools=[clone_company_repository, create_feature_branch, commit_and_push_changes, create_pull_request, run_shell_command])
        
        # Build the Multi-Agent Graph
        workflow = StateGraph(AgentState)
        
        workflow.add_node("Supervisor", self.supervisor_node)
        workflow.add_node("Coder", self.coder_node)
        workflow.add_node("QA", self.qa_node)
        workflow.add_node("DevOps", self.devops_node)
        
        workflow.set_entry_point("Supervisor")
        
        # The supervisor decides who goes next
        workflow.add_conditional_edges(
            "Supervisor",
            lambda state: state.get("next_agent", "FINISH"),
            {
                "Coder": "Coder",
                "QA": "QA",
                "DevOps": "DevOps",
                "FINISH": END
            }
        )
        
        # Subagents always report back to the Supervisor
        workflow.add_edge("Coder", "Supervisor")
        workflow.add_edge("QA", "Supervisor")
        workflow.add_edge("DevOps", "Supervisor")
        
        self.graph = workflow.compile()
        self.professional_dna = professional_dna

    def supervisor_node(self, state: AgentState):
        """Analyzes the current state and routes to a subagent."""
        history = "\n".join([m.content for m in state["messages"][-5:]])
        
        prompt = f"""You are the SAEP Universal Engine Supervisor.
Your DNA: {json.dumps(self.professional_dna)}

Current Task: {state['task']}

Recent History:
{history}

Evaluate the state of the project. Who needs to act next?
Respond EXACTLY with one of the following words:
- 'DevOps' (if you need to clone the repo, run a script, or create a PR)
- 'Coder' (if code needs to be written or edited)
- 'QA' (if code needs to be tested or reviewed)
- 'FINISH' (if the Pull Request is opened and the task is complete)
"""
        response = self.llm.invoke(prompt).strip()
        print(f"[SUPERVISOR DECISION] -> {response}")
        
        if response not in ["Coder", "QA", "DevOps", "FINISH"]:
            response = "DevOps" # Default safe fallback
            
        return {"next_agent": response, "messages": [AIMessage(content=f"Supervisor delegated to {response}")]}

    def coder_node(self, state: AgentState):
        """Handles code writing via coding_tools."""
        print(f"[CODER ACTION] -> Starting ReAct loop for: {state['task']}")
        result = self.coder_agent.invoke({"messages": state["messages"]})
        return {"messages": [AIMessage(content=f"Coder Output: {result['messages'][-1].content}")]}

    def qa_node(self, state: AgentState):
        """Handles testing and verification."""
        print(f"[QA ACTION] -> Starting ReAct loop for QA...")
        result = self.qa_agent.invoke({"messages": state["messages"]})
        return {"messages": [AIMessage(content=f"QA Output: {result['messages'][-1].content}")]}

    def devops_node(self, state: AgentState):
        """Handles Git operations."""
        # For MVP, automatically execute the clone if it's the first step
        if len(state["messages"]) < 3:
            print("[DEVOPS ACTION] -> Cloning repository...")
            from app.runtime.tools.devops_tools import clone_company_repository
            res = clone_company_repository()
            return {"messages": [AIMessage(content=f"DevOps Output: {res}")]}
            
        print(f"[DEVOPS ACTION] -> Starting ReAct loop for DevOps...")
        result = self.devops_agent.invoke({"messages": state["messages"]})
        return {"messages": [AIMessage(content=f"DevOps Output: {result['messages'][-1].content}")]}

    def execute_task(self, task: str):
        print("=" * 60)
        print(f"BOOTING UNIVERSAL ENGINE MASTER: Task = {task}")
        print("=" * 60)
        
        initial_state = {
            "messages": [HumanMessage(content=f"INITIAL TASK ASSIGNMENT: {task}")],
            "task": task,
            "next_agent": "Supervisor"
        }
        
        result = self.graph.invoke(initial_state, {"recursion_limit": 25})
        return result
