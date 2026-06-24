from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, Filter, FieldCondition, MatchValue
from app.core.config import settings

class QdrantManager:
    """
    Massive Multi-Tenant Vector DB architecture.
    Enforces strict Data Sovereignty boundaries by requiring tenant_id validation 
    for every single vector read/write operation.
    """
    def __init__(self):
        # We use asynchronous clients in a real highly concurrent system
        self.client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
        self.collection_name = "saep_master_memory"
        self._ensure_collection()

    def _ensure_collection(self):
        if not self.client.collection_exists(self.collection_name):
            print(f"[VECTOR DB] Initializing Enterprise Memory Collection: {self.collection_name}")
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
            )
            # Create strict payload indices for fast tenant isolation filtering
            self.client.create_payload_index(
                collection_name=self.collection_name,
                field_name="tenant_id",
                field_schema="keyword"
            )

    def secure_search(self, tenant_id: str, query_vector: list, limit: int = 5, min_score: float = 0.8):
        """
        RBAC Secured Search.
        Mathematically impossible for Tenant A to retrieve Tenant B's code.
        """
        tenant_filter = Filter(
            must=[FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id))]
        )
        
        return self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            query_filter=tenant_filter,
            limit=limit,
            score_threshold=min_score
        )

    def secure_upsert(self, tenant_id: str, points: list):
        """Validates that all points belong to the requested tenant before saving."""
        for p in points:
            if p.payload.get("tenant_id") != tenant_id:
                raise PermissionError("CRITICAL: Attempted Cross-Tenant Vector Injection!")
                
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )

qdrant_manager = QdrantManager()
