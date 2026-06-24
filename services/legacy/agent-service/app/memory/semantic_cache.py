import uuid
from datetime import datetime
from app.memory.qdrant_client import qdrant_manager
from app.memory.embedder import SemanticEmbedder
from qdrant_client.http.models import PointStruct, Filter, FieldCondition, MatchValue

class SemanticCache:
    """
    Prevents duplicate LLM calls by checking if the exact same architectural 
    question was asked by this tenant recently. Evolved for Long-Term Memory
    optimization by incorporating timestamps and recency tracking.
    """
    def __init__(self):
        self.qdrant = qdrant_manager.get_client()
        self.embedder = SemanticEmbedder()
        self.collection = "ecosystem_memory"

    def check_cache(self, tenant_id: str, query: str, threshold: float = 0.95):
        vector = self.embedder.embed_text(query)
        
        # Must enforce strict tenant isolation during semantic search
        tenant_filter = Filter(
            must=[FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id))]
        )
        
        results = self.qdrant.search(
            collection_name=self.collection,
            query_vector=vector,
            query_filter=tenant_filter,
            limit=5  # Get top 5 to apply recency bias
        )
        
        # Filter by threshold
        valid_results = [r for r in results if r.score >= threshold]
        
        if valid_results:
            # Sort by timestamp (recency bias) if available, falling back to older records
            valid_results.sort(
                key=lambda r: r.payload.get("timestamp", "1970-01-01T00:00:00.000000"), 
                reverse=True
            )
            print(f"[SEMANTIC CACHE] Cache hit for query: '{query}' (Score: {valid_results[0].score}, Timestamp: {valid_results[0].payload.get('timestamp')})")
            return valid_results[0].payload.get("answer")
            
        return None

    def store_cache(self, tenant_id: str, query: str, answer: str):
        vector = self.embedder.embed_text(query)
        current_time = datetime.utcnow().isoformat()
        
        self.qdrant.upsert(
            collection_name=self.collection,
            points=[
                PointStruct(
                    id=str(uuid.uuid4()),
                    vector=vector,
                    payload={
                        "tenant_id": tenant_id, 
                        "query": query, 
                        "answer": answer, 
                        "type": "cache",
                        "timestamp": current_time
                    }
                )
            ]
        )
