import {OtterTask, TaskStatus} from "@/otterbots/utils/ottertask/OtterTask";
import cron, {ScheduledTask} from "node-cron";
import {otterlogs} from "@/otterbots/utils/otterlogs";

/**
 * Interface for task execution results containing execution metadata.
 */
interface TaskExecutionResult {
    taskName: string;
    success: boolean;
    duration: number;
    error?: Error;
}

/**
 * Represents a manager for OtterTask objects. Handles task registration,
 * scheduling, and execution for both startup tasks and cron-based scheduled tasks.
 * Provides comprehensive logging and error tracking capabilities.
 * @class OtterTaskManager
 * @author matheo-1712
 * @version 2.0.0
 */
export class OtterTaskManager {
    private tasks: Map<string, OtterTask>;
    private scheduledTasks: Map<string, ScheduledTask>;

    constructor() {
        this.tasks = new Map();
        this.scheduledTasks = new Map();
    }

    /** ****************
     * TASK LIST METHODS
     *  ***************** **/

    /**
     * Adds a task to the manager. If a task with the same name already exists,
     * it will be replaced and the old scheduled task will be stopped if applicable.
     * @param task The OtterTask instance to add
     * @throws Error if task is null or invalid
     */
    addTask(task: OtterTask): void {
        if (!task) {
            throw new Error('Cannot add null task');
        }

        const taskName = task.getName();

        if (this.tasks.has(taskName)) {
            otterlogs.warn(`Task ${taskName} already exists. Replacing...`);
            this.removeTask(taskName);
        }

        this.tasks.set(taskName, task);
        otterlogs.log(`Task ${taskName} added to manager`);
    }

    /**
     * Removes a task from the manager by name. If the task is scheduled,
     * stops its cron schedule before removal.
     * @param taskName The name of the task to remove
     * @returns true if task was removed, false if task was not found
     */
    removeTask(taskName: string): boolean {
        const scheduledTask = this.scheduledTasks.get(taskName);
        if (scheduledTask) {
            scheduledTask.stop();
            this.scheduledTasks.delete(taskName);
        }

        const removed = this.tasks.delete(taskName);
        if (removed) {
            otterlogs.log(`Task ${taskName} removed from manager`);
        }
        return removed;
    }

    /**
     * Retrieves a task by its name.
     * @param taskName The name of the task to retrieve
     * @returns The OtterTask instance or undefined if not found
     */
    getTask(taskName: string): OtterTask | undefined {
        return this.tasks.get(taskName);
    }

    /**
     * Checks if a task exists in the manager.
     * @param taskName The name of the task to check
     * @returns true if task exists, false otherwise
     */
    hasTask(taskName: string): boolean {
        return this.tasks.has(taskName);
    }

    /**
     * Clears all tasks from the manager and stops all scheduled tasks.
     */
    clearAllTasks(): void {
        this.scheduledTasks.forEach(scheduledTask => scheduledTask.stop());
        this.scheduledTasks.clear();
        this.tasks.clear();
        otterlogs.log('All tasks cleared from manager');
    }

    /** ****************
     * TASK START METHODS
     *  ***************** **/

    /**
     * Initializes and executes tasks marked to run on startup. Each task in
     * the list is executed asynchronously. Logs task execution outcomes and
     * durations. Tracks and logs tasks that fail to execute. Returns detailed
     * execution results for all tasks.
     *
     * @returns Promise<TaskExecutionResult[]> Array of execution results for all startup tasks
     */
    async initTasksOnStart(): Promise<TaskExecutionResult[]> {
        const tasksOnStart = Array.from(this.tasks.values()).filter(task => 
            task.getOnStart() && task.isEnabled()
        );

        if (tasksOnStart.length === 0) {
            otterlogs.log('No startup tasks to execute');
            return [];
        }

        otterlogs.log(`Executing ${tasksOnStart.length} startup task(s)...`);

        const results: TaskExecutionResult[] = [];
        const executionPromises = tasksOnStart.map(async (task) => {
            const taskName = task.getName();
            const startTime = Date.now();

            try {
                await task.execute();
                const duration = task.getLastExecutionTime() || Date.now() - startTime;
                otterlogs.success(`Task ${taskName} completed successfully in ${duration}ms`);
                
                results.push({
                    taskName,
                    success: true,
                    duration
                });
            } catch (error) {
                const duration = Date.now() - startTime;
                const errorObj = error instanceof Error ? error : new Error(String(error));
                otterlogs.error(`Task ${taskName} failed after ${duration}ms: ${errorObj.message}`);
                
                results.push({
                    taskName,
                    success: false,
                    duration,
                    error: errorObj
                });
            }
        });

        await Promise.allSettled(executionPromises);

        const successCount = results.filter(r => r.success).length;
        const failedCount = results.filter(r => !r.success).length;

        if (failedCount > 0) {
            const failedTaskNames = results.filter(r => !r.success).map(r => r.taskName);
            otterlogs.error(`${failedCount} task(s) failed to execute on start: ${failedTaskNames.join(', ')}`);
        }

        otterlogs.success(`${successCount}/${tasksOnStart.length} startup task(s) executed successfully`);
        return results;
    }

    /**
     * Initializes scheduled tasks using cron expressions. Each task is configured
     * to execute based on its defined cron expression. Validates cron expressions
     * before scheduling. Logs task initialization status, execution outcomes, and
     * durations. Tracks and logs tasks that fail to initialize or execute.
     *
     * @returns void Tasks are scheduled to run on cron triggers
     */
    initTasksOnCron(): void {
        const tasksWithCron = Array.from(this.tasks.values()).filter(task => 
            task.getCronExpression() && task.getCronExpression().trim().length > 0
        );

        if (tasksWithCron.length === 0) {
            otterlogs.log('No cron tasks to schedule');
            return;
        }

        let scheduledCount = 0;
        const failedTasks: string[] = [];

        tasksWithCron.forEach(task => {
            const cronExpression = task.getCronExpression();
            const taskName = task.getName();

            if (!cron.validate(cronExpression)) {
                otterlogs.error(`Invalid cron expression for task ${taskName}: ${cronExpression}`);
                failedTasks.push(taskName);
                return;
            }

            try {
                const scheduledTask = cron.schedule(cronExpression, async () => {
                    if (!task.isEnabled()) {
                        otterlogs.debug(`Task ${taskName} is disabled, skipping execution`);
                        return;
                    }

                    const startTime = Date.now();
                    try {
                        await task.execute();
                        const duration = task.getLastExecutionTime() || Date.now() - startTime;
                        otterlogs.success(`Cron task ${taskName} completed successfully in ${duration}ms`);
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        const errorMsg = error instanceof Error ? error.message : String(error);
                        otterlogs.error(`Cron task ${taskName} failed after ${duration}ms: ${errorMsg}`);
                    }
                });

                this.scheduledTasks.set(taskName, scheduledTask);
                scheduledCount++;
                otterlogs.log(`Task ${taskName} scheduled with cron: ${cronExpression}`);
            } catch (error) {
                const errorMsg = error instanceof Error ? error.message : String(error);
                otterlogs.error(`Error scheduling task ${taskName}: ${errorMsg}`);
                failedTasks.push(taskName);
            }
        });

        if (failedTasks.length > 0) {
            otterlogs.error(`${failedTasks.length} task(s) failed to initialize: ${failedTasks.join(', ')}`);
        }

        otterlogs.success(`${scheduledCount}/${tasksWithCron.length} task(s) initialized on cron`);
    }

    /**
     * Executes a specific task by name on demand.
     * @param taskName The name of the task to execute
     * @returns Promise<TaskExecutionResult> Result of the task execution
     * @throws Error if task is not found
     */
    async executeTask(taskName: string): Promise<TaskExecutionResult> {
        const task = this.tasks.get(taskName);
        if (!task) {
            throw new Error(`Task ${taskName} not found`);
        }

        const startTime = Date.now();
        try {
            await task.execute();
            const duration = task.getLastExecutionTime() || Date.now() - startTime;
            otterlogs.success(`Manual execution of task ${taskName} completed in ${duration}ms`);
            
            return {
                taskName,
                success: true,
                duration
            };
        } catch (error) {
            const duration = Date.now() - startTime;
            const errorObj = error instanceof Error ? error : new Error(String(error));
            otterlogs.error(`Manual execution of task ${taskName} failed after ${duration}ms: ${errorObj.message}`);
            
            return {
                taskName,
                success: false,
                duration,
                error: errorObj
            };
        }
    }

    /** ****************
     * UTILITY METHODS
     *  ***************** **/

    /**
     * Enables a task by name, allowing it to be executed.
     * @param taskName The name of the task to enable
     * @returns true if task was enabled, false if task was not found
     */
    enableTask(taskName: string): boolean {
        const task = this.tasks.get(taskName);
        if (task) {
            task.setEnabled(true);
            otterlogs.log(`Task ${taskName} enabled`);
            return true;
        }
        return false;
    }

    /**
     * Disables a task by name, preventing it from being executed.
     * @param taskName The name of the task to disable
     * @returns true if task was disabled, false if task was not found
     */
    disableTask(taskName: string): boolean {
        const task = this.tasks.get(taskName);
        if (task) {
            task.setEnabled(false);
            otterlogs.log(`Task ${taskName} disabled`);
            return true;
        }
        return false;
    }

    /**
     * Gets statistics for a specific task.
     * @param taskName The name of the task
     * @returns Object containing task statistics or undefined if task not found
     */
    getTaskStats(taskName: string): {
        executions: number;
        failures: number;
        lastExecutionTime: number | null;
        status: TaskStatus;
        enabled: boolean;
    } | undefined {
        const task = this.tasks.get(taskName);
        if (!task) return undefined;

        return {
            executions: task.getExecutionCount(),
            failures: task.getFailureCount(),
            lastExecutionTime: task.getLastExecutionTime(),
            status: task.getStatus(),
            enabled: task.isEnabled()
        };
    }

    /**
     * Lists all registered task names.
     * @returns Array of task names
     */
    listTaskNames(): string[] {
        return Array.from(this.tasks.keys());
    }

    /**
     * Gets the total number of registered tasks.
     * @returns Number of tasks
     */
    getTaskCount(): number {
        return this.tasks.size;
    }

    /** ****************
     * GETTERS / SETTERS
     *  ***************** **/
    getAllTasks(): OtterTask[] {
        return Array.from(this.tasks.values());
    }

    getTasksOnStart(): OtterTask[] {
        return Array.from(this.tasks.values()).filter(task => task.getOnStart());
    }

    getScheduledTasks(): OtterTask[] {
        return Array.from(this.tasks.values()).filter(task => 
            task.getCronExpression() && task.getCronExpression().trim().length > 0
        );
    }
}
