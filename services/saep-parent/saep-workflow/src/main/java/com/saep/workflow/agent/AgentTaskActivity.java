package com.saep.workflow.agent;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;

/**
 * This interface defines the Activity that will be executed by the Python AI worker.
 * The Java orchestrator will call this interface, and Temporal will route the call
 * to the Python worker listening on the AGENT_TASK_QUEUE.
 */
@ActivityInterface
public interface AgentTaskActivity {

    @ActivityMethod(name = "ExecuteTask")
    String executeTask(String taskId, String prompt);
}
