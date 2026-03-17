export class OtterTask {

    private name : string
    private description : string
    private important : boolean
    private cron_expression : string

    constructor( name: string, description: string, status: boolean, cron_expression: string) {
        this.name = name
        this.description = description
        this.important = status
        this.cron_expression = cron_expression

    }

    /** ****************
     * GETTERS / SETTERS
     *  ***************** **/
    getName() {
        return this.name
    }

    getDescription() {
        return this.description
    }

    getStatus() {
        return this.important
    }

    getCronExpression() {
        return this.cron_expression
    }

    setName(name: string) {
        this.name = name
    }

    setDescription(description: string) {
        this.description = description
    }

    setStatus(status: boolean) {
        this.important = status
    }
    setCronExpression(cron_expression: string) {
        this.cron_expression = cron_expression
    }

}
