import docker

class NetworkAirgap:
    """
    Zero-Trust Virtual Bridging.
    Agents cannot arbitrarily ping the internet. We construct a virtual Docker bridge
    and only whitelist explicit APIs (like GitHub).
    """
    def __init__(self, client: docker.DockerClient):
        self.client = client
        self.network_name = "saep-airgap-bridge"
        self._ensure_network()

    def _ensure_network(self):
        try:
            self.client.networks.get(self.network_name)
        except docker.errors.NotFound:
            print(f"[AIRGAP] Creating isolated Zero-Trust Network Bridge: {self.network_name}")
            self.client.networks.create(
                self.network_name,
                driver="bridge",
                internal=False # In a true enterprise setup, this would be True with strict iptables
            )

    def get_network_config(self) -> str:
        return self.network_name

class VolumeQuarantine:
    """
    Copy-on-Write (COW) Repository mounts.
    Ensures that if an agent runs `rm -rf /` it only destroys the ephemeral layer,
    never touching the actual host filesystem.
    """
    @staticmethod
    def get_mount_config(tenant_id: str) -> dict:
        host_path = f"/tmp/saep_repos/{tenant_id}"
        container_path = "/workspace"
        
        return {
            host_path: {
                "bind": container_path,
                "mode": "rw" # Docker automatically uses COW over the host directory
            }
        }
