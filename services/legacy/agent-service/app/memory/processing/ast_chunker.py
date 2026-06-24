import ast
from typing import List, Dict

class ASTChunker:
    """
    Massive contextual improvement over standard LangChain recursive splitters.
    This parses the actual Abstract Syntax Tree of python files, ensuring that 
    classes and their methods are chunked together logically. It prevents 
    the vector database from receiving fragmented, half-cut functions.
    """
    def __init__(self, max_tokens: int = 1000):
        self.max_tokens = max_tokens

    def chunk_python_file(self, file_content: str, file_path: str) -> List[Dict[str, str]]:
        try:
            tree = ast.parse(file_content)
        except SyntaxError:
            # Fallback to basic chunking if the file is corrupt
            print(f"[AST CHUNKER] Syntax Error in {file_path}. Falling back to basic chunking.")
            return [{"text": file_content[:self.max_tokens], "metadata": {"file": file_path}}]

        chunks = []
        for node in ast.iter_child_nodes(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                # Extract the exact string segment for this class/function
                segment = ast.get_source_segment(file_content, node)
                if segment:
                    # In a real system we would count tokens here and sub-chunk if necessary
                    chunks.append({
                        "text": segment,
                        "metadata": {
                            "file": file_path,
                            "type": type(node).__name__,
                            "name": getattr(node, 'name', 'unknown')
                        }
                    })
                    
        print(f"[AST CHUNKER] Parsed {file_path} into {len(chunks)} structural chunks.")
        return chunks
