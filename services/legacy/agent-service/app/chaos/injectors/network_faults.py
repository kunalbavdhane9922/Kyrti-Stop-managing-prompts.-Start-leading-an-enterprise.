import random
import time
from functools import wraps

class NetworkFaultInjector:
    """
    Simulates catastrophic datacenter network failures.
    We inject these decorators into the LLM Gateway and the Kafka Producers 
    to physically ensure the Circuit Breakers and Outboxes can withstand fire.
    """
    
    _chaos_active = False

    @classmethod
    def enable_chaos(cls):
        cls._chaos_active = True
        
    @classmethod
    def inject_latency(cls, max_latency_ms: int = 5000, probability: float = 0.1):
        """
        Decorator to simulate a network partition.
        Randomly freezes the thread for up to 5 seconds to force a timeout, 
        proving the Circuit Breaker trips correctly.
        """
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                if cls._chaos_active and random.random() < probability:
                    latency = random.randint(1000, max_latency_ms) / 1000.0
                    print(f"[CHAOS INJECTOR] 🌩️ Network Storm: Forcing {latency}s latency on {func.__name__}")
                    time.sleep(latency)
                return func(*args, **kwargs)
            return wrapper
        return decorator

    @classmethod
    def inject_packet_drop(cls, probability: float = 0.1):
        """
        Decorator to simulate dropped Kafka messages.
        Randomly throws an IOError instead of sending the packet,
        proving the Transactional Outbox pattern safely queues the message in SQL.
        """
        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                if cls._chaos_active and random.random() < probability:
                    print(f"[CHAOS INJECTOR] 💥 Packet Drop: Nuking payload on {func.__name__}")
                    raise IOError("CHAOS: Network packet dropped in transit.")
                return func(*args, **kwargs)
            return wrapper
        return decorator
