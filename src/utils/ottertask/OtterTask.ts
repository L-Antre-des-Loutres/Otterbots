/**
 * Type definition for task execution functions. Supports both synchronous
 * and asynchronous task implementations.
 */
export type TaskFunction = () => void | Promise<void>;

/**
 * Enumeration of possible task execution states.
 */
export enum TaskStatus {
    IDLE = 'idle',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

/**
 * Represents a task managed by the OtterTask system. Each task has a name, description,
 * a priority status, a start condition, a cron expression for scheduling, and a function
 * to be executed when the task is triggered. Tasks can be synchronous or asynchronous
 * and maintain their execution state for monitoring purposes.
 * @class OtterTask
 * @author matheo-1712
 * @version 2.0.0
 */
export class OtterTask {

    private readonly name: string;
    private description: string;
    private important: boolean;
    private onStart: boolean;
    private cronExpression: string;
    private taskFunction: TaskFunction;
    private status: TaskStatus;
    private lastExecutionTime: number | null;
    private executionCount: number;
    private failureCount: number;
    private enabled: boolean;

    constructor(
        name: string,
        description: string,
        important: boolean,
        onStart: boolean,
        cronExpression: string,
        taskFunction: TaskFunction
    ) {
        if (!name || name.trim().length === 0) {
            throw new Error('Task name cannot be empty');
        }
        if (!taskFunction) {
            throw new Error('Task function is required');
        }

        this.name = name.trim();
        this.description = description || '';
        this.important = important;
        this.onStart = onStart;
        this.cronExpression = cronExpression || '';
        this.taskFunction = taskFunction;
        this.status = TaskStatus.IDLE;
        this.lastExecutionTime = null;
        this.executionCount = 0;
        this.failureCount = 0;
        this.enabled = true;
    }

    /**
     * Executes the task function and updates execution statistics.
     * Handles both synchronous and asynchronous task functions.
     * @returns Promise that resolves when execution completes
     * @throws Error if task execution fails
     */
    async execute(): Promise<void> {
        if (!this.enabled) {
            throw new Error(`Task ${this.name} is disabled`);
        }

        this.status = TaskStatus.RUNNING;
        const startTime = Date.now();

        try {
            await Promise.resolve(this.taskFunction());
            this.status = TaskStatus.COMPLETED;
            this.executionCount++;
        } catch (error) {
            this.status = TaskStatus.FAILED;
            this.failureCount++;
            throw error;
        } finally {
            this.lastExecutionTime = Date.now() - startTime;
        }
    }

    /**
     * Resets task execution statistics to their initial values.
     */
    resetStats(): void {
        this.executionCount = 0;
        this.failureCount = 0;
        this.lastExecutionTime = null;
        this.status = TaskStatus.IDLE;
    }

    /** ****************
     * GETTERS / SETTERS
     *  ***************** **/
    getName(): string {return this.name}
    getDescription(): string {return this.description}
    getImportant(): boolean {return this.important}
    getOnStart(): boolean {return this.onStart}
    getCronExpression(): string {return this.cronExpression}
    getTaskFunction(): TaskFunction {return this.taskFunction}
    getStatus(): TaskStatus {return this.status}
    getLastExecutionTime(): number | null {return this.lastExecutionTime}
    getExecutionCount(): number {return this.executionCount}
    getFailureCount(): number {return this.failureCount}
    isEnabled(): boolean {return this.enabled}

    setDescription(description: string): void {this.description = description}
    setImportant(important: boolean): void {this.important = important}
    setOnStart(onStart: boolean): void {this.onStart = onStart}
    setCronExpression(cronExpression: string): void {this.cronExpression = cronExpression}
    setTaskFunction(taskFunction: TaskFunction): void {
        if (!taskFunction) {
            throw new Error('Task function cannot be null');
        }
        this.taskFunction = taskFunction;
    }
    setEnabled(enabled: boolean): void {this.enabled = enabled}
}
