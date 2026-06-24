from datetime import timedelta
from temporalio import workflow, activity
from app.runtime.graph import DigitalProfessionalGraph
from app.core.database import SessionLocal
from app.models.domain import ProfessionTemplateModel, DigitalProfessionalModel

@activity.defn
async def execute_agent_task(payload: dict) -> str:
    worker_id = payload.get("worker_id")
    task = payload.get("task")
    
    # Load worker details from Postgres
    db = SessionLocal()
    worker = db.query(DigitalProfessionalModel).filter(DigitalProfessionalModel.id == worker_id).first()
    if not worker:
        db.close()
        return f"Error: Worker {worker_id} not found."
        
    template = db.query(ProfessionTemplateModel).filter(ProfessionTemplateModel.id == worker.profession_id).first()
    db.close()
    
    if not template:
        return f"Error: Template {worker.profession_id} not found."

    # Initialize the LangGraph ReAct Agent for this Professional
    agent = DigitalProfessionalGraph(
        permissions=template.permissions,
        professional_dna=worker.professional_dna
    )
    
    # Execute the ReAct loop
    result = agent.execute_task(task)
    
    final_message = result['messages'][-1].content
    return final_message

@workflow.defn
class SAEPWorkflow:
    @workflow.run
    async def run(self, payload: dict) -> str:
        # Orchestrate the LangGraph execution via an Activity
        # This makes the execution state recoverable in Temporal if the node crashes
        result = await workflow.execute_activity(
            execute_agent_task,
            payload,
            start_to_close_timeout=timedelta(minutes=10)
        )
        return result
