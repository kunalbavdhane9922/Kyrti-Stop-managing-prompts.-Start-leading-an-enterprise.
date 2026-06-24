import json
import uuid
from langchain_community.llms import Ollama
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.domain import ProfessionTemplateModel

class ProfessionCreatorAgent:
    """
    Autonomous AI Agent that designs and registers new Profession Templates.
    """
    
    def __init__(self):
        self.llm = Ollama(base_url=settings.OLLAMA_BASE_URL, model=settings.OLLAMA_MODEL)
        
    def generate_profession(self, profession_name: str):
        prompt = f"""
        You are the SAEP Profession Creator Agent.
        Your task is to design a new Profession Template for: {profession_name}.
        Return ONLY valid JSON.
        
        Format:
        {{
            "profession": "{profession_name}",
            "category": "String",
            "skills": ["List", "of", "skills"],
            "responsibilities": ["List", "of", "responsibilities"],
            "permissions": ["List", "of", "allowed", "actions"],
            "career_path": ["List", "of", "promotions"],
            "behavior_profile": {{
                "reasoning_type": "String",
                "communication_style": "String",
                "decision_speed": "String",
                "learning_speed": "String"
            }}
        }}
        """
        
        try:
            print(f"ProfessionCreatorAgent: Synthesizing template for {profession_name}...")
            response = self.llm.invoke(prompt)
            
            # Clean response
            if "```json" in response:
                response = response.split("```json")[1].split("```")[0]
            
            data = json.loads(response.strip())
            
            # Save to Postgres
            db = SessionLocal()
            template = ProfessionTemplateModel(
                id=str(uuid.uuid4()),
                profession=data.get("profession", profession_name),
                category=data.get("category", "General"),
                skills=data.get("skills", []),
                responsibilities=data.get("responsibilities", []),
                permissions=data.get("permissions", []),
                career_path=data.get("career_path", []),
                behavior_profile=data.get("behavior_profile", {})
            )
            db.add(template)
            db.commit()
            db.close()
            
            print(f"ProfessionCreatorAgent: Successfully registered {profession_name} in database.")
            return template.id
            
        except Exception as e:
            print(f"ProfessionCreatorAgent: Failed to generate template: {e}")
            return None
