import uuid
from typing import Optional
from qdrant_client.http.models import PointStruct
from app.memory.vector_db.qdrant_manager import qdrant_manager
from app.memory.processing.embedder import SemanticEmbedder

class SemanticCache:
    """
    Massive caching system to slash LLM costs.
    Dynamically determines if a cache lookup is worth the latency compared to just 
    regenerating the thought via LLM.
    """
    def __init__(self):
        self.qdrant = qdrant_manager
        self.embedder = SemanticEmbedder()
        self.confidence_threshold = 0.95

    async def check_cache(self, tenant_id: str, query: str, estimated_llm_cost: float) -> Optional[str]:
        # Cost Optimization: If the query is so simple it costs < $0.0001,
        # don't waste time querying the vector database.
        if estimated_llm_cost < 0.0001:
            return None
            
        vector = await self.embedder.embed_text_async(query)
        
        # We use the securely isolated qdrant search
        results = self.qdrant.secure_search(
            tenant_id=tenant_id,
            query_vector=vector,
            limit=1,
            min_score=self.confidence_threshold
        )
        
        if results:
            print(f"[SEMANTIC CACHE] Cache hit for Tenant {tenant_id}. Saved ${estimated_llm_cost:.4f}.")
            return results[0].payload.get("answer")
            
        return None

    async def store_cache(self, tenant_id: str, query: str, answer: str):
        vector = await self.embedder.embed_text_async(query)
        point = PointStruct(
            id=str(uuid.uuid4()),
            vector=vector,
            payload={
                "tenant_id": tenant_id, 
                "query": query, 
                "answer": answer, 
                "type": "cache"
            }
        )
        # Using the secure upsert ensuring tenant boundary
        self.qdrant.secure_upsert(tenant_id, [point])
