import time
from threading import Lock

class TokenBucketLimiter:
    """
    Massive financial safety architecture.
    Prevents a hallucinating agent swarm from spamming the LLM API and burning 
    through a massive budget in seconds. It physically throttles Requests-Per-Minute.
    """
    def __init__(self, capacity: int, refill_rate_per_second: float):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate_per_second
        self.last_refill = time.time()
        self.lock = Lock()

    def consume(self, tokens_needed: int = 1) -> bool:
        """Returns True if the request is allowed, False if it should be Rate Limited (429)."""
        with self.lock:
            now = time.time()
            elapsed = now - self.last_refill
            
            # Refill the bucket
            refill_amount = elapsed * self.refill_rate
            self.tokens = min(self.capacity, self.tokens + refill_amount)
            self.last_refill = now
            
            if self.tokens >= tokens_needed:
                self.tokens -= tokens_needed
                return True
            return False

class TenantRateLimiter:
    """Manages separate token buckets for every single isolated tenant."""
    def __init__(self):
        self.tenant_buckets = {}
        self.default_capacity = 50 # Max 50 RPM burst
        self.default_refill = 0.5  # Refills 1 token every 2 seconds

    def check_rate_limit(self, tenant_id: str) -> None:
        if tenant_id not in self.tenant_buckets:
            self.tenant_buckets[tenant_id] = TokenBucketLimiter(
                self.default_capacity, 
                self.default_refill
            )
            
        if not self.tenant_buckets[tenant_id].consume(1):
            raise PermissionError("429 TOO MANY REQUESTS: Agent swarm has exceeded its TPM/RPM budget. Slowing down execution.")
            
tenant_rate_limiter = TenantRateLimiter()
