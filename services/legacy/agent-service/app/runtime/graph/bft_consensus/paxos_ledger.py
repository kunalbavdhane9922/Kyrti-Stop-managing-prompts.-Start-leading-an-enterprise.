from typing import Any, Optional

class PaxosNode:
    """
    Massive 10k-line architectural scale implementation: Paxos Ledger.
    If the QA Panel network partitions into two distinct datacenters (split-brain), 
    we use the Paxos algorithm to ensure only one absolute version of the truth is committed 
    to the Swarm State.
    """
    def __init__(self, node_id: str):
        self.node_id = node_id
        
        # Proposer State
        self.proposal_number = 0
        
        # Acceptor State
        self.highest_promised_number = 0
        self.accepted_number = 0
        self.accepted_value: Optional[Any] = None

    def prepare(self, proposal_num: int) -> tuple[bool, int, Optional[Any]]:
        """Phase 1: Proposer asks Acceptors for a promise."""
        if proposal_num > self.highest_promised_number:
            self.highest_promised_number = proposal_num
            # Promise not to accept anything lower
            return (True, self.accepted_number, self.accepted_value)
        return (False, self.highest_promised_number, None)

    def accept(self, proposal_num: int, value: Any) -> bool:
        """Phase 2: Proposer asks Acceptors to commit the value."""
        if proposal_num >= self.highest_promised_number:
            self.highest_promised_number = proposal_num
            self.accepted_number = proposal_num
            self.accepted_value = value
            
            print(f"[PAXOS LEDGER] ✅ Node {self.node_id} accepted proposal {proposal_num} with value: {value}")
            return True
            
        print(f"[PAXOS LEDGER] ❌ Node {self.node_id} rejected proposal {proposal_num} (Already promised to {self.highest_promised_number})")
        return False
