"""
Memory and Graph Knowledge Clients for SAEP Agent Runtime.

These clients provide the Memory Coordinator and Knowledge Graph access
as defined in Runtime.md:
    - Memory Retrieval (saep-memory API)
    - Memory Updates (saep-memory API)
    - Context Assembly (saep-graph API)
    - Memory Permissions (enforced by service layer)

Rules enforced:
    - Direct vector database access is forbidden (Runtime.md)
    - Memory Access Must Respect Permissions (LangGraph.md Rule 3)
    - All calls include M2M Bearer token + X-Tenant-Id
"""

import os
import logging
import httpx

logger = logging.getLogger(__name__)

# Connection timeout (from environment)
_TIMEOUT = float(os.getenv("SAEP_SERVICE_TIMEOUT", "10.0"))


def _get_m2m_token(tenant_id: str) -> str:
    """Obtain M2M token from Identity Service."""
    from engine.api_client import _get_m2m_token as api_get_token
    return api_get_token()


def _build_headers(tenant_id: str) -> dict:
    """Build standard headers with Bearer token and tenant ID."""
    token = _get_m2m_token(tenant_id)
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "X-Tenant-Id": tenant_id,
    }


class MemoryClient:
    """
    Client for saep-memory service.
    Provides semantic search and learning storage via REST API.
    Direct Qdrant access is forbidden per V1 architecture.
    """

    def __init__(self):
        self.memory_url = os.getenv("MEMORY_SERVICE_URL", "http://saep-memory:8080")

    def search_memories(self, tenant_id: str, query: str, scope: str = "PERSONAL", limit: int = 5) -> list:
        """
        POST /api/v1/memory/search
        Semantic search for relevant past memories/learnings.
        The saep-memory service handles embedding generation and Qdrant query internally.
        """
        request_data = {
            "query": query,
            "scope": scope,
            "limit": limit,
        }

        try:
            response = httpx.post(
                f"{self.memory_url}/api/v1/memory/search",
                json=request_data,
                headers=_build_headers(tenant_id),
                timeout=_TIMEOUT,
            )
            response.raise_for_status()
            return response.json().get("data", [])
        except Exception as e:
            logger.error(f"Failed to search memory via API: {e}")
            return []

    def store_memory(self, payload: dict) -> None:
        """
        POST /api/v1/memory/learn
        Store a learning/reasoning into long-term semantic memory.
        The saep-memory service handles embedding generation internally.
        No vector is passed — the agent NEVER generates embeddings directly.
        """
        tenant_id = payload.get("tenant_id", "system")
        owner_id = payload.get("worker_id")
        content = payload.get("learning", str(payload))
        task_id = payload.get("task_id")
        scope = payload.get("scope", "PERSONAL")

        request_data = {
            "ownerId": owner_id,
            "ownerType": "AGENT",
            "scope": scope,
            "visibility": "PRIVATE" if scope == "PERSONAL" else "PUBLIC",
            "content": content,
            "sourceType": "AGENT_REASONING",
            "taskId": task_id,
        }

        try:
            response = httpx.post(
                f"{self.memory_url}/api/v1/memory/learn",
                json=request_data,
                headers=_build_headers(tenant_id),
                timeout=_TIMEOUT,
            )
            response.raise_for_status()
            logger.info("Successfully stored reasoning in saep-memory")
        except Exception as e:
            logger.error(f"Failed to store memory via API: {e}")


class GraphKnowledgeClient:
    """
    Client for saep-graph service.
    Provides structural knowledge context from the Neo4j knowledge graph.
    Direct Neo4j access is forbidden per V1 architecture.
    """

    def __init__(self):
        self.graph_url = os.getenv("GRAPH_SERVICE_URL", "http://saep-graph:8002")

    def get_worker_context(self, worker_id: str) -> list:
        """
        GET /api/v1/graph/nodes/Worker/{workerId}/relationships
        Returns structural context (skills, company, hierarchy, team).
        """
        try:
            from context import tenant_id_ctx
            tenant_id = tenant_id_ctx.get()
            response = httpx.get(
                f"{self.graph_url}/api/v1/graph/nodes/Worker/{worker_id}/relationships",
                headers=_build_headers(tenant_id),
                timeout=_TIMEOUT,
            )
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])
        except Exception as e:
            logger.error(f"Failed to fetch worker context from saep-graph: {e}")
            return []

    def close(self):
        pass


memory_client = MemoryClient()
graph_client = GraphKnowledgeClient()
