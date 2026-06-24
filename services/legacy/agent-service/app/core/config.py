from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = Field(default="postgresql://user:password@localhost:5432/saep")
    
    # Temporal
    TEMPORAL_HOST: str = Field(default="localhost:7233")
    TEMPORAL_TASK_QUEUE: str = Field(default="saep-ai-queue")
    
    # Qdrant
    QDRANT_HOST: str = Field(default="localhost")
    QDRANT_PORT: int = Field(default=6333)
    
    # Kafka
    KAFKA_BOOTSTRAP_SERVERS: str = Field(default="localhost:9092")
    
    # Ollama
    OLLAMA_BASE_URL: str = Field(default="http://localhost:11434")
    OLLAMA_MODEL: str = Field(default="llama3")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
