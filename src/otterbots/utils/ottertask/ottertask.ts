/**
 * Represents a scheduled task with a name, description, status, and a cron expression.
 */
export class OtterTask {

    // List of tasks
    private static taskList: OtterTask[] = []

    // Task properties
    private name : string
    private description : string
    private important : boolean
    private onStart: boolean = false
    private cron_expression : string
    private taskFunction : () => void

    constructor( name: string, description: string, important: boolean, onStart: boolean, status: boolean, cron_expression: string, taskFunction: () => void) {
        this.name = name
        this.description = description
        this.important = status
        this.onStart = onStart
        this.cron_expression = cron_expression
        this.taskFunction = taskFunction
    }

    /** ****************
     * TASK LIST METHODS
     *  ***************** **/
    static getTaskList() {return this.taskList}
    static getTaskByName(name: string) {
        return this.taskList.find(task => task.name === name)
    }
    static getTaskNumber() {return this.taskList.length}
    static addTask(task: OtterTask) {this.taskList.push(task)}

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
    setTaskFunction(taskFunction: () => Promise<void>) {this.taskFunction = taskFunction}

}
