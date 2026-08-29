import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {OtterTask, TaskStatus} from "@/utils/ottertask/OtterTask";
import {OtterTaskManager} from "@/utils/ottertask/OtterTaskManager";
import {otterlogs} from "@/utils/otterlogs";

vi.mock('@/utils/otterlogs', () => ({
    otterlogs: {
        log: vi.fn(),
        info: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn()
    }
}));

describe('Classe OtterTaskManager', () => {

    let manager: OtterTaskManager;

    beforeEach(() => {
        manager = new OtterTaskManager();
        vi.clearAllMocks();
    });

    afterEach(() => {
        manager.clearAllTasks();
    });

    describe('Construction et initialisation', () => {

        it('Initialisation du manager vide', () => {
            expect(manager.getTaskCount()).toBe(0);
            expect(manager.listTaskNames()).toEqual([]);
            expect(manager.getAllTasks()).toEqual([]);
        });
    });

    describe('Gestion des tâches', () => {

        it('Ajout d\'une tâche', () => {
            const task = new OtterTask('Test', 'Description', false, false, '', () => {});
            
            manager.addTask(task);

            expect(manager.getTaskCount()).toBe(1);
            expect(manager.hasTask('Test')).toBe(true);
            expect(manager.getTask('Test')).toBe(task);
            expect(otterlogs.log).toHaveBeenCalledWith('Task Test added to manager');
        });

        it('Ajout de plusieurs tâches', () => {
            const task1 = new OtterTask('Task1', 'Description 1', false, false, '', () => {});
            const task2 = new OtterTask('Task2', 'Description 2', true, true, '', () => {});
            const task3 = new OtterTask('Task3', 'Description 3', false, false, '* * * * *', () => {});

            manager.addTask(task1);
            manager.addTask(task2);
            manager.addTask(task3);

            expect(manager.getTaskCount()).toBe(3);
            expect(manager.listTaskNames()).toEqual(['Task1', 'Task2', 'Task3']);
        });

        it('Erreur lors de l\'ajout d\'une tâche null', () => {
            expect(() => {
                manager.addTask(null as any);
            }).toThrow('Cannot add null task');
        });

        it('Remplacement d\'une tâche existante', () => {
            const task1 = new OtterTask('Test', 'Description 1', false, false, '', () => {});
            const task2 = new OtterTask('Test', 'Description 2', true, true, '', () => {});

            manager.addTask(task1);
            manager.addTask(task2);

            expect(manager.getTaskCount()).toBe(1);
            expect(manager.getTask('Test')?.getDescription()).toBe('Description 2');
            expect(otterlogs.warn).toHaveBeenCalledWith('Task Test already exists. Replacing...');
        });

        it('Suppression d\'une tâche', () => {
            const task = new OtterTask('Test', 'Description', false, false, '', () => {});
            manager.addTask(task);

            const removed = manager.removeTask('Test');

            expect(removed).toBe(true);
            expect(manager.getTaskCount()).toBe(0);
            expect(manager.hasTask('Test')).toBe(false);
            expect(otterlogs.log).toHaveBeenCalledWith('Task Test removed from manager');
        });

        it('Suppression d\'une tâche inexistante', () => {
            const removed = manager.removeTask('NonExistent');

            expect(removed).toBe(false);
            expect(manager.getTaskCount()).toBe(0);
        });

        it('Récupération d\'une tâche par nom', () => {
            const task = new OtterTask('Test', 'Description', false, false, '', () => {});
            manager.addTask(task);

            const retrieved = manager.getTask('Test');

            expect(retrieved).toBe(task);
            expect(retrieved?.getName()).toBe('Test');
        });

        it('Récupération d\'une tâche inexistante retourne undefined', () => {
            const retrieved = manager.getTask('NonExistent');
            expect(retrieved).toBeUndefined();
        });

        it('Vérification de l\'existence d\'une tâche', () => {
            const task = new OtterTask('Test', 'Description', false, false, '', () => {});
            
            expect(manager.hasTask('Test')).toBe(false);
            
            manager.addTask(task);
            
            expect(manager.hasTask('Test')).toBe(true);
        });

        it('Nettoyage de toutes les tâches', () => {
            manager.addTask(new OtterTask('Task1', 'Desc1', false, false, '', () => {}));
            manager.addTask(new OtterTask('Task2', 'Desc2', false, false, '', () => {}));
            manager.addTask(new OtterTask('Task3', 'Desc3', false, false, '', () => {}));

            expect(manager.getTaskCount()).toBe(3);

            manager.clearAllTasks();

            expect(manager.getTaskCount()).toBe(0);
            expect(manager.listTaskNames()).toEqual([]);
            expect(otterlogs.log).toHaveBeenCalledWith('All tasks cleared from manager');
        });
    });

    describe('Filtrage des tâches', () => {

        it('Récupération des tâches onStart', () => {
            manager.addTask(new OtterTask('Task1', 'Desc1', false, true, '', () => {}));
            manager.addTask(new OtterTask('Task2', 'Desc2', false, false, '', () => {}));
            manager.addTask(new OtterTask('Task3', 'Desc3', false, true, '', () => {}));

            const onStartTasks = manager.getTasksOnStart();

            expect(onStartTasks.length).toBe(2);
            expect(onStartTasks.map(t => t.getName())).toEqual(['Task1', 'Task3']);
        });

        it('Récupération des tâches schedulées (cron)', () => {
            manager.addTask(new OtterTask('Task1', 'Desc1', false, false, '* * * * *', () => {}));
            manager.addTask(new OtterTask('Task2', 'Desc2', false, false, '', () => {}));
            manager.addTask(new OtterTask('Task3', 'Desc3', false, false, '0 0 * * *', () => {}));

            const scheduledTasks = manager.getScheduledTasks();

            expect(scheduledTasks.length).toBe(2);
            expect(scheduledTasks.map(t => t.getName())).toEqual(['Task1', 'Task3']);
        });

        it('Récupération de toutes les tâches', () => {
            manager.addTask(new OtterTask('Task1', 'Desc1', false, true, '', () => {}));
            manager.addTask(new OtterTask('Task2', 'Desc2', false, false, '* * * * *', () => {}));

            const allTasks = manager.getAllTasks();

            expect(allTasks.length).toBe(2);
        });
    });

    describe('Exécution des tâches au démarrage', () => {

        it('Exécution réussie de tâches onStart', async () => {
            const mockFn1 = vi.fn();
            const mockFn2 = vi.fn();
            
            manager.addTask(new OtterTask('Task1', 'Desc1', false, true, '', mockFn1));
            manager.addTask(new OtterTask('Task2', 'Desc2', false, true, '', mockFn2));
            manager.addTask(new OtterTask('Task3', 'Desc3', false, false, '', () => {}));

            const results = await manager.initTasksOnStart();

            expect(results.length).toBe(2);
            expect(mockFn1).toHaveBeenCalledTimes(1);
            expect(mockFn2).toHaveBeenCalledTimes(1);
            expect(results.every(r => r.success)).toBe(true);
            expect(otterlogs.success).toHaveBeenCalledWith(expect.stringContaining('2/2 startup task(s) executed successfully'));
        });

        it('Gestion des erreurs lors de l\'exécution au démarrage', async () => {
            const mockSuccess = vi.fn();
            const mockFail = vi.fn(() => {
                throw new Error('Task failed');
            });

            manager.addTask(new OtterTask('SuccessTask', 'Desc1', false, true, '', mockSuccess));
            manager.addTask(new OtterTask('FailTask', 'Desc2', false, true, '', mockFail));

            const results = await manager.initTasksOnStart();

            expect(results.length).toBe(2);
            expect(results.filter(r => r.success).length).toBe(1);
            expect(results.filter(r => !r.success).length).toBe(1);
            expect(results.find(r => !r.success)?.error?.message).toBe('Task failed');
            expect(otterlogs.error).toHaveBeenCalledWith(expect.stringContaining('FailTask'));
            expect(otterlogs.error).toHaveBeenCalledWith(expect.stringContaining('1 task(s) failed to execute on start'));
        });

        it('Aucune tâche onStart à exécuter', async () => {
            manager.addTask(new OtterTask('Task1', 'Desc1', false, false, '', () => {}));

            const results = await manager.initTasksOnStart();

            expect(results.length).toBe(0);
            expect(otterlogs.log).toHaveBeenCalledWith('No startup tasks to execute');
        });

        it('Ignorer les tâches désactivées au démarrage', async () => {
            const mockFn1 = vi.fn();
            const mockFn2 = vi.fn();

            const task1 = new OtterTask('Task1', 'Desc1', false, true, '', mockFn1);
            const task2 = new OtterTask('Task2', 'Desc2', false, true, '', mockFn2);
            task2.setEnabled(false);

            manager.addTask(task1);
            manager.addTask(task2);

            const results = await manager.initTasksOnStart();

            expect(results.length).toBe(1);
            expect(mockFn1).toHaveBeenCalledTimes(1);
            expect(mockFn2).not.toHaveBeenCalled();
        });

        it('Support des tâches asynchrones au démarrage', async () => {
            const mockAsync = vi.fn(async () => {
                await new Promise(resolve => setTimeout(resolve, 50));
            });

            manager.addTask(new OtterTask('AsyncTask', 'Desc', false, true, '', mockAsync));

            const results = await manager.initTasksOnStart();

            expect(results.length).toBe(1);
            expect(results[0].success).toBe(true);
            expect(results[0].duration).toBeGreaterThanOrEqual(50);
            expect(mockAsync).toHaveBeenCalledTimes(1);
        });
    });

    describe('Initialisation des tâches cron', () => {

        it('Initialisation réussie de tâches avec cron valide', () => {
            manager.addTask(new OtterTask('CronTask1', 'Desc1', false, false, '* * * * *', () => {}));
            manager.addTask(new OtterTask('CronTask2', 'Desc2', false, false, '0 0 * * *', () => {}));

            manager.initTasksOnCron();

            expect(otterlogs.success).toHaveBeenCalledWith('2/2 task(s) initialized on cron');
        });

        it('Erreur avec expression cron invalide', () => {
            manager.addTask(new OtterTask('InvalidCron', 'Desc', false, false, 'invalid cron', () => {}));

            manager.initTasksOnCron();

            expect(otterlogs.error).toHaveBeenCalledWith(expect.stringContaining('Invalid cron expression for task InvalidCron'));
            expect(otterlogs.error).toHaveBeenCalledWith(expect.stringContaining('1 task(s) failed to initialize'));
        });

        it('Ignorer les tâches sans expression cron', () => {
            manager.addTask(new OtterTask('NoCron1', 'Desc1', false, false, '', () => {}));
            manager.addTask(new OtterTask('NoCron2', 'Desc2', false, false, '   ', () => {}));

            manager.initTasksOnCron();

            expect(otterlogs.log).toHaveBeenCalledWith('No cron tasks to schedule');
        });

        it('Mix de tâches valides et invalides', () => {
            manager.addTask(new OtterTask('ValidCron', 'Desc1', false, false, '* * * * *', () => {}));
            manager.addTask(new OtterTask('InvalidCron', 'Desc2', false, false, 'bad cron', () => {}));

            manager.initTasksOnCron();

            expect(otterlogs.success).toHaveBeenCalledWith('1/2 task(s) initialized on cron');
        });
    });

    describe('Exécution manuelle de tâches', () => {

        it('Exécution manuelle réussie', async () => {
            const mockFn = vi.fn();
            manager.addTask(new OtterTask('ManualTask', 'Desc', false, false, '', mockFn));

            const result = await manager.executeTask('ManualTask');

            expect(result.success).toBe(true);
            expect(result.taskName).toBe('ManualTask');
            expect(mockFn).toHaveBeenCalledTimes(1);
            expect(otterlogs.success).toHaveBeenCalledWith(expect.stringContaining('Manual execution of task ManualTask completed'));
        });

        it('Erreur lors de l\'exécution manuelle', async () => {
            const mockFn = vi.fn(() => {
                throw new Error('Manual execution failed');
            });
            manager.addTask(new OtterTask('ManualTask', 'Desc', false, false, '', mockFn));

            const result = await manager.executeTask('ManualTask');

            expect(result.success).toBe(false);
            expect(result.error?.message).toBe('Manual execution failed');
            expect(otterlogs.error).toHaveBeenCalledWith(expect.stringContaining('Manual execution of task ManualTask failed'));
        });

        it('Erreur si tâche inexistante', async () => {
            await expect(manager.executeTask('NonExistent')).rejects.toThrow('Task NonExistent not found');
        });
    });

    describe('Activation/Désactivation de tâches', () => {

        it('Activation d\'une tâche', () => {
            const task = new OtterTask('Test', 'Desc', false, false, '', () => {});
            task.setEnabled(false);
            manager.addTask(task);

            const result = manager.enableTask('Test');

            expect(result).toBe(true);
            expect(task.isEnabled()).toBe(true);
            expect(otterlogs.log).toHaveBeenCalledWith('Task Test enabled');
        });

        it('Désactivation d\'une tâche', () => {
            const task = new OtterTask('Test', 'Desc', false, false, '', () => {});
            manager.addTask(task);

            const result = manager.disableTask('Test');

            expect(result).toBe(true);
            expect(task.isEnabled()).toBe(false);
            expect(otterlogs.log).toHaveBeenCalledWith('Task Test disabled');
        });

        it('Activation/Désactivation d\'une tâche inexistante', () => {
            expect(manager.enableTask('NonExistent')).toBe(false);
            expect(manager.disableTask('NonExistent')).toBe(false);
        });
    });

    describe('Statistiques de tâches', () => {

        it('Récupération des statistiques d\'une tâche', async () => {
            const mockFn = vi.fn();
            const task = new OtterTask('Test', 'Desc', false, false, '', mockFn);
            manager.addTask(task);

            await manager.executeTask('Test');
            await manager.executeTask('Test');

            const stats = manager.getTaskStats('Test');

            expect(stats).toBeDefined();
            expect(stats?.executions).toBe(2);
            expect(stats?.failures).toBe(0);
            expect(stats?.status).toBe(TaskStatus.COMPLETED);
            expect(stats?.enabled).toBe(true);
            expect(stats?.lastExecutionTime).toBeGreaterThanOrEqual(0);
        });

        it('Statistiques incluent les échecs', async () => {
            let shouldFail = true;
            const mockFn = vi.fn(() => {
                if (shouldFail) throw new Error('Failed');
            });
            const task = new OtterTask('Test', 'Desc', false, false, '', mockFn);
            manager.addTask(task);

            const failResult = await manager.executeTask('Test');
            expect(failResult.success).toBe(false);
            
            shouldFail = false;
            await manager.executeTask('Test');

            const stats = manager.getTaskStats('Test');

            expect(stats?.executions).toBe(1);
            expect(stats?.failures).toBe(1);
        });

        it('Statistiques pour tâche inexistante', () => {
            const stats = manager.getTaskStats('NonExistent');
            expect(stats).toBeUndefined();
        });
    });

    describe('Utilitaires', () => {

        it('Liste de noms de tâches', () => {
            manager.addTask(new OtterTask('Task1', 'Desc1', false, false, '', () => {}));
            manager.addTask(new OtterTask('Task2', 'Desc2', false, false, '', () => {}));
            manager.addTask(new OtterTask('Task3', 'Desc3', false, false, '', () => {}));

            const names = manager.listTaskNames();

            expect(names).toEqual(['Task1', 'Task2', 'Task3']);
        });

        it('Compte de tâches', () => {
            expect(manager.getTaskCount()).toBe(0);

            manager.addTask(new OtterTask('Task1', 'Desc1', false, false, '', () => {}));
            expect(manager.getTaskCount()).toBe(1);

            manager.addTask(new OtterTask('Task2', 'Desc2', false, false, '', () => {}));
            expect(manager.getTaskCount()).toBe(2);

            manager.removeTask('Task1');
            expect(manager.getTaskCount()).toBe(1);
        });
    });
});
