import {OtterTask} from "@/otterbots/utils/ottertask/OtterTask";
import cron from "node-cron";
import {otterlogs} from "@/otterbots/utils/otterlogs";

/**
 * Represents a manager for OtterTask objects.
 * @class OtterTaskManager
 * @author matheo-1712
 * @version 1.0.0
 */
export class OtterTaskManager {
    private tasksOnStart: OtterTask[] = [];
    private tasks: OtterTask[] = [];

    constructor() {
        this.tasksOnStart = [];
        this.tasks = [];
    }

    /** ****************
     * TASK LIST METHODS
     *  ***************** **/

    /**
     * Adds a task to the list of tasks.
     * @param task
     */
    addTask(task: OtterTask) {
        this.tasks.push(task);

        // Add task to the list of tasks to be executed on startup
        if (task.getOnStart()) {
            this.tasksOnStart.push(task);
        }
    }

    /**
     * Removes a task from the list of tasks.
     * @param task
     */
    removeTask(task: OtterTask) {
        this.tasks = this.tasks.filter(t => t !== task);
        this.tasksOnStart = this.tasksOnStart.filter(t => t !== task);
    }

    /** ****************
     * TASK START METHODS
     *  ***************** **/

    /**
     * Initializes and executes tasks defined in the `tasksOnStart` list.
     * Each task in the list is expected to provide a callable task function,
     * which will be invoked during this process.
     *
     * @return {void} This method does not return a value.
     */
    initTasksOnStart() {
        this.tasksOnStart.forEach(task => {
            const taskFunction = task.getTaskFunction();
            taskFunction();
        });
    }

    /**
     * Initializes scheduled tasks using cron expressions. Each task is configured
     * to execute based on its defined cron expression. Logs task initialization
     * status, execution outcomes, and durations. Tracks and logs tasks that fail
     * to initialize.
     *
     * @return {void} No return value. Tasks are scheduled to run on cron triggers.
     */
    initTasksOnCron() {
        let taskCount = 0;
        const failedTasks: string[] = [];
        this.tasks.forEach(task => {
            const cronExpression = task.getCronExpression();
            const taskName = task.getName();
            const taskFunction = task.getTaskFunction();

            if (!cron.validate(cronExpression)) {
                otterlogs.error(`Invalid cron expression for task ${taskName}: ${cronExpression}`);
                failedTasks.push(taskName);
                return;
            }

            try {
                cron.schedule(cronExpression, async () => {
                    const startTime = Date.now();
                    try {
                        taskFunction();
                        const duration = Date.now() - startTime;
                        otterlogs.success(`Task ${taskName} completed successfully in ${duration}ms`);
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        otterlogs.error(`Task ${taskName} failed after ${duration}ms: ${error}`);
                    }
                });
                taskCount++;
            } catch (error) {
                otterlogs.error(`Error scheduling task ${taskName}: ${error}`);
                failedTasks.push(taskName);
            }
        });
        if (failedTasks.length > 0) {
            otterlogs.error(`${failedTasks.length} task(s) failed to initialize: ${failedTasks.join(', ')}`);
        }
        otterlogs.success(`${taskCount} task(s) initialized on cron.`);
    }

    /** ****************
     * GETTERS / SETTERS
     *  ***************** **/
    getTasksOnStart() {return this.tasksOnStart}
    getTasks() {return this.tasks}

    setTasksOnStart(tasksOnStart: OtterTask[]) {this.tasksOnStart = tasksOnStart}
    setTasks(tasks: OtterTask[]) {this.tasks = tasks}

}
