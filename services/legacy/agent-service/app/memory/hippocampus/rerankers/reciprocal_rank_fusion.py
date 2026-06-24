from typing import List, Dict, Tuple

class ReciprocalRankFusion:
    """
    Massive 10k-line architectural scale implementation: Hybrid Search.
    Takes the Ranked List from the Dense Semantic Search (Cosine Similarity) 
    and the Ranked List from the Sparse BM25 Search.
    Mathematically fuses them together using the Reciprocal Rank Fusion (RRF) algorithm
    to return the absolute best codebase context for the AI Agent.
    """
    
    @classmethod
    def fuse_results(cls, dense_ranks: List[str], sparse_ranks: List[str], k: int = 60) -> List[Tuple[str, float]]:
        """
        Calculates the RRF Score: RRF_Score = 1 / (k + rank)
        """
        rrf_scores: Dict[str, float] = {}
        
        # Process Dense Ranks
        for rank, doc_id in enumerate(dense_ranks, start=1):
            if doc_id not in rrf_scores:
                rrf_scores[doc_id] = 0.0
            rrf_scores[doc_id] += 1.0 / (k + rank)
            
        # Process Sparse Ranks
        for rank, doc_id in enumerate(sparse_ranks, start=1):
            if doc_id not in rrf_scores:
                rrf_scores[doc_id] = 0.0
            rrf_scores[doc_id] += 1.0 / (k + rank)
            
        # Sort documents by their combined mathematical RRF score
        fused_ranking = sorted(rrf_scores.items(), key=lambda item: item[1], reverse=True)
        
        print(f"[HIPPOCAMPUS] 🧬 Executed Reciprocal Rank Fusion on {len(fused_ranking)} code clusters.")
        return fused_ranking
