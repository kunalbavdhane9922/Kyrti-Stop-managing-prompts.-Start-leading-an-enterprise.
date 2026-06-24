from prometheus_client import Counter, Gauge

class PrometheusMetrics:
    """
    Massive Hardware, Financial, and Resiliency Metrics tracking.
    Now tracks the exact number of times the system survived catastrophic failure.
    """
    
    # Financial Counters
    TOTAL_COST_USD = Counter("saep_agent_cost_usd_total", "Total USD spent on LLM APIs", ["tenant_id", "agent_role"])
    TOTAL_TOKENS = Counter("saep_agent_tokens_total", "Total Tokens consumed", ["tenant_id", "agent_role"])

    # Hardware Gauges
    DOCKER_JAIL_MEMORY_BYTES = Gauge("saep_docker_memory_usage_bytes", "RAM usage of the execution prison", ["tenant_id", "container_id"])
    ACTIVE_AGENTS = Gauge("saep_active_agents", "Number of currently executing LangGraph nodes", ["tenant_id"])

    # Chaos Resiliency Metrics
    CHAOS_EVENTS_SURVIVED = Counter(
        "saep_chaos_events_survived_total", 
        "Number of catastrophic Simian Army attacks the engine autonomously healed from.", 
        ["tenant_id"]
    )

    @classmethod
    def record_cost(cls, tenant_id: str, role: str, cost: float, tokens: int):
        cls.TOTAL_COST_USD.labels(tenant_id=tenant_id, agent_role=role).inc(cost)
        cls.TOTAL_TOKENS.labels(tenant_id=tenant_id, agent_role=role).inc(tokens)

    @classmethod
    def update_jail_memory(cls, tenant_id: str, container_id: str, bytes_used: int):
        cls.DOCKER_JAIL_MEMORY_BYTES.labels(tenant_id=tenant_id, container_id=container_id).set(bytes_used)
