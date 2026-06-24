from datetime import timedelta
from temporalio import workflow
from temporalio.common import RetryPolicy

# Import activity (must use string name for execution context if running in sandbox)
with workflow.unsafe.imports_passed_through():
    from app.temporal.activities import execute_dynamic_agent_graph

@workflow.defn
class AgentExecutionWorkflow:
    """
    The robust Temporal Workflow governing the full lifecycle of an Agent Task.
    Survives pod crashes, timeouts, and network failures.
    """
    
    @workflow.run
    async def run(self, tenant_id: str, professional_dna: dict, task: str) -> str:
        workflow.logger.info(f"Workflow Started for Task: {task}")
        
        # 1. State Transition: Idle -> Executing
        # (In production, this would fire an event back to Kafka/Java Service)
        
        # 2. Execute the Cognitive Loop Activity
        try:
            result = await workflow.execute_activity(
                execute_dynamic_agent_graph,
                args=[tenant_id, professional_dna, task],
                schedule_to_close_timeout=timedelta(hours=2),
                retry_policy=RetryPolicy(
                    initial_interval=timedelta(seconds=10),
                    maximum_interval=timedelta(minutes=5),
                    maximum_attempts=3
                )
            )
            
            # 3. State Transition: Executing -> Completed
            workflow.logger.info(f"Workflow Completed Successfully.")
            return result
            
        except Exception as e:
            workflow.logger.error(f"Workflow Failed: {e}")
            # 4. State Transition: Executing -> Failed
            raise e
