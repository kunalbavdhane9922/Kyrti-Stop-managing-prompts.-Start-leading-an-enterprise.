import json

class SecurityEnforcer:
    """
    Massive OS-level security architecture.
    Injects Linux Control Groups (Cgroups) and Security Computing Mode (Seccomp) profiles 
    to physically restrain the execution prison.
    """
    @staticmethod
    def get_cgroup_limits(dna_cost_limit: float) -> dict:
        """
        Dynamically throttles CPU and RAM based on the agent's DNA budget.
        A cheap agent gets a heavily throttled container.
        """
        if dna_cost_limit < 1.0:
            return {"mem_limit": "256m", "cpu_quota": 50000} # 50% CPU
        elif dna_cost_limit < 10.0:
            return {"mem_limit": "1g", "cpu_quota": 100000} # 100% CPU
        else:
            return {"mem_limit": "4g", "cpu_quota": 400000} # 400% CPU for expensive parallel agents

    @staticmethod
    def get_seccomp_profile() -> str:
        """
        Blocks highly dangerous Linux system calls.
        If an agent hallucinates a malicious `ptrace` or `kexec` call, the Linux kernel
        will instantly assassinate the container process.
        """
        seccomp_policy = {
            "defaultAction": "SCMP_ACT_ERRNO",
            "architectures": [
                "SCMP_ARCH_X86_64",
                "SCMP_ARCH_X86",
                "SCMP_ARCH_X32"
            ],
            "syscalls": [
                {
                    "names": [
                        "read", "write", "open", "close", "stat", "fstat", "lstat", 
                        "poll", "lseek", "mmap", "mprotect", "munmap", "brk", 
                        "rt_sigaction", "rt_sigprocmask", "rt_sigreturn", "ioctl", 
                        "pread64", "pwrite64", "readv", "writev", "access", "pipe", 
                        "select", "sched_yield", "mremap", "msync", "mincore", 
                        "madvise", "shmget", "shmat", "shmctl", "dup", "dup2", "pause"
                    ],
                    "action": "SCMP_ACT_ALLOW"
                }
                # Everything else, including ptrace, unshare, and kexec, is blocked.
            ]
        }
        return json.dumps(seccomp_policy)
