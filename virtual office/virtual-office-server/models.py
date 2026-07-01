from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from .database import Base

class RoleEnum(str, enum.Enum):
    EMPLOYEE = "employee"
    CEO = "ceo"
    AI = "ai"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.EMPLOYEE, nullable=False)
    password_hash = Column(String(255), nullable=True) # AI users might not have a password
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    meetings_hosted = relationship("Meeting", back_populates="host", foreign_keys="[Meeting.host_id]")

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheduled_time = Column(DateTime, nullable=False)
    status = Column(String(50), default="scheduled") # scheduled, active, completed

    host = relationship("User", back_populates="meetings_hosted", foreign_keys=[host_id])

class AIChatHistory(Base):
    __tablename__ = "ai_chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ai_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    sender = Column(String(50), nullable=False) # 'user' or 'ai'
    timestamp = Column(DateTime, default=datetime.utcnow)
