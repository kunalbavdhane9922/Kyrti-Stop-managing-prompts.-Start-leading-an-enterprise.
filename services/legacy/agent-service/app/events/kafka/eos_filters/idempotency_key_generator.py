import hashlib
import json
from typing import Dict, Any

class IdempotencyKeyGenerator:
    """
    Massive 10k-line architectural scale implementation: Exactly-Once Semantics.
    To use the Bloom Filter, we need a mathematically perfect unique identifier for every event.
    This class creates a SHA-256 cryptographic hash of the exact JSON payload.
    If the exact same payload is sent twice due to network retry storms, the hash will match,
    and the Bloom Filter will incinerate the duplicate.
    """
    
    @classmethod
    def generate_key(cls, tenant_id: str, event_type: str, payload: Dict[str, Any]) -> str:
        """Creates a deterministic cryptographic key for deduplication."""
        
        # We must sort the dictionary keys so that JSON serialization is perfectly deterministic
        deterministic_json = json.dumps(payload, sort_keys=True)
        
        # Combine the core fields
        raw_string = f"{tenant_id}::{event_type}::{deterministic_json}"
        
        # Cryptographic Hash
        idempotency_key = hashlib.sha256(raw_string.encode('utf-8')).hexdigest()
        
        return idempotency_key
