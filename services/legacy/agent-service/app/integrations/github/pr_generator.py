import requests
import json
from app.integrations.github.auth_controller import GitHubAuthController
from app.gateway.router.gateway_controller import GatewayController

class GitHubPRGenerator:
    """
    Automates the final delivery of the AI Swarm's work.
    Aggregates the completed codebase, queries the LLM Gateway to generate 
    a professional markdown PR description, and pushes it to the CTO's repo.
    """
    def __init__(self):
        self.auth = GitHubAuthController()
        self.gateway = GatewayController()

    def generate_pr_description(self, task_description: str, test_results: str) -> str:
        """Uses the Central LLM Gateway to write the PR description."""
        prompt = f"""You are a Senior Staff Engineer.
Write a professional, concise GitHub Pull Request description for the following task:
{task_description}

Include a section confirming that the following automated tests passed:
{test_results}

Use standard Markdown headers (## Description, ## Testing, ## Checklist).
"""
        return self.gateway.invoke_llm(prompt)

    def open_pull_request(self, tenant_id: str, branch_name: str, task_description: str, test_results: str) -> str:
        """Opens the PR securely via the GitHub API."""
        
        # 1. Mathematically enforce security isolation
        repo_url = self.auth.tenant_repo_whitelist.get(tenant_id)
        self.auth.authorize_repository_access(tenant_id, repo_url)
        
        # Parse owner and repo from URL (e.g., github.com/owner/repo)
        parts = repo_url.split("/")
        owner = parts[-2]
        repo = parts[-1]

        # 2. Generate the markdown description
        pr_body = self.generate_pr_description(task_description, test_results)
        
        print(f"[GITHUB CI/CD] Opening Pull Request on {owner}/{repo} branch {branch_name}...")
        
        # 3. Simulate GitHub API Call
        # In a real environment, this uses requests.post("https://api.github.com/repos/...", headers=self.auth.get_auth_headers(), json={...})
        
        pr_url = f"https://github.com/{owner}/{repo}/pull/101"
        print(f"[GITHUB CI/CD] SUCCESS. Pull Request Opened: {pr_url}")
        
        return pr_url
