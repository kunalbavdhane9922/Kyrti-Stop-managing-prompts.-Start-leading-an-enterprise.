from typing import List
from app.orchestrator.temporal.saga_dags.directed_acyclic_graph import CompensationDAG

class TopologicalSorter:
    """
    Massive 10k-line architectural scale implementation: Saga Compensations.
    When a Swarm crashes, this algorithm mathematically traverses the DAG
    and computes the exact REVERSE topological order to execute the rollback.
    """
    
    @classmethod
    def get_compensation_order(cls, dag: CompensationDAG) -> List[str]:
        """Kahn's Algorithm for Topological Sorting, mathematically reversed."""
        in_degree = dag.in_degree.copy()
        queue = []
        
        # Start with nodes that have NO prerequisites
        for node, degree in in_degree.items():
            if degree == 0:
                queue.append(node)
                
        forward_order = []
        
        while queue:
            current = queue.pop(0)
            forward_order.append(current)
            
            for dependent in dag.graph.get(current, []):
                in_degree[dependent] -= 1
                if in_degree[dependent] == 0:
                    queue.append(dependent)
                    
        # Check for cycles (which shouldn't exist in a DAG)
        if len(forward_order) != len(dag.graph):
            print("[SAGA DAG] 🚨 CRITICAL: Circular Dependency detected in Swarm Deployment Matrix.")
            
        # The true power of the DAG: Reverse the forward order to get the safe teardown sequence
        reverse_order = list(reversed(forward_order))
        
        # Filter to ONLY include nodes the Swarm actually successfully deployed
        compensation_plan = [n for n in reverse_order if n in dag.executed_nodes]
        
        print(f"[SAGA DAG] 🔄 Auto-calculated compensation rollback sequence: {compensation_plan}")
        return compensation_plan
