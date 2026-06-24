import httpx
import os
from langchain_core.tools import tool
from engine.memory import memory_client, graph_client
from kafka.publisher import event_publisher

# Base URLs for SAEP internal Java Microservices
COMPANY_API = os.getenv("COMPANY_SERVICE_URL", "http://saep-company:8080")
MARKETPLACE_API = os.getenv("MARKETPLACE_SERVICE_URL", "http://saep-marketplace:8080")
IDENTITY_API = os.getenv("IDENTITY_SERVICE_URL", "http://saep-identity:8080")
WORKFORCE_API = os.getenv("WORKFORCE_SERVICE_URL", "http://saep-workforce:8080")
COMMUNICATION_API = os.getenv("COMMUNICATION_SERVICE_URL", "http://saep-communication:8080")

def get_service_token(tenant_id: str = None) -> str:
    """Obtain an M2M bearer token from the Identity Service using OAuth2 Client Credentials flow."""
    client_id = os.getenv("SAEP_AGENT_CLIENT_ID", "saep-agent-client")
    client_secret = os.getenv("SAEP_AGENT_CLIENT_SECRET", "saep-agent-secret")
    
    response = httpx.post(f"{IDENTITY_API}/api/v1/auth/service-token", json={
        "clientId": client_id,
        "clientSecret": client_secret
    }, timeout=5.0)
    
    response.raise_for_status()
    return response.json().get("access_token")

@tool
def get_company_details(company_id: str) -> dict:
    """Retrieve details about a company including its departments and teams."""
    try:
        from context import tenant_id_ctx
        tenant_id = tenant_id_ctx.get()
        token = get_service_token(tenant_id)
        headers = {
            "Authorization": f"Bearer {token}",
            "X-Tenant-Id": tenant_id
        }
        response = httpx.get(f"{COMPANY_API}/api/v1/companies/{company_id}", headers=headers, timeout=5.0)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@tool
def get_marketplace_demand(profession_id: str) -> dict:
    """Fetch current hiring demand for a specific profession in the marketplace."""
    try:
        from context import tenant_id_ctx
        tenant_id = tenant_id_ctx.get()
        token = get_service_token(tenant_id)
        headers = {
            "Authorization": f"Bearer {token}",
            "X-Tenant-Id": tenant_id
        }
        response = httpx.get(f"{MARKETPLACE_API}/api/v1/marketplace/demand/{profession_id}", headers=headers, timeout=5.0)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@tool
def get_workforce_score(worker_id: str) -> dict:
    """Fetch the capability and readiness scores for a Digital Professional."""
    try:
        from context import tenant_id_ctx
        tenant_id = tenant_id_ctx.get()
        token = get_service_token(tenant_id)
        headers = {
            "Authorization": f"Bearer {token}",
            "X-Tenant-Id": tenant_id
        }
        response = httpx.get(f"{WORKFORCE_API}/api/v1/workforce-scores/{worker_id}", headers=headers, timeout=5.0)
        if response.status_code == 404:
            return {"status": "No score found for professional"}
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@tool
def get_professional_reputation(worker_id: str) -> dict:
    """Fetch the trust and performance reputation for a Digital Professional."""
    try:
        from context import tenant_id_ctx
        tenant_id = tenant_id_ctx.get()
        token = get_service_token(tenant_id)
        headers = {
            "Authorization": f"Bearer {token}",
            "X-Tenant-Id": tenant_id
        }
        response = httpx.get(f"{WORKFORCE_API}/api/v1/reputations/professional/{worker_id}", headers=headers, timeout=5.0)
        if response.status_code == 404:
            return {"status": "No reputation found for professional"}
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@tool
def get_profession_health(profession_id: str) -> dict:
    """Analyze the health, supply, demand, and risk associated with a profession."""
    try:
        import sys
        import os
        # Add parent dir to path if needed for agents import
        sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
        from agents.profession_health import profession_health_agent
        from context import tenant_id_ctx
        
        tenant_id = tenant_id_ctx.get()
        initial_state = {
            "tenant_id": tenant_id,
            "profession_id": profession_id,
            "demand_health_score": 0.0,
            "supply_health_score": 0.0,
            "growth_health_score": 0.0,
            "overall_health_score": 0.0,
            "risk_assessment": "",
            "recommendation_event": {}
        }
        result = profession_health_agent.invoke(initial_state)
        return {
            "health_score": result.get("overall_health_score"),
            "risk_assessment": result.get("risk_assessment"),
            "event": result.get("recommendation_event")
        }
    except Exception as e:
        return {"error": str(e)}

@tool
def send_message(receiver_id: str, content: str) -> dict:
    """Send a direct message to a human or another Digital Professional."""
    try:
        from context import tenant_id_ctx, worker_id_ctx
        tenant_id = tenant_id_ctx.get()
        sender_id = worker_id_ctx.get()
        
        token = get_service_token(tenant_id)
        headers = {
            "Authorization": f"Bearer {token}",
            "X-Tenant-Id": tenant_id
        }
        payload = {
            "senderId": sender_id,
            "receiverId": receiver_id,
            "content": content
        }
        response = httpx.post(f"{COMMUNICATION_API}/api/v1/messages", json=payload, headers=headers, timeout=5.0)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@tool
def assign_task(assignee_id: str, title: str, description: str) -> dict:
    """Assign a specific operational task to a human or Digital Professional."""
    try:
        from context import tenant_id_ctx, worker_id_ctx
        tenant_id = tenant_id_ctx.get()
        assigner_id = worker_id_ctx.get()
        
        token = get_service_token(tenant_id)
        headers = {
            "Authorization": f"Bearer {token}",
            "X-Tenant-Id": tenant_id
        }
        payload = {
            "assignerId": assigner_id,
            "assigneeId": assignee_id,
            "title": title,
            "description": description
        }
        response = httpx.post(f"{COMMUNICATION_API}/api/v1/tasks", json=payload, headers=headers, timeout=5.0)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@tool
def send_notification(target_id: str, type: str, content: str) -> dict:
    """Send a system notification or alert to a specific recipient."""
    try:
        from context import tenant_id_ctx
        tenant_id = tenant_id_ctx.get()
        token = get_service_token(tenant_id)
        headers = {
            "Authorization": f"Bearer {token}",
            "X-Tenant-Id": tenant_id
        }
        payload = {
            "targetId": target_id,
            "type": type,
            "content": content
        }
        response = httpx.post(f"{COMMUNICATION_API}/api/v1/notifications", json=payload, headers=headers, timeout=5.0)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@tool
def search_agent_memory(query: str, scope: str = "PERSONAL") -> list:
    """Retrieve semantic memories and past learning for the given query. 
    Scope can be PERSONAL, COMPANY, PROFESSION, or ECOSYSTEM."""
    from context import tenant_id_ctx
    tenant_id = tenant_id_ctx.get()
    return memory_client.search_memories(tenant_id=tenant_id, query=query, scope=scope)

@tool
def store_agent_memory(learning: str, scope: str = "PERSONAL") -> str:
    """Store an important reasoning, finding, or learning into long-term semantic memory.
    Scope can be PERSONAL, COMPANY, PROFESSION, or ECOSYSTEM."""
    from context import tenant_id_ctx, worker_id_ctx, task_id_ctx
    tenant_id = tenant_id_ctx.get()
    worker_id = worker_id_ctx.get()
    task_id = task_id_ctx.get()
    
    payload = {
        "tenant_id": tenant_id,
        "worker_id": worker_id,
        "task_id": task_id,
        "learning": learning,
        "scope": scope
    }
    memory_client.store_memory(payload=payload)
    
    # Emit audit event for memory update
    event_publisher.emit_memory_updated(tenant_id, worker_id, task_id, "semantic-learning")
    
    return "Memory successfully stored."

@tool
def get_graph_context(worker_id: str) -> list:
    """Fetch structural graph context about a Digital Professional (skills, company, hierarchy)."""
    return graph_client.get_worker_context(worker_id)

@tool
def request_human_escalation(reason: str) -> str:
    """Request a human operator to review, approve, or take over a task."""
    from context import tenant_id_ctx, worker_id_ctx, task_id_ctx
    tenant_id = tenant_id_ctx.get()
    worker_id = worker_id_ctx.get()
    task_id = task_id_ctx.get()
    
    # Emit the escalation requested event
    event_publisher.emit_escalation_requested(tenant_id, worker_id, task_id, reason)
    return "Escalation requested successfully. Execution is now waiting for human review."

# The list of standard tools available to Digital Professionals
standard_tools = [
    get_company_details,
    get_marketplace_demand,
    get_workforce_score,
    get_professional_reputation,
    get_profession_health,
    send_message,
    assign_task,
    send_notification,
    search_agent_memory,
    store_agent_memory,
    get_graph_context,
    request_human_escalation
]
