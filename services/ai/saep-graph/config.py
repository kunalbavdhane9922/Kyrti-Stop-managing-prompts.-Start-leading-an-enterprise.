import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    neo4j_uri: str = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_user: str = os.getenv("NEO4J_USER", "neo4j")
    neo4j_password: str = os.getenv("NEO4J_PASSWORD", "password")
    
    otel_exporter_otlp_endpoint: str = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4317")
    otel_service_name: str = os.getenv("OTEL_SERVICE_NAME", "saep-graph")
    
    # We enforce Neo4j URI is provided
    
    class Config:
        env_file = ".env"

# Instantiating this validates all fields at startup and will crash if missing
settings = Settings()
