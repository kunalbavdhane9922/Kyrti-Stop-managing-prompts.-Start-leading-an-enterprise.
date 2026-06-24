import os
import tempfile

EXECUTION_JAIL_BASE = tempfile.gettempdir()

class AgentContext:
    """Singleton context holding global state for the execution runtime."""
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
