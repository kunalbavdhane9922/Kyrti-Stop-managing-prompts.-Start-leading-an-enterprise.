from typing import Dict, Any, List
from langchain_core.messages import AIMessage
from app.runtime.graph.nodes.base_node import BaseNodeStrategy
from app.runtime.swarm.models.swarm_state import SwarmState, SubAgentTask

class QAConsensusNodeStrategy(BaseNodeStrategy):
    """
    The 'CONSENSUS' phase.
    Code is not allowed to merge unless a panel of QA Agents mathematically reaches a 2/3 majority vote.
    """
    def __init__(self):
        super().__init__(node_name="Swarm_QA_Consensus")

    def execute(self, state: SwarmState) -> Dict[str, Any]:
        print(f"[{self.node_name}] QA Panel convened. Reviewing {len(state.subtasks)} parallel streams.")
        
        all_passed = True
        
        for st in state.subtasks:
            # Simulate a 3-agent QA Panel voting on the code chunk
            # In production, this would trigger 3 parallel LLM execution runs
            st.qa_votes = {
                "QA_Bot_Alpha": "PASS",
                "QA_Bot_Beta": "PASS",
                "QA_Bot_Gamma": "FAIL" # One hallucination or strict reviewer
            }
            
            pass_votes = sum(1 for vote in st.qa_votes.values() if vote == "PASS")
            total_votes = len(st.qa_votes)
            
            # Mathematical majority (e.g. 2 out of 3 is 66%, greater than 50%)
            if pass_votes > (total_votes / 2):
                print(f"[{self.node_name}] SubTask {st.task_id} PASSED Consensus ({pass_votes}/{total_votes}).")
                st.status = "COMPLETED"
            else:
                print(f"[{self.node_name}] SubTask {st.task_id} FAILED Consensus. Routing back to developer.")
                st.status = "FAILED"
                all_passed = False
                
        state.consensus_reached = all_passed
        
        status_msg = "Consensus Reached. Proceeding to Merge." if all_passed else "Consensus Failed. Rerunning specific developers."
        return {
            "subtasks": state.subtasks,
            "consensus_reached": all_passed,
            "messages": [AIMessage(content=f"[QA PANEL] {status_msg}")]
        }
