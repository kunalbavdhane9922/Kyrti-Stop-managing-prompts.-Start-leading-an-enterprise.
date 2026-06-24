from sqlalchemy import Column, String, JSON, Integer, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class ProfessionTemplateModel(Base):
    __tablename__ = "profession_templates"
    
    id = Column(String, primary_key=True, index=True)
    profession = Column(String, index=True, nullable=False)
    category = Column(String, nullable=True)
    skills = Column(JSON, default=list)
    responsibilities = Column(JSON, default=list)
    permissions = Column(JSON, default=list)
    career_path = Column(JSON, default=list)
    behavior_profile = Column(JSON, default=dict)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class DigitalProfessionalModel(Base):
    __tablename__ = "digital_professionals"
    
    id = Column(String, primary_key=True, index=True)
    profession_id = Column(String, index=True, nullable=False)
    status = Column(String, default="AVAILABLE")
    reputation = Column(Integer, default=500)
    professional_dna = Column(JSON, default=dict)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
