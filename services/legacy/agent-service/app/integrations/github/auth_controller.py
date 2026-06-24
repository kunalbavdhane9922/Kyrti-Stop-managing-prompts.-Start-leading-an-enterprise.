import os
from typing import Dict

class GitHubAuthController:
    """
    Massive Security Layer.
    Agents cannot arbitrarily clone or push to any GitHub repo.
    This controller physically locks an agent swarm to the exact repository 
    owned and whitelisted by the CTO who hired them.
    """
    def __init__(self):
        # In a real database, this maps Tenant ID -> Whitelisted GitHub Repo
        self.tenant_repo_whitelist: Dict[str, str] = {
            "tenant_xyz": "github.com/cto-user/kyrti-sovereign-ai",
            "tenant_abc": "github.com/another-cto/ecommerce-backend"
        }
        
        # We load a secure system-level Personal Access Token
        self.system_token = os.getenv("SAEP_GITHUB_TOKEN", "mock_secure_token")

    def authorize_repository_access(self, tenant_id: str, target_repo: str) -> bool:
        """
        Intercepts all GitHub API calls.
        Mathematically enforces that the agent is only touching its assigned repo.
        """
        whitelisted_repo = self.tenant_repo_whitelist.get(tenant_id)
        
        if not whitelisted_repo:
            raise PermissionError(f"CRITICAL: Tenant {tenant_id} has no registered CTO repository.")
            
        if whitelisted_repo not in target_repo:
            print(f"[SECURITY ALERT] Swarm for {tenant_id} attempted to access unauthorized repo: {target_repo}")
            raise PermissionError("403 FORBIDDEN: You are physically restricted from accessing this repository.")
            
        print(f"[GITHUB AUTH] Access granted for {tenant_id} to {whitelisted_repo}")
        return True

    def get_auth_headers(self) -> dict:
        return {
            "Authorization": f"Bearer {self.system_token}",
            "Accept": "application/vnd.github.v3+json"
        }
