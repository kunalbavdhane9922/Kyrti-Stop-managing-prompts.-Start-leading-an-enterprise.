from qdrant_client import QdrantClient
from qdrant_client.http.models import VectorParams, Distance
from app.core.config import settings

class QdrantService:
    def __init__(self):
        self.client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
        
    def create_collection_if_not_exists(self, collection_name: str, vector_size: int = 1536):
        collections = self.client.get_collections().collections
        exists = any(c.name == collection_name for c in collections)
        if not exists:
            self.client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
            )
            
    def insert_memory(self, collection_name: str, points: list):
        self.client.upsert(
            collection_name=collection_name,
            points=points
        )
        
    def search_memory(self, collection_name: str, query_vector: list, limit: int = 5, tenant_id: str = None):
        # Enforce tenant isolation via payload filtering if tenant_id is provided
        from qdrant_client.http.models import Filter, FieldCondition, MatchValue
        
        query_filter = None
        if tenant_id:
            query_filter = Filter(
                must=[
                    FieldCondition(
                        key="tenant_id",
                        match=MatchValue(value=tenant_id)
                    )
                ]
            )
            
        return self.client.search(
            collection_name=collection_name,
            query_vector=query_vector,
            limit=limit,
            query_filter=query_filter
        )

qdrant_service = QdrantService()
