import {OtterTask} from "@/otterbots/utils/ottertask/ottertask";


describe('Classe OtterTask', () => {

    it(`Initialisation de la classe`, () => {
        const task = new OtterTask('Backup', 'Sauvegarde de la BDD', true, '0 0 * * *');
        expect(task.getName()).toBe('Backup');
        expect(task.getDescription()).toBe('Sauvegarde de la BDD');
        expect(task.getStatus()).toBe(true);
        expect(task.getCronExpression()).toBe('0 0 * * *');
    });

    it('Setters & Getters', () => {
        const task = new OtterTask('Initiale', 'Description de base', false, '* * * * *');
        task.setName('Nettoyage');
        task.setDescription('Nettoie les vieux logs');
        task.setStatus(true);
        task.setCronExpression('*/5 * * * *');

        expect(task.getName()).toBe('Nettoyage');
        expect(task.getDescription()).toBe('Nettoie les vieux logs');
        expect(task.getStatus()).toBe(true);
        expect(task.getCronExpression()).toBe('*/5 * * * *');
    });

    it('Task list', () => {
        const task = new OtterTask('Initiale', 'Description de base', false, '* * * * *');
        const task2 = new OtterTask('Backup', 'Sauvegarde de la BDD', true, '0 0 * * *');
        const task3 = new OtterTask('Nettoyage', 'Nettoie les vieux logs', false, '0 0 1 * *');

        // On ajoute des tâches à la liste
        OtterTask.addTask(task);
        OtterTask.addTask(task2);
        OtterTask.addTask(task3);

        // On récupére une tâche par son nom
        const retrievedTask = OtterTask.getTaskByName('Backup');
        expect(retrievedTask).toBeDefined();
        expect(retrievedTask?.getDescription()).toBe('Sauvegarde de la BDD');

        // Obtenir le nombre de tâches dans la liste
        expect(OtterTask.getTaskNumber()).toBe(3);

        const taskList = OtterTask.getTaskList();
        expect(taskList.length).toBe(3);
    });
});
