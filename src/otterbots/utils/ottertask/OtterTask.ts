/**
 * Represents a task managed by the OtterTask system. Each task has a name, description,
 * a priority status, a start condition, a cron expression for scheduling, and a function
 * to be executed when the task is triggered.
 * @class OtterTask
 * @author matheo-1712
 * @version 1.0.0
 */
export class OtterTask {

    // Task properties
    private name : string
    private description : string
    private important : boolean
    private onStart: boolean = false
    private cron_expression : string
    private taskFunction : () => void

    constructor(name: string, description: string, important: boolean, onStart: boolean, cron_expression: string, taskFunction: () => void) {
        this.name = name
        this.description = description
        this.important = important
        this.onStart = onStart
        this.cron_expression = cron_expression
        this.taskFunction = taskFunction
    }

    /** ****************
     * GETTERS / SETTERS
     *  ***************** **/
    getName() {return this.name}
    getDescription() {return this.description}
    getImportant() {return this.important}
    getOnStart() {return this.onStart}
    getCronExpression() {return this.cron_expression}
    getTaskFunction() {return this.taskFunction}

    setName(name: string) {this.name = name}
    setDescription(description: string) {this.description = description}
    setImportant(important: boolean) {this.important = important}
    setOnStart(onStart: boolean) {this.onStart = onStart}
    setCronExpression(cron_expression: string) {this.cron_expression = cron_expression}
    setTaskFunction(taskFunction: () => void) {this.taskFunction = taskFunction}
}
