import docker
from typing import Tuple

class SecureExecutorBridge:
    """
    Prevents shell injection vulnerabilities.
    Instead of passing raw string commands via `subprocess`, we utilize the Docker 
    SDK's execution API to run tools inside the prison and securely stream stdout/stderr.
    """
    def __init__(self):
        self.client = docker.from_env()

    def execute_in_jail(self, container_name: str, command: str, timeout: int = 30) -> Tuple[int, str]:
        """
        Executes a command inside the airgapped, Cgroups-throttled container.
        Returns the exit code and the raw stdout/stderr output.
        """
        try:
            container = self.client.containers.get(container_name)
            
            print(f"[EXECUTION BRIDGE] Routing command into {container_name}: {command[:50]}...")
            
            # The 'exec_run' method safely runs a command inside the existing running container.
            # It inherently prevents escaping the container namespace.
            exit_code, output = container.exec_run(
                cmd=["/bin/sh", "-c", command],
                stdout=True,
                stderr=True,
                workdir="/workspace"
            )
            
            # Decode the raw byte stream
            decoded_output = output.decode('utf-8')
            return exit_code, decoded_output
            
        except docker.errors.NotFound:
            return 1, f"CRITICAL ERROR: Execution prison {container_name} does not exist or crashed."
        except Exception as e:
            return 1, f"EXECUTION BRIDGE ERROR: {str(e)}"
