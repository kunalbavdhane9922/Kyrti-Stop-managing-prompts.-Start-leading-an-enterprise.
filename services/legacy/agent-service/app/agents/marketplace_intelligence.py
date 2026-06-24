from app.core.database import SessionLocal
from app.models.domain import ProfessionTemplateModel, DigitalProfessionalModel
from app.agents.profession_creator import ProfessionCreatorAgent
from app.agents.workforce_spawner import WorkforceSpawnerAgent

class MarketplaceIntelligenceAgent:
    """
    Autonomous AI Agent that monitors the ecosystem and decides when to spawn new workforce
    or create new professions.
    """
    
    def __init__(self):
        self.profession_creator = ProfessionCreatorAgent()
        self.workforce_spawner = WorkforceSpawnerAgent()
        
    def evaluate_ecosystem(self):
        """
        Evaluate demand signals and execute creation if necessary.
        Calculates actual utilization metrics from the PostgreSQL database.
        """
        db = SessionLocal()
        
        # Calculate real utilization metrics
        total_professionals = db.query(DigitalProfessionalModel).count()
        busy_professionals = db.query(DigitalProfessionalModel).filter(DigitalProfessionalModel.status == "BUSY").count()
        
        # Calculate demand signal (0-100)
        demand_signal = (busy_professionals / total_professionals * 100) if total_professionals > 0 else 100.0
        print(f"MarketplaceIntelligence: Ecosystem Demand Signal = {demand_signal:.2f}%")
        
        # Check if we need a new profession
        if demand_signal > 90:
            print("MarketplaceIntelligence: High overall demand detected. Evaluating new profession creation.")
            # Trigger autonomous profession creation
            self.profession_creator.generate_profession("AI Governance Specialist")
            
        # Check if we need to spawn more workforce for existing professions
        templates = db.query(ProfessionTemplateModel).all()
        for template in templates:
            total_for_profession = db.query(DigitalProfessionalModel).filter(DigitalProfessionalModel.profession_id == template.id).count()
            busy_for_profession = db.query(DigitalProfessionalModel).filter(
                DigitalProfessionalModel.profession_id == template.id,
                DigitalProfessionalModel.status == "BUSY"
            ).count()
            
            utilization = (busy_for_profession / total_for_profession * 100) if total_for_profession > 0 else 100.0
            
            if utilization > 85:
                print(f"MarketplaceIntelligence: High utilization ({utilization:.2f}%) for {template.profession}. Spawning new worker.")
                self.workforce_spawner.spawn_worker(template.id)
                
        db.close()
