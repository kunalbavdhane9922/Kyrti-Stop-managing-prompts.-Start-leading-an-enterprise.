import asyncio
from typing import List
from langchain_community.embeddings import OllamaEmbeddings
from app.core.config import settings

class SemanticEmbedder:
    """
    Enterprise Embedding Engine.
    Uses asynchronous execution and batching to embed entire repositories 
    in parallel, eliminating the sequential bottleneck of standard RAG pipelines.
    """
    def __init__(self):
        self.embedder = OllamaEmbeddings(
            base_url=settings.OLLAMA_BASE_URL,
            model="mxbai-embed-large" 
        )

    async def embed_text_async(self, text: str) -> List[float]:
        """Async wrapper for single queries."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.embedder.embed_query, text)

    async def embed_documents_async(self, texts: List[str], batch_size: int = 50) -> List[List[float]]:
        """Massive concurrent batch embedding."""
        all_embeddings = []
        
        # Process in batches to prevent crashing the Ollama host
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            print(f"[EMBEDDER] Processing batch {i//batch_size + 1} ({len(batch)} documents)...")
            
            loop = asyncio.get_event_loop()
            batch_embeddings = await loop.run_in_executor(None, self.embedder.embed_documents, batch)
            all_embeddings.extend(batch_embeddings)
            
        return all_embeddings
