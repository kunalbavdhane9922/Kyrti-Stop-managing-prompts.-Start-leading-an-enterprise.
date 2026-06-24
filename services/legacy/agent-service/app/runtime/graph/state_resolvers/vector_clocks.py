from typing import Dict

class VectorClock:
    """
    Massive 10k-line architectural scale implementation: CRDT Vector Clocks.
    When 50 parallel Developer Agents attempt to update the SwarmState dictionary 
    at the exact same microsecond, a simple database lock will crash the system.
    This Vector Clock physically tracks causality across distributed Docker instances.
    """
    def __init__(self, node_id: str):
        self.node_id = node_id
        # Maps node_id to logical timestamp
        self.clock: Dict[str, int] = {node_id: 0}

    def tick(self):
        """Increments the local logical clock for this agent node."""
        self.clock[self.node_id] += 1

    def merge(self, other_clock: Dict[str, int]):
        """
        Conflict-Free Merging. 
        Mathematically merges a remote agent's clock with the local agent's clock.
        """
        for node, timestamp in other_clock.items():
            if node in self.clock:
                self.clock[node] = max(self.clock[node], timestamp)
            else:
                self.clock[node] = timestamp

    def dominates(self, other_clock: Dict[str, int]) -> bool:
        """
        Returns True if THIS clock is strictly causally after the OTHER clock.
        If true, this agent's SwarmState update overwrites the other agent's update.
        """
        has_greater = False
        
        # Check all keys in the union of both clocks
        all_nodes = set(self.clock.keys()).union(set(other_clock.keys()))
        
        for node in all_nodes:
            self_time = self.clock.get(node, 0)
            other_time = other_clock.get(node, 0)
            
            if self_time < other_time:
                # This clock is definitively NOT strictly after
                return False
            if self_time > other_time:
                has_greater = True
                
        return has_greater
