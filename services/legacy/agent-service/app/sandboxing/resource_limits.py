class ResourceLimits:
    """
    Defines strict resource and time limits for executing agents to prevent
    infinite loops, memory leaks, or crypto-mining inside the sandboxes.
    """
    MAX_MEMORY_MB = 1024
    MAX_CPUS = 0.5
    MAX_EXECUTION_TIME_SECONDS = 3600 # 1 Hour max per task
    NETWORK_MODE = "none" # Agents cannot access external internet directly
    
    @classmethod
    def get_docker_flags(cls) -> str:
        return f"--memory={cls.MAX_MEMORY_MB}m --cpus={cls.MAX_CPUS} --network={cls.NETWORK_MODE}"
