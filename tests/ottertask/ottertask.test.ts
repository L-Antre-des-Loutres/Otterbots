import {OtterTask} from "@/otterbots/utils/ottertask/ottertask";


describe('Classe OtterTask', () => {

    it('devrait s\'initialiser correctement avec le constructeur', () => {
        // 1. Arrange & Act : On crée une nouvelle instance
        const task = new OtterTask('Backup', 'Sauvegarde de la BDD', true, '0 0 * * *');

        // 2. Assert : On vérifie que les getters retournent bien les valeurs du constructeur
        expect(task.getName()).toBe('Backup');
        expect(task.getDescription()).toBe('Sauvegarde de la BDD');
        expect(task.getStatus()).toBe(true);
        expect(task.getCronExpression()).toBe('0 0 * * *');
    });

    it('devrait mettre à jour les propriétés via les setters', () => {
        // 1. Arrange : On crée une tâche avec des valeurs de base
        const task = new OtterTask('Initiale', 'Description de base', false, '* * * * *');

        // 2. Act : On utilise les setters pour tout modifier
        task.setName('Nettoyage');
        task.setDescription('Nettoie les vieux logs');
        task.setStatus(true);
        task.setCronExpression('*/5 * * * *');

        // 3. Assert : On vérifie que les nouvelles valeurs ont bien été prises en compte
        expect(task.getName()).toBe('Nettoyage');
        expect(task.getDescription()).toBe('Nettoie les vieux logs');
        expect(task.getStatus()).toBe(true);
        expect(task.getCronExpression()).toBe('*/5 * * * *');
    });

});
