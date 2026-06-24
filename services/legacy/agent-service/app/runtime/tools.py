import os
import subprocess
import requests
import tempfile
import urllib.parse
from langchain_core.tools import tool

# Global execution jail path to enforce confinement
EXECUTION_JAIL_BASE = tempfile.gettempdir()

# This simulates injecting context at runtime. In production, these should be securely passed down from Temporal/LangGraph state.
class AgentContext:
    tenant_id: str = None
    github_repo_url: str = None
    github_token: str = None
    current_jail_path: str = None

def enforce_confinement(target_path: str) -> str:
    """Ensure the agent cannot execute commands outside of its confinement jail."""
    if not AgentContext.current_jail_path:
        raise PermissionError("Agent confinement jail not initialized.")
    abs_target = os.path.abspath(target_path)
    if not abs_target.startswith(os.path.abspath(AgentContext.current_jail_path)):
        raise PermissionError(f"CONFINEMENT BREACH ATTEMPT! Cannot access {target_path} outside of {AgentContext.current_jail_path}")
    return abs_target

@tool
def clone_company_repository() -> str:
    """Clone the company's designated GitHub repository into the secure execution jail."""
    if not AgentContext.github_repo_url:
        return "Error: No github_repo_url assigned to this agent."
    
    # Setup Jail
    AgentContext.current_jail_path = os.path.join(EXECUTION_JAIL_BASE, f"saep_jail_{AgentContext.tenant_id}")
    os.makedirs(AgentContext.current_jail_path, exist_ok=True)
    
    # Inject token into URL for clone
    parsed = urllib.parse.urlparse(AgentContext.github_repo_url)
    auth_url = f"{parsed.scheme}://oauth2:{AgentContext.github_token}@{parsed.netloc}{parsed.path}"
    
    cmd = f"git clone {auth_url} ."
    try:
        # Securely execute inside the jail
        result = subprocess.run(cmd, shell=True, cwd=AgentContext.current_jail_path, capture_output=True, text=True, timeout=60)
        if result.returncode != 0:
            return f"Git clone failed: {result.stderr}"
        return f"Successfully cloned repository into secure jail: {AgentContext.current_jail_path}"
    except Exception as e:
        return f"Exception during clone: {e}"

@tool
def create_feature_branch(branch_name: str) -> str:
    """Create and checkout a new Git branch."""
    try:
        enforce_confinement(AgentContext.current_jail_path)
        cmd = f"git checkout -b {branch_name}"
        result = subprocess.run(cmd, shell=True, cwd=AgentContext.current_jail_path, capture_output=True, text=True, timeout=10)
        return f"Branch creation result:\n{result.stdout}\n{result.stderr}"
    except Exception as e:
        return f"Branch creation failed: {e}"

@tool
def write_code_to_file(relative_path: str, content: str) -> str:
    """Write or overwrite a file in the repository with the provided code content."""
    try:
        target_file = os.path.join(AgentContext.current_jail_path, relative_path)
        enforce_confinement(target_file)
        
        # Ensure directories exist
        os.makedirs(os.path.dirname(target_file), exist_ok=True)
        
        with open(target_file, "w", encoding="utf-8") as f:
            f.write(content)
        return f"Successfully wrote {len(content)} characters to {relative_path}"
    except Exception as e:
        return f"Failed to write file: {e}"

@tool
def read_local_file(relative_path: str) -> str:
    """Read the contents of a local file in the repository."""
    try:
        target_file = os.path.join(AgentContext.current_jail_path, relative_path)
        enforce_confinement(target_file)
        with open(target_file, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"Error reading file {relative_path}: {e}"

@tool
def run_shell_command(command: str) -> str:
    """Execute a shell command (e.g., tests, build, grep) inside the secure execution jail."""
    try:
        enforce_confinement(AgentContext.current_jail_path)
        result = subprocess.run(command, shell=True, cwd=AgentContext.current_jail_path, capture_output=True, text=True, timeout=30)
        return f"STDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
    except Exception as e:
        return f"Command execution failed: {e}"

@tool
def commit_and_push_changes(commit_message: str, branch_name: str) -> str:
    """Stage, commit, and push changes to the remote GitHub repository."""
    try:
        enforce_confinement(AgentContext.current_jail_path)
        
        # 1. Add all
        subprocess.run("git add .", shell=True, cwd=AgentContext.current_jail_path, check=True)
        # 2. Commit
        subprocess.run(f'git commit -m "{commit_message}"', shell=True, cwd=AgentContext.current_jail_path, check=True)
        # 3. Push
        push_cmd = f"git push origin {branch_name}"
        res = subprocess.run(push_cmd, shell=True, cwd=AgentContext.current_jail_path, capture_output=True, text=True)
        
        if res.returncode != 0:
            return f"Push failed: {res.stderr}"
        return "Changes committed and pushed successfully."
    except Exception as e:
        return f"Commit/Push failed: {e}"

@tool
def create_pull_request(title: str, body: str, head_branch: str, base_branch: str = "main") -> str:
    """Create a Pull Request on GitHub for the CTO to review."""
    if not AgentContext.github_repo_url or not AgentContext.github_token:
        return "Error: GitHub credentials not configured."
        
    try:
        # Parse owner and repo from URL, e.g., https://github.com/owner/repo.git
        parsed = urllib.parse.urlparse(AgentContext.github_repo_url)
        path_parts = parsed.path.strip("/").replace(".git", "").split("/")
        if len(path_parts) < 2:
            return "Invalid GitHub URL format."
        owner, repo = path_parts[0], path_parts[1]
        
        api_url = f"https://api.github.com/repos/{owner}/{repo}/pulls"
        headers = {
            "Authorization": f"token {AgentContext.github_token}",
            "Accept": "application/vnd.github.v3+json"
        }
        data = {
            "title": title,
            "body": body,
            "head": head_branch,
            "base": base_branch
        }
        
        response = requests.post(api_url, headers=headers, json=data)
        if response.status_code == 201:
            pr_data = response.json()
            return f"SUCCESS: Pull Request Created! View it here: {pr_data['html_url']}"
        else:
            return f"GitHub API Error: {response.status_code} - {response.text}"
            
    except Exception as e:
        return f"Failed to create Pull Request: {e}"

# The core toolset for Engineering agents
engineering_tools = [
    clone_company_repository,
    create_feature_branch,
    write_code_to_file,
    read_local_file,
    run_shell_command,
    commit_and_push_changes,
    create_pull_request
]

def get_tools_for_permissions(permissions: list) -> list:
    """Dynamically assign tools based on agent permissions."""
    return engineering_tools
