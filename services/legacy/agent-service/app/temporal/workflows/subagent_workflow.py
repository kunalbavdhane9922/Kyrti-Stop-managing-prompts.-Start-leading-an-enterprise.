import asyncio
from datetime import timedelta
from temporalio import workflow

with workflow.unsafe.imports_passed_through():
    from app.temporal.activities.agent_activities import execute_sub_agent_graph

@workflow.defn
class QA_SubAgentWorkflow:
    """
    A Child Workflow that can be spawned massively in parallel by the Lead Agent Workflow.
    Used for spinning up 5 concurrent QA testers to brutally audit code.
    """
    @workflow.run
    async def run(self, tenant_id: str, pull_request_id: str, test_suite_id: str) -> str:
        # Executes a specific sub-agent activity
        result = await workflow.execute_activity(
            execute_sub_agent_graph,
            args=[tenant_id, pull_request_id, test_suite_id],
            start_to_close_timeout=timedelta(hours=1),
            retry_policy=workflow.RetryPolicy(
                maximum_attempts=3
            )
        )
        return result
