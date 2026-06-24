from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from app.core.config import settings

class QdrantManager:
    """Manages the connection and collections in the Qdrant Vector DB."""
    def __init__(self):
        self.client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
        self._ensure_collection("ecosystem_memory", 1536)

    def _ensure_collection(self, name: str, size: int):
        if not self.client.collection_exists(name):
            self.client.create_collection(
                collection_name=name,
                vectors_config=VectorParams(size=size, distance=Distance.COSINE),
            )

    def get_client(self):
        return self.client

qdrant_manager = QdrantManager()
