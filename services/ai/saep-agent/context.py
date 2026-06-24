import contextvars

# Correlation ID Context for distributed tracing and logging
correlation_id_ctx = contextvars.ContextVar("correlation_id", default="system")
tenant_id_ctx = contextvars.ContextVar("tenant_id", default="system")
worker_id_ctx = contextvars.ContextVar("worker_id", default="system")
task_id_ctx = contextvars.ContextVar("task_id", default="system")
