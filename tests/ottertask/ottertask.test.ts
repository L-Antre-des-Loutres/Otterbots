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
});
