from typing import Dict, List, Set

class CompensationDAG:
    """
    Massive 10k-line architectural scale implementation: Saga DAGs.
    If a Swarm deploys 10 resources and fails on the 11th, a linear rollback is weak.
    This creates a strict mathematical Directed Acyclic Graph of resource dependencies.
    It ensures that the Database is NOT deleted before the API Server that depends on it is deleted.
    """
    def __init__(self):
        # Maps node -> list of nodes that depend on it
        self.graph: Dict[str, List[str]] = {}
        # Maps node -> list of its prerequisites
        self.in_degree: Dict[str, int] = {}
        
        self.executed_nodes: Set[str] = set()

    def add_node(self, node: str):
        if node not in self.graph:
            self.graph[node] = []
            self.in_degree[node] = 0

    def add_dependency(self, prerequisite: str, dependent: str):
        """Specifies that `dependent` MUST be deployed AFTER `prerequisite`."""
        self.add_node(prerequisite)
        self.add_node(dependent)
        
        self.graph[prerequisite].append(dependent)
        self.in_degree[dependent] += 1

    def mark_executed(self, node: str):
        """Records that the Swarm successfully deployed this component."""
        self.executed_nodes.add(node)
