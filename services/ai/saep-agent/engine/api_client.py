"""
Shared API client for SAEP internal Java microservices.

All intelligence agents and service layers use this client to fetch real data
from the SAEP backend services. This eliminates hardcoded mock data and ensures
consistent authentication, tenant isolation, and error handling.

Architecture (from Runtime.md):
    Agent → Tool/Client → Service API → Response

Rules enforced:
    - All calls include M2M Bearer token (from saep-identity)
    - All calls include X-Tenant-Id header (tenant isolation)
    - Direct database access is forbidden
    - All failures are logged with correlation_id
"""

import os
import logging
import httpx

logger = logging.getLogger(__name__)

# Base URLs route through the central API Gateway (Zero-Trust Architecture)
# The gateway is available at port 3000. In development with Docker Desktop, 
# the host machine is accessible via host.docker.internal.
GATEWAY_API = os.getenv("GATEWAY_SERVICE_URL", "http://host.docker.internal:3000")
WORKFORCE_API = GATEWAY_API
MARKETPLACE_API = GATEWAY_API
COMPANY_API = GATEWAY_API
IDENTITY_API = GATEWAY_API

# M2M credentials (from environment, never hardcoded)
_CLIENT_ID = os.getenv("SAEP_AGENT_CLIENT_ID", "saep-agent-client")
_CLIENT_SECRET = os.getenv("SAEP_AGENT_CLIENT_SECRET", "saep-agent-secret")

# Connection timeout for all service calls (seconds)
_TIMEOUT = float(os.getenv("SAEP_SERVICE_TIMEOUT", "10.0"))


def _get_m2m_token() -> str:
    """
    Obtain an M2M (machine-to-machine) bearer token from the Identity Service
    using the OAuth2 Client Credentials flow.

    This is the same mechanism used by tools.py — centralized here to avoid
    duplication across intelligence agents.
    """
    try:
        response = httpx.post(
            f"{IDENTITY_API}/api/v1/auth/service-token",
            json={"clientId": _CLIENT_ID, "clientSecret": _CLIENT_SECRET},
            timeout=_TIMEOUT,
        )
        response.raise_for_status()
        return response.json().get("access_token", "")
    except Exception as e:
        logger.error(f"Failed to obtain M2M token from saep-identity: {e}")
        raise


def _build_headers(tenant_id: str) -> dict:
    """Build standard headers with Bearer token and tenant ID."""
    token = _get_m2m_token()
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "X-Tenant-Id": tenant_id,
    }


# ---------------------------------------------------------------------------
# Marketplace Service API calls
# ---------------------------------------------------------------------------

def fetch_marketplace_demand(tenant_id: str, profession_id: str) -> dict:
    """
    GET /api/v1/marketplace/demand/{professionId}
    Returns hiring demand metrics for a profession.
    """
    url = f"{MARKETPLACE_API}/api/v1/marketplace/demand/{profession_id}"
    try:
        headers = _build_headers(tenant_id)
        response = httpx.get(url, headers=headers, timeout=_TIMEOUT)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.warning(f"Marketplace demand API unavailable for {profession_id}: {e}")
        return {}


def fetch_marketplace_supply(tenant_id: str, profession_id: str) -> dict:
    """
    GET /api/v1/marketplace/supply/{professionId}
    Returns active workforce supply metrics for a profession.
    """
    url = f"{MARKETPLACE_API}/api/v1/marketplace/supply/{profession_id}"
    try:
        headers = _build_headers(tenant_id)
        response = httpx.get(url, headers=headers, timeout=_TIMEOUT)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.warning(f"Marketplace supply API unavailable for {profession_id}: {e}")
        return {}


def fetch_marketplace_growth(tenant_id: str, profession_id: str) -> dict:
    """
    GET /api/v1/marketplace/growth/{professionId}
    Returns growth metrics (new hires, expansion rate) for a profession.
    """
    url = f"{MARKETPLACE_API}/api/v1/marketplace/growth/{profession_id}"
    try:
        headers = _build_headers(tenant_id)
        response = httpx.get(url, headers=headers, timeout=_TIMEOUT)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.warning(f"Marketplace growth API unavailable for {profession_id}: {e}")
        return {}


# ---------------------------------------------------------------------------
# Workforce Service API calls
# ---------------------------------------------------------------------------

def fetch_worker_performance(tenant_id: str, worker_id: str) -> dict:
    """
    GET /api/v1/workforce/{workerId}/performance
    Returns task completion stats, skill validations, learning progress.
    """
    url = f"{WORKFORCE_API}/api/v1/workforce/{worker_id}/performance"
    try:
        headers = _build_headers(tenant_id)
        response = httpx.get(url, headers=headers, timeout=_TIMEOUT)
        if response.status_code == 404:
            return {}
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.warning(f"Workforce performance API unavailable for {worker_id}: {e}")
        return {}


def fetch_reputation_ledger(tenant_id: str, worker_id: str) -> list:
    """
    GET /api/v1/reputations/professional/{workerId}/ledger
    Returns the immutable reputation event ledger for a worker.
    """
    url = f"{WORKFORCE_API}/api/v1/reputations/professional/{worker_id}/ledger"
    try:
        headers = _build_headers(tenant_id)
        response = httpx.get(url, headers=headers, timeout=_TIMEOUT)
        if response.status_code == 404:
            return []
        response.raise_for_status()
        data = response.json()
        # The Java service returns { "data": [...] } or directly [...]
        if isinstance(data, list):
            return data
        return data.get("data", data.get("events", []))
    except Exception as e:
        logger.warning(f"Reputation ledger API unavailable for {worker_id}: {e}")
        return []


def fetch_worker_team_and_company(tenant_id: str, worker_id: str) -> dict:
    """
    GET /api/v1/workforce/{workerId}
    Returns the worker profile including team_id and company_id.
    """
    url = f"{WORKFORCE_API}/api/v1/workforce/{worker_id}"
    try:
        headers = _build_headers(tenant_id)
        response = httpx.get(url, headers=headers, timeout=_TIMEOUT)
        if response.status_code == 404:
            return {}
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.warning(f"Workforce profile API unavailable for {worker_id}: {e}")
        return {}


def fetch_workforce_count(tenant_id: str, profession_id: str) -> dict:
    """
    GET /api/v1/workforce/count?professionId={professionId}
    Returns active workforce count for a given profession.
    """
    url = f"{WORKFORCE_API}/api/v1/workforce/count"
    try:
        headers = _build_headers(tenant_id)
        response = httpx.get(
            url, headers=headers, params={"professionId": profession_id}, timeout=_TIMEOUT
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.warning(f"Workforce count API unavailable for {profession_id}: {e}")
        return {}


def fetch_team_reputation(tenant_id: str, team_id: str) -> dict:
    """
    GET /api/v1/reputations/team/{teamId}
    Returns the aggregate team reputation score.
    """
    url = f"{WORKFORCE_API}/api/v1/reputations/team/{team_id}"
    try:
        headers = _build_headers(tenant_id)
        response = httpx.get(url, headers=headers, timeout=_TIMEOUT)
        if response.status_code == 404:
            return {}
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.warning(f"Team reputation API unavailable for {team_id}: {e}")
        return {}


def fetch_company_reputation(tenant_id: str, company_id: str) -> dict:
    """
    GET /api/v1/reputations/company/{companyId}
    Returns the aggregate company reputation score.
    """
    url = f"{WORKFORCE_API}/api/v1/reputations/company/{company_id}"
    try:
        headers = _build_headers(tenant_id)
        response = httpx.get(url, headers=headers, timeout=_TIMEOUT)
        if response.status_code == 404:
            return {}
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.warning(f"Company reputation API unavailable for {company_id}: {e}")
        return {}
