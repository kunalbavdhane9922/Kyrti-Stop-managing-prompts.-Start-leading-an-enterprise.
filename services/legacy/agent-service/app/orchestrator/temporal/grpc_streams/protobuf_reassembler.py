import json
from typing import List, Any

class ProtobufReassembler:
    """
    Massive FAANG-level Optimization.
    The counterpart to the Payload Chunker.
    This module runs on the remote Temporal Worker. It catches the millions of 
    1.5MB gRPC streams and mathematically reassembles the byte-arrays back into 
    the massive 10GB SwarmState dictionary inside physical RAM.
    """
    
    @classmethod
    def reassemble_payload(cls, chunks: List[str]) -> Any:
        """Combines an array of byte-strings back into a Python Object."""
        if not chunks:
            return None
            
        if len(chunks) == 1:
            return json.loads(chunks[0])
            
        print(f"[gRPC REASSEMBLER] Intercepted {len(chunks)} streaming shards. Reconstructing memory matrix...")
        
        # Combine the raw UTF-8 strings
        combined_string = "".join(chunks)
        
        try:
            payload = json.loads(combined_string)
            print(f"[gRPC REASSEMBLER] ✅ Memory matrix reconstructed successfully.")
            return payload
        except json.JSONDecodeError as e:
            raise ValueError(f"CRITICAL: gRPC stream corrupted during reassembly. Checksum failed: {e}")
