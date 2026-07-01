from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import uuid
import datetime
from core.database import Base
import enum

class RoleEnum(str, enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    OWNER = "OWNER"

class User(Base):
    __tablename__ = "User"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    name = Column(String, nullable=True)
    role = Column(Enum(RoleEnum), default=RoleEnum.USER)
    
    avatarUrl = Column(String, nullable=True)
    x = Column(Float, default=0.0)
    y = Column(Float, default=0.0)
    
    officeId = Column(String, ForeignKey("Office.id"), nullable=True)
    
    createdAt = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Note: office relationship will be back-populated in Office model
