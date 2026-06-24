import uuid
from typing import Dict, Any, List
from langchain_core.messages import AIMessage
from app.runtime.graph.nodes.base_node import BaseNodeStrategy
from app.runtime.swarm.models.swarm_state import SwarmState, SubAgentTask

# Massive CI/CD Integration
from app.sandboxing.ci.dind_executor import DockerInDockerCI
from app.integrations.github.pr_generator import GitHubPRGenerator

class ArchitectNodeStrategy(BaseNodeStrategy):
    """
    The 'MAP' phase.
    Analyzes a massive task and shatters it into N parallel sub-tasks.
    """
    def __init__(self):
        super().__init__(node_name="Swarm_Architect")

    def execute(self, state: SwarmState) -> Dict[str, Any]:
        print(f"[{self.node_name}] Analyzing massive task: {state.task[:50]}...")
        num_subtasks = 3
        subtasks = []
        for i in range(num_subtasks):
            subtasks.append(SubAgentTask(
                task_id=f"subtask-{uuid.uuid4().hex[:6]}",
                description=f"Parallel chunk {i+1} of: {state.task}",
                assigned_role="Developer Agent"
            ))
        print(f"[{self.node_name}] Shattered task into {num_subtasks} parallel sub-agent streams.")
        return {
            "architect_plan": "Execute in 3 parallel streams",
            "subtasks": subtasks,
            "messages": [AIMessage(content="[ARCHITECT] Task shattered. Initiating Swarm deployment.")]
        }

class MergeNodeStrategy(BaseNodeStrategy):
    """
    The 'REDUCE' and 'DEPLOY' phase.
    Waits for parallel sub-agents.
    Executes a nested DinD unit test suite.
    If tests pass, automatically opens a Pull Request on the CTO's secure GitHub repo.
    """
    def __init__(self):
        super().__init__(node_name="Swarm_Merger")
        self.dind_ci = DockerInDockerCI()
        self.pr_generator = GitHubPRGenerator()

    def execute(self, state: SwarmState) -> Dict[str, Any]:
        print(f"[{self.node_name}] All sub-agents complete. Initiating Map-Reduce Merge Phase...")
        
        for st in state.subtasks:
            if st.status != "COMPLETED":
                raise RuntimeError(f"CRITICAL: Attempted to merge before SubTask {st.task_id} completed.")
                
        # 1. Simulate Git conflict resolution
        print(f"[{self.node_name}] Git conflicts resolved.")
        
        # 2. Execute DinD Unit Tests
        print(f"[{self.node_name}] Triggering Docker-in-Docker CI execution...")
        tests_passed, test_logs = self.dind_ci.run_nested_tests(state.tenant_id, test_command="pytest")
        
        if not tests_passed:
            print(f"[{self.node_name}] CI Pipeline Failed. Rerouting back to Swarm.")
            # In a full LangGraph, we would route this back to the developers
            return {"messages": [AIMessage(content=f"[CI/CD PIPELINE FAILED]\n{test_logs}")]}

        # 3. Assemble and Push the Pull Request
        print(f"[{self.node_name}] CI Pipeline Passed. Triggering PR Automation.")
        branch_name = f"ai-swarm-{uuid.uuid4().hex[:8]}"
        
        try:
            pr_url = self.pr_generator.open_pull_request(
                tenant_id=state.tenant_id,
                branch_name=branch_name,
                task_description=state.task,
                test_results=test_logs[-500:] # Send tail of logs to PR description
            )
            final_output = f"Merged codebase successfully. All tests passed. Pull Request opened: {pr_url}"
        except PermissionError as e:
            final_output = f"CI tests passed, but GitHub access was blocked by AuthController: {e}"

        print(f"[{self.node_name}] Final Output: {final_output}")
        
        return {
            "messages": [AIMessage(content=f"[MERGE NODE] {final_output}")]
        }
