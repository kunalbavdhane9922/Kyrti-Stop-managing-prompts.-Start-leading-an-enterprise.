import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    kafka_brokers: str = os.getenv("KAFKA_BROKERS", "localhost:9092")
    memory_service_url: str = os.getenv("MEMORY_SERVICE_URL", "http://saep-memory:8080")
    graph_service_url: str = os.getenv("GRAPH_SERVICE_URL", "http://saep-graph:8002")
    communication_service_url: str = os.getenv("COMMUNICATION_SERVICE_URL", "http://saep-communication:8080")
    governance_service_url: str = os.getenv("GOVERNANCE_SERVICE_URL", "http://saep-governance:8080")
    database_url: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/saep_db")
    
    otel_exporter_otlp_endpoint: str = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4317")
    otel_service_name: str = os.getenv("OTEL_SERVICE_NAME", "saep-agent")
    
    temporal_host: str = os.getenv("TEMPORAL_HOST", "localhost:7233")
    temporal_task_queue: str = os.getenv("TEMPORAL_TASK_QUEUE", "saep-ai-queue")
    
    class Config:
        env_file = ".env"

# Validate configuration on startup
settings = Settings()
