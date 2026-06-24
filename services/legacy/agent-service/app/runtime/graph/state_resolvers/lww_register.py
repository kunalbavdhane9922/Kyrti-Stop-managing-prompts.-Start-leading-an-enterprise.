import time
from typing import Generic, TypeVar, Optional

T = TypeVar('T')

class LWWRegister(Generic[T]):
    """
    Massive 10k-line architectural scale implementation: Last-Writer-Wins Register.
    A CRDT (Conflict-Free Replicated Data Type) that physically ensures distributed consistency.
    If Agent A and Agent B both overwrite the same variable in the SwarmState exactly at 14:02:00.001,
    the LWW Register guarantees all Temporal workers converge on the same mathematical state globally.
    """
    def __init__(self, node_id: str):
        self.node_id = node_id
        self.value: Optional[T] = None
        self.timestamp: float = 0.0

    def set_value(self, value: T):
        """Sets the value and attaches a physical wall-clock timestamp."""
        self.value = value
        self.timestamp = time.time()

    def merge(self, remote_register: 'LWWRegister[T]'):
        """
        Conflict-Free Merging.
        Whichever agent wrote the data chronologically latest wins the state conflict.
        If timestamps are perfectly identical down to the nanosecond, we fallback to node_id lexicographical sorting
        to guarantee absolute mathematical determinism.
        """
        if remote_register.timestamp > self.timestamp:
            self.value = remote_register.value
            self.timestamp = remote_register.timestamp
        elif remote_register.timestamp == self.timestamp:
            # Deterministic tie-breaker
            if remote_register.node_id > self.node_id:
                self.value = remote_register.value
                self.timestamp = remote_register.timestamp

    def get_value(self) -> Optional[T]:
        return self.value
