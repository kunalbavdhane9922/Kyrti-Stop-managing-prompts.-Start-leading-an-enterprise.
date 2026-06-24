"""
Governance Client for SAEP Agent Runtime.

Validates AI-proposed actions against the saep-governance Java service to determine
if they require human approval or are outright rejected by policy.

Architecture (from AgentPermissions.md):
    Agent → Governance Client → saep-governance API → Policy Decision

Rules enforced:
    - Governance Actions Require Human Approval (AgentPermissions.md Rule 8)
    - Agents Do Not Possess Governance Authority (LangGraph.md Rule 5)
    - All calls include M2M Bearer token + X-Tenant-Id
"""

import os
import logging
import httpx

logger = logging.getLogger(__name__)

GOVERNANCE_API = os.getenv("GOVERNANCE_SERVICE_URL", "http://saep-governance:8080")
_TIMEOUT = float(os.getenv("SAEP_SERVICE_TIMEOUT", "10.0"))


class GovernanceClient:
    def __init__(self):
        self.base_url = GOVERNANCE_API

    def validate_policy(self, worker_id: str, action_type: str, proposed_payload: dict) -> dict:
        """
        Synchronous call to saep-governance REST API to validate if an AI action
        requires human approval or is rejected by policy.

        POST /api/v1/proposals
        Returns: { status, proposal_id, requires_approval }
        """
        from context import tenant_id_ctx
        from engine.api_client import _build_headers

        tenant_id = tenant_id_ctx.get()
        url = f"{self.base_url}/api/v1/proposals"

        payload = {
            "proposerId": worker_id,
            "proposerType": "AGENT",
            "type": action_type,
            "payload": proposed_payload,
        }

        try:
            headers = _build_headers(tenant_id)
            response = httpx.post(url, json=payload, headers=headers, timeout=_TIMEOUT)

            if response.status_code == 201:
                data = response.json()
                return {
                    "status": data.get("status", "UNKNOWN"),
                    "proposal_id": data.get("id"),
                    "requires_approval": data.get("status") == "PENDING",
                }
            else:
                return {
                    "status": "REJECTED",
                    "error": response.text,
                    "requires_approval": False,
                }
        except Exception as e:
            logger.error(f"Governance validation failed: {e}")
            # Fail-closed: if governance is unreachable, require human approval
            return {
                "status": "ERROR",
                "error": str(e),
                "requires_approval": True,
            }


governance_client = GovernanceClient()
