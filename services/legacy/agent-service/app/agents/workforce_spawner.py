import json
import uuid
from langchain_community.llms import Ollama
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.domain import ProfessionTemplateModel, DigitalProfessionalModel
from app.memory.qdrant_service import qdrant_service

class WorkforceSpawnerAgent:
    """
    Autonomous AI Agent that spawns new Digital Professionals when required.
    """
    
    def __init__(self):
        self.llm = Ollama(base_url=settings.OLLAMA_BASE_URL, model=settings.OLLAMA_MODEL)
        
    def spawn_worker(self, template_id: str):
        db = SessionLocal()
        template = db.query(ProfessionTemplateModel).filter(ProfessionTemplateModel.id == template_id).first()
        
        if not template:
            print("WorkforceSpawnerAgent: Template not found.")
            db.close()
            return None
            
        print(f"WorkforceSpawnerAgent: Generating unique DNA for {template.profession}...")
        
        prompt = f"""
        You are the SAEP Workforce Spawner.
        Generate a unique Professional DNA profile for a new {template.profession}.
        The profile must align with this behavior profile: {template.behavior_profile}
        Return ONLY valid JSON.
        
        Format:
        {{
            "unique_traits": ["Trait 1", "Trait 2"],
            "strengths": ["Strength 1", "Strength 2"],
            "reasoning_profile": {{
                "reasoning_type": "String",
                "risk_tolerance": "String"
            }}
        }}
        """
        
        try:
            response = self.llm.invoke(prompt)
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            
            dna = json.loads(response.strip())
            
            worker_id = str(uuid.uuid4())
            worker = DigitalProfessionalModel(
                id=worker_id,
                profession_id=template.id,
                status="AVAILABLE",
                reputation=500,
                professional_dna=dna
            )
            
            db.add(worker)
            db.commit()
            
            # Initialize Personal Memory in Qdrant
            collection_name = f"memory_tenant_001" # Default tenant for MVP
            qdrant_service.create_collection_if_not_exists(collection_name)
            
            # Seed the agent's memory with its profession context
            qdrant_service.insert_memory(
                collection_name=collection_name,
                points=[
                    # Need embeddings here. For MVP we'll skip the actual vector, 
                    # but the agent has a dedicated personal memory slot.
                ]
            )
            
            # In a full system, we emit a Kafka ProfessionalCreated event here.
            print(f"WorkforceSpawnerAgent: Spawning complete. Agent {worker_id} is now AVAILABLE.")
            
            db.close()
            return worker_id
            
        except Exception as e:
            print(f"WorkforceSpawnerAgent: Failed to spawn worker: {e}")
            db.close()
            return None
