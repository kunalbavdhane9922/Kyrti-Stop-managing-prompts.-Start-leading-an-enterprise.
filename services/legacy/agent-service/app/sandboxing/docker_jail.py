import subprocess
import uuid
import os

class DockerSandbox:
    """
    Spins up an ephemeral, deeply restricted Docker container for an agent to execute its 
    LangGraph tools inside. Once the task is over, the container is destroyed.
    """
    def __init__(self, tenant_id: str):
        self.tenant_id = tenant_id
        self.container_name = f"saep-agent-{tenant_id}-{uuid.uuid4().hex[:8]}"

    def start_sandbox(self):
        print(f"[SANDBOX] Starting isolated execution container: {self.container_name}")
        # In a real cluster, we would use the Docker Python SDK or Kubernetes API.
        cmd = f"docker run -d --name {self.container_name} --network none --memory=1g --cpus=0.5 ubuntu:22.04 tail -f /dev/null"
        try:
            subprocess.run(cmd, shell=True, check=True, capture_output=True)
            return self.container_name
        except subprocess.CalledProcessError as e:
            print(f"Failed to start sandbox: {e.stderr}")
            raise

    def execute_command(self, command: str) -> str:
        cmd = f"docker exec {self.container_name} bash -c '{command}'"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout if result.returncode == 0 else result.stderr

    def destroy_sandbox(self):
        print(f"[SANDBOX] Destroying isolated execution container: {self.container_name}")
        subprocess.run(f"docker rm -f {self.container_name}", shell=True, capture_output=True)
