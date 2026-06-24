from langchain_community.embeddings import OllamaEmbeddings
from app.core.config import settings

class SemanticEmbedder:
    """Generates 1536-dimensional vectors using local models via Ollama."""
    def __init__(self):
        # We use a standard embedding model compatible with our Qdrant vector size
        self.embedder = OllamaEmbeddings(
            base_url=settings.OLLAMA_BASE_URL,
            model="mxbai-embed-large" # Or nomic-embed-text
        )

    def embed_text(self, text: str) -> list[float]:
        return self.embedder.embed_query(text)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        return self.embedder.embed_documents(texts)
