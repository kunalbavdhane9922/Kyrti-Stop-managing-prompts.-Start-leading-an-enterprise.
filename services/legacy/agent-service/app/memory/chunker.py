from langchain_text_splitters import RecursiveCharacterTextSplitter

class DocumentChunker:
    """
    Splits large codebase files or architecture documentation into semantic chunks
    so they can be safely embedded into the Qdrant Vector database without hitting token limits.
    """
    def __init__(self, chunk_size=1000, chunk_overlap=150):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", " ", ""]
        )

    def chunk_text(self, text: str) -> list[str]:
        return self.splitter.split_text(text)
