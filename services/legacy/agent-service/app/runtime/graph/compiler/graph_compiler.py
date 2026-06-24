from typing import List, Dict
from langgraph.graph import StateGraph, END
from app.runtime.graph.models.dna_schema import ProfessionDNASchema
from app.runtime.swarm.models.swarm_state import SwarmState

# Import the massive Swarm Nodes
from app.runtime.swarm.coordinator.map_reduce import ArchitectNodeStrategy, MergeNodeStrategy
from app.runtime.swarm.coordinator.consensus import QAConsensusNodeStrategy

# Import the base execution node
from app.runtime.graph.nodes.tool_node import ToolExecutionNodeStrategy

class DynamicGraphCompiler:
    """
    Massive Swarm Graph Compiler.
    Does not build a simple linear loop. It physically wires an Architect Node 
    to branch out into parallel Developer/Tool nodes, converges them into a QA Consensus Panel, 
    and then either loops back to Developers or merges the PR.
    """
    def __init__(self):
        # We now compile using the nested SwarmState instead of the base state
        self.graph_builder = StateGraph(SwarmState)

    def _should_merge(self, state: SwarmState) -> str:
        """Conditional Edge: Checks if the QA Panel reached a 2/3 majority."""
        if state.consensus_reached:
            return "merge_phase"
        return "developer_phase"

    def compile_swarm_matrix(self, dna: ProfessionDNASchema):
        print(f"[COMPILER] Initiating massive swarm compilation for DNA: {dna.role_title}")

        # 1. Instantiate the Hive Mind core
        architect = ArchitectNodeStrategy()
        consensus = QAConsensusNodeStrategy()
        merger = MergeNodeStrategy()
        
        # 2. Instantiate the Execution Engine
        developer = ToolExecutionNodeStrategy(allowed_tools=dna.tools_granted)

        # 3. Add nodes to the computational graph
        self.graph_builder.add_node("Architect", architect.execute)
        self.graph_builder.add_node("Developer_Swarm", developer.execute)
        self.graph_builder.add_node("QA_Consensus", consensus.execute)
        self.graph_builder.add_node("Merger", merger.execute)

        # 4. Wire the massive branching matrix
        # Entry point is the Architect who shatters the task
        self.graph_builder.set_entry_point("Architect")
        
        # Architect dispatches work to the parallel Developer Swarm
        self.graph_builder.add_edge("Architect", "Developer_Swarm")
        
        # Developers submit work to the QA Panel
        self.graph_builder.add_edge("Developer_Swarm", "QA_Consensus")
        
        # Conditional Edge: If QA Panel passes, merge. If it fails, send back to Developers.
        self.graph_builder.add_conditional_edges(
            "QA_Consensus",
            self._should_merge,
            {
                "merge_phase": "Merger",
                "developer_phase": "Developer_Swarm"
            }
        )

        # After merging, the swarm execution is formally finished
        self.graph_builder.add_edge("Merger", END)

        # Compile the executable matrix
        print(f"[COMPILER] Swarm Matrix compiled successfully with conditional Map-Reduce branching.")
        return self.graph_builder.compile()
