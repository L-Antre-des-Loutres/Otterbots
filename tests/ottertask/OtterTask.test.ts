import {OtterTask} from "@/otterbots/utils/ottertask/OtterTask";
import {otterlogs} from "@/otterbots/utils/otterlogs";

// Fonction de test
function test(ms: number): void {
    otterlogs.debug(`Sleeping for ${ms}ms...`);
}

describe('Classe OtterTask', () => {

    // Nettoyer la liste des tâches avant chaque test
    beforeEach(() => {
        // Réinitialiser la liste des tâches pour éviter les interférences entre tests
        const taskList = OtterTask.getTaskList();
        taskList.length = 0;
    });

    it(`Initialisation classe`, () => {
        const task = new OtterTask('Backup', 'Sauvegarde de la BDD', true, false, '0 0 * * *', () => test(2));
        expect(task.getName()).toBe('Backup');
        expect(task.getDescription()).toBe('Sauvegarde de la BDD');
        expect(task.getImportant()).toBe(true);
        expect(task.getOnStart()).toBe(false);
        expect(task.getCronExpression()).toBe('0 0 * * *');
        expect(typeof task.getTaskFunction()).toBe('function');
    });

    it('Setters & Getters', () => {
        const task = new OtterTask('Initiale', 'Description de base', false, false, '* * * * *', () => test(2));
        task.setName('Nettoyage');
        task.setDescription('Nettoie les vieux logs');
        task.setImportant(true);
        task.setCronExpression('*/5 * * * *');
        task.setOnStart(true);
        task.setTaskFunction(() => test(2))

        expect(task.getName()).toBe('Nettoyage');
        expect(task.getDescription()).toBe('Nettoie les vieux logs');
        expect(task.getImportant()).toBe(true);
        expect(task.getOnStart()).toBe(true);
        expect(task.getCronExpression()).toBe('*/5 * * * *');
        expect(task.getTaskFunction()).toBe(task.getTaskFunction());
    });

    describe('Task List', () => {
        it('Add tasks to the task list', () => {
            new OtterTask('Initiale', 'Description de base', false, false, '* * * * *', () => test(2));
            new OtterTask('Backup', 'Sauvegarde de la BDD', true, false, '0 0 * * *', () => test(2));
            new OtterTask('Nettoyage', 'Nettoie les vieux logs', false, false, '0 0 1 * *', () => test(2));

            expect(OtterTask.getTaskNumber()).toBe(3);
            const taskList = OtterTask.getTaskList();
            expect(taskList.length).toBe(3);
        });

        it('Remove a task from the task list', () => {
            const task = new OtterTask('Initiale', 'Description de base', false, false, '* * * * *', () => test(2));
            new OtterTask('Backup', 'Sauvegarde de la BDD', true, false, '0 0 * * *', () => test(2));

            expect(OtterTask.getTaskNumber()).toBe(2);

            OtterTask.removeTask(task);

            expect(OtterTask.getTaskNumber()).toBe(1);
            const taskList = OtterTask.getTaskList();
            expect(taskList.length).toBe(1);
        });

        it('Retrieve a task by name', () => {
            new OtterTask('Backup', 'Sauvegarde de la BDD', true, false, '0 0 * * *', () => test(2));
            new OtterTask('Nettoyage', 'Nettoie les vieux logs', false, false, '0 0 1 * *', () => test(2));

            const retrievedTask = OtterTask.getTaskByName('Backup');

            expect(retrievedTask).toBeDefined();
            expect(retrievedTask?.getDescription()).toBe('Sauvegarde de la BDD');
        });

        it('Return undefined for non-existent task name', () => {
            new OtterTask('Backup', 'Sauvegarde de la BDD', true, false, '0 0 * * *', () => test(2));

            const retrievedTask = OtterTask.getTaskByName('NonExistent');

            expect(retrievedTask).toBeUndefined();
        });

        it('Function initTask', () => {

        })
    })
});
