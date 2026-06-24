from sqlalchemy import Column, String, DateTime, Integer, Text, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/saep_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class AgentExecution(Base):
    __tablename__ = "agent_executions"

    id = Column(String, primary_key=True, index=True)
    tenant_id = Column(String, index=True)
    workflow_id = Column(String, index=True, nullable=True)
    worker_id = Column(String, index=True)
    task_id = Column(String, index=True)
    status = Column(String)  # Idle, Assigned, Executing, Waiting, Review, Completed, Failed
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    token_usage = Column(Integer, default=0)
    cost = Column(String, nullable=True)
    decision = Column(String, nullable=True)
    reasoning_summary = Column(Text, nullable=True)

Base.metadata.create_all(bind=engine)
