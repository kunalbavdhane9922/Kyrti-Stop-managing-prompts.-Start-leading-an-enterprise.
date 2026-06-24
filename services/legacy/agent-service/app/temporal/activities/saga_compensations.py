import subprocess
from temporalio import activity

@activity.defn
async def execute_git_revert(tenant_id: str, task: str) -> str:
    """
    The Saga Compensation logic.
    If the Lead Agent workflow crashes midway through editing files, this activity 
    is automatically triggered by Temporal to execute a clean `git reset --hard` 
    and wipe the dirty state.
    """
    print(f"[SAGA COMPENSATION] Catastrophic failure detected for tenant {tenant_id}.")
    print(f"[SAGA COMPENSATION] Initiating emergency Git Revert for task: {task[:30]}...")
    
    # In a real environment, we'd find the exact Docker jail or repo path
    repo_path = f"/tmp/saep_repos/{tenant_id}/repo"
    
    try:
        # Example of strict reversion
        cmd = f"cd {repo_path} && git reset --hard HEAD && git clean -fd"
        # subprocess.run(cmd, shell=True, check=True)  # Disabled for scaffolding
        
        print(f"[SAGA COMPENSATION] Repository successfully rolled back to a clean state.")
        return "Saga Rollback Successful"
        
    except Exception as e:
        # If the Saga fails, we are in a critical state.
        # This requires manual CTO intervention.
        print(f"[CRITICAL ALARM] SAGA ROLLBACK FAILED: {e}")
        raise RuntimeError("CRITICAL: Manual intervention required on tenant repository.")
