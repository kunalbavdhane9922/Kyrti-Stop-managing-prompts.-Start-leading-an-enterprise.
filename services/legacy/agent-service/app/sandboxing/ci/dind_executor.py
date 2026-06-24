import docker
from typing import Tuple

class DockerInDockerCI:
    """
    Nested Execution Matrix.
    An agent claiming the code works is not enough. We spin up a SECONDARY 
    Docker container inside the primary Warden Sandbox. We physically execute 
    `pytest` or `JUnit` against the agent's code. If the tests fail, the PR is aborted.
    """
    def __init__(self):
        self.client = docker.from_env()

    def run_nested_tests(self, tenant_id: str, test_command: str = "pytest -v") -> Tuple[bool, str]:
        """
        Executes a nested test suite.
        Returns (True, test_logs) if tests passed, (False, error_logs) if they failed.
        """
        # In a real DinD setup, we would mount the Docker socket or use Sysbox.
        # For our architecture, we spin up a parallel test-runner container mounted to the same COW volume.
        
        container_name = f"saep-dind-ci-{tenant_id}"
        volume_path = f"/tmp/saep_repos/{tenant_id}"
        
        print(f"[CI/CD PIPELINE] Booting nested DinD execution matrix: {container_name}")
        
        try:
            # We run a disposable alpine/python container to execute the tests
            logs = self.client.containers.run(
                "python:3.10-slim",
                name=container_name,
                command=f"/bin/sh -c 'pip install pytest && {test_command}'",
                volumes={volume_path: {"bind": "/workspace", "mode": "ro"}}, # Read-Only mount to prevent test from modifying code
                working_dir="/workspace",
                remove=True, # Auto-incinerate the container after tests finish
                detach=False # Block until tests complete
            )
            
            output = logs.decode("utf-8")
            print(f"[CI/CD PIPELINE] TESTS PASSED.")
            return True, output
            
        except docker.errors.ContainerError as e:
            output = e.stderr.decode("utf-8") if e.stderr else str(e)
            print(f"[CI/CD PIPELINE] TESTS FAILED. Aborting PR creation.")
            return False, output
        except Exception as e:
            return False, f"CRITICAL DIND ERROR: {str(e)}"
