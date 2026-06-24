import asyncio
from datetime import timedelta
from temporalio import workflow

# Import with temporalio.workflow.unsafe.imports_passed_through for safe module loading
with workflow.unsafe.imports_passed_through():
    from app.temporal.activities.agent_activities import execute_dynamic_agent_graph
    from app.temporal.activities.saga_compensations import execute_git_revert

@workflow.defn
class MasterAgentWorkflow:
    """
    The top-level Workflow execution for a Sovereign AI task.
    Includes state queries for real-time Dashboard tracking and signals for CTO intervention.
    """
    def __init__(self):
        self.status = "INITIALIZING"
        self.is_paused = False
        self.abort_requested = False
        self.current_thought = "Booting up cognitive architecture..."

    @workflow.query
    def get_agent_status(self) -> dict:
        """Allows Mission Control UI to ping the exact state of the agent's mind in real time."""
        return {
            "status": self.status,
            "is_paused": self.is_paused,
            "current_thought": self.current_thought
        }

    @workflow.signal
    def pause_agent(self) -> None:
        """Instantly halts LangGraph execution (circuit breaker trigger)."""
        self.is_paused = True
        self.status = "PAUSED_BY_CTO"

    @workflow.signal
    def resume_agent(self) -> None:
        """Un-pauses the agent and continues execution exactly where it left off."""
        self.is_paused = False
        self.status = "RUNNING"

    @workflow.signal
    def abort_task(self) -> None:
        """Kills the graph and triggers the Saga Compensation pattern."""
        self.abort_requested = True
        self.status = "ABORTING"

    @workflow.run
    async def run(self, tenant_id: str, professional_dna: dict, task: str) -> str:
        self.status = "RUNNING"
        self.current_thought = "Analyzing DNA and Compiling Graph..."
        
        try:
            # Polling loop to support pausing
            while self.is_paused:
                await asyncio.sleep(1)
                
            if self.abort_requested:
                raise Exception("Task forcefully aborted by CTO.")
                
            # Execute the massive Activity (which runs the LangGraph Compiler)
            # The Activity itself is responsible for heartbeating back to Temporal
            result = await workflow.execute_activity(
                execute_dynamic_agent_graph,
                args=[tenant_id, professional_dna, task],
                schedule_to_close_timeout=timedelta(hours=24), # Massive timeout allowance
                retry_policy=workflow.RetryPolicy(
                    initial_interval=timedelta(seconds=2),
                    backoff_coefficient=2.0,
                    maximum_interval=timedelta(minutes=5),
                    maximum_attempts=5,
                    non_retryable_error_types=["InvalidDNAPayload", "UnrecoverableHallucination"]
                )
            )
            
            self.status = "COMPLETED"
            self.current_thought = "Task successfully executed and PR opened."
            return result
            
        except Exception as e:
            self.status = "FAILED"
            self.current_thought = f"Fatal Error: {str(e)}. Initiating Saga Compensation."
            
            # THE SAGA PATTERN: Rollback any corrupted state
            await workflow.execute_activity(
                execute_git_revert,
                args=[tenant_id, task],
                schedule_to_close_timeout=timedelta(minutes=10)
            )
            
            raise e
