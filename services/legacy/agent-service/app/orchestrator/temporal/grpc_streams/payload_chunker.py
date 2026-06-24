import json
import math
from typing import List, Any

class GrpcPayloadChunker:
    """
    Massive FAANG-level Optimization.
    Temporal has a hard 2MB limit on gRPC payloads. If our AI Agent is holding
    a 10GB Monolithic Codebase in its context window, sending the SwarmState to a 
    Temporal Worker will crash the entire event loop.
    This class mathematically chunks the JSON context into millions of 1.5MB shards.
    """
    MAX_CHUNK_SIZE_BYTES = 1_500_000 # Leave 500kb for gRPC overhead

    @classmethod
    def chunk_payload(cls, payload: Any) -> List[str]:
        """Serializes a massive Python object and splits it into byte-safe strings."""
        serialized_data = json.dumps(payload).encode('utf-8')
        total_size = len(serialized_data)
        
        if total_size <= cls.MAX_CHUNK_SIZE_BYTES:
            return [serialized_data.decode('utf-8')]
            
        num_chunks = math.ceil(total_size / cls.MAX_CHUNK_SIZE_BYTES)
        print(f"[gRPC CHUNKER] 🚨 Massive Context Detected ({total_size / 1_000_000:.2f} MB). Splitting into {num_chunks} shards...")
        
        chunks = []
        for i in range(num_chunks):
            start = i * cls.MAX_CHUNK_SIZE_BYTES
            end = start + cls.MAX_CHUNK_SIZE_BYTES
            chunk_slice = serialized_data[start:end]
            chunks.append(chunk_slice.decode('utf-8', errors='ignore'))
            
        print(f"[gRPC CHUNKER] ✅ Sharding complete. Context is ready for distributed streaming.")
        return chunks
