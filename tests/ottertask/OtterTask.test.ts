import {describe, it, expect, vi} from 'vitest';
import {OtterTask, TaskStatus} from "@/otterbots/utils/ottertask/OtterTask";

describe('Classe OtterTask', () => {

    describe('Construction et validation', () => {

        it('Initialisation classe avec paramètres valides', () => {
            const taskFn = vi.fn();
            const task = new OtterTask('Backup', 'Sauvegarde de la BDD', true, false, '0 0 * * *', taskFn);
            
            expect(task.getName()).toBe('Backup');
            expect(task.getDescription()).toBe('Sauvegarde de la BDD');
            expect(task.getImportant()).toBe(true);
            expect(task.getOnStart()).toBe(false);
            expect(task.getCronExpression()).toBe('0 0 * * *');
            expect(task.getTaskFunction()).toBe(taskFn);
            expect(task.getStatus()).toBe(TaskStatus.IDLE);
            expect(task.isEnabled()).toBe(true);
        });

        it('Trim du nom lors de la construction', () => {
            const task = new OtterTask('  Backup  ', 'Description', false, false, '', () => {});
            expect(task.getName()).toBe('Backup');
        });

        it('Erreur si nom de tâche vide', () => {
            expect(() => {
                new OtterTask('', 'Description', false, false, '', () => {});
            }).toThrow('Task name cannot be empty');
        });

        it('Erreur si nom de tâche ne contient que des espaces', () => {
            expect(() => {
                new OtterTask('   ', 'Description', false, false, '', () => {});
            }).toThrow('Task name cannot be empty');
        });

        it('Erreur si fonction de tâche est null', () => {
            expect(() => {
                new OtterTask('Test', 'Description', false, false, '', null as any);
            }).toThrow('Task function is required');
        });

        it('Description vide par défaut si non fournie', () => {
            const task = new OtterTask('Test', '', false, false, '', () => {});
            expect(task.getDescription()).toBe('');
        });
    });

    describe('Setters & Getters', () => {

        it('Modification des propriétés avec setters', () => {
            const initialFn = vi.fn();
            const newFn = vi.fn();
            const task = new OtterTask('Initiale', 'Description de base', false, false, '* * * * *', initialFn);

            task.setDescription('Nettoie les vieux logs');
            task.setImportant(true);
            task.setCronExpression('*/5 * * * *');
            task.setOnStart(true);
            task.setTaskFunction(newFn);
            task.setEnabled(false);

            expect(task.getName()).toBe('Initiale');
            expect(task.getDescription()).toBe('Nettoie les vieux logs');
            expect(task.getImportant()).toBe(true);
            expect(task.getOnStart()).toBe(true);
            expect(task.getCronExpression()).toBe('*/5 * * * *');
            expect(task.getTaskFunction()).toBe(newFn);
            expect(task.isEnabled()).toBe(false);
        });

        it('Erreur si setTaskFunction reçoit null', () => {
            const task = new OtterTask('Test', 'Description', false, false, '', () => {});
            expect(() => {
                task.setTaskFunction(null as any);
            }).toThrow('Task function cannot be null');
        });
    });

    describe('Exécution de tâches', () => {

        it('Exécution synchrone réussie', async () => {
            const mockFn = vi.fn();
            const task = new OtterTask('Test', 'Description', false, false, '', mockFn);

            await task.execute();

            expect(mockFn).toHaveBeenCalledTimes(1);
            expect(task.getStatus()).toBe(TaskStatus.COMPLETED);
            expect(task.getExecutionCount()).toBe(1);
            expect(task.getFailureCount()).toBe(0);
            expect(task.getLastExecutionTime()).toBeGreaterThanOrEqual(0);
        });

        it('Exécution asynchrone réussie', async () => {
            const mockFn = vi.fn(async () => {
                await new Promise(resolve => setTimeout(resolve, 50));
            });
            const task = new OtterTask('Test', 'Description', false, false, '', mockFn);

            await task.execute();

            expect(mockFn).toHaveBeenCalledTimes(1);
            expect(task.getStatus()).toBe(TaskStatus.COMPLETED);
            expect(task.getExecutionCount()).toBe(1);
            expect(task.getLastExecutionTime()).toBeGreaterThanOrEqual(50);
        });

        it('Exécution échouée - erreur synchrone', async () => {
            const error = new Error('Test error');
            const mockFn = vi.fn(() => {
                throw error;
            });
            const task = new OtterTask('Test', 'Description', false, false, '', mockFn);

            await expect(task.execute()).rejects.toThrow('Test error');

            expect(task.getStatus()).toBe(TaskStatus.FAILED);
            expect(task.getExecutionCount()).toBe(0);
            expect(task.getFailureCount()).toBe(1);
        });

        it('Exécution échouée - erreur asynchrone', async () => {
            const mockFn = vi.fn(async () => {
                await new Promise((_, reject) => setTimeout(() => reject(new Error('Async error')), 10));
            });
            const task = new OtterTask('Test', 'Description', false, false, '', mockFn);

            await expect(task.execute()).rejects.toThrow('Async error');

            expect(task.getStatus()).toBe(TaskStatus.FAILED);
            expect(task.getFailureCount()).toBe(1);
        });

        it('Erreur si tâche désactivée', async () => {
            const mockFn = vi.fn();
            const task = new OtterTask('Test', 'Description', false, false, '', mockFn);
            task.setEnabled(false);

            await expect(task.execute()).rejects.toThrow('Task Test is disabled');

            expect(mockFn).not.toHaveBeenCalled();
            expect(task.getExecutionCount()).toBe(0);
        });

        it('Exécutions multiples incrémentent les compteurs', async () => {
            const mockFn = vi.fn();
            const task = new OtterTask('Test', 'Description', false, false, '', mockFn);

            await task.execute();
            await task.execute();
            await task.execute();

            expect(mockFn).toHaveBeenCalledTimes(3);
            expect(task.getExecutionCount()).toBe(3);
            expect(task.getFailureCount()).toBe(0);
        });

        it('Compte des échecs lors d\'exécutions multiples', async () => {
            let shouldFail = true;
            const mockFn = vi.fn(async () => {
                if (shouldFail) {
                    throw new Error('Failure');
                }
            });
            const task = new OtterTask('Test', 'Description', false, false, '', mockFn);

            await expect(task.execute()).rejects.toThrow();
            
            shouldFail = false;
            await task.execute();
            
            shouldFail = true;
            await expect(task.execute()).rejects.toThrow();

            expect(task.getExecutionCount()).toBe(1);
            expect(task.getFailureCount()).toBe(2);
        });
    });

    describe('Statistiques et état', () => {

        it('Valeurs initiales des statistiques', () => {
            const task = new OtterTask('Test', 'Description', false, false, '', () => {});

            expect(task.getStatus()).toBe(TaskStatus.IDLE);
            expect(task.getExecutionCount()).toBe(0);
            expect(task.getFailureCount()).toBe(0);
            expect(task.getLastExecutionTime()).toBeNull();
        });

        it('État RUNNING pendant l\'exécution', async () => {
            let statusDuringExecution: TaskStatus | null = null;
            const mockFn = vi.fn(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
                statusDuringExecution = task.getStatus();
            });
            const task = new OtterTask('Test', 'Description', false, false, '', mockFn);

            await task.execute();

            expect(statusDuringExecution).toBe(TaskStatus.RUNNING);
            expect(task.getStatus()).toBe(TaskStatus.COMPLETED);
        });

        it('Reset des statistiques', async () => {
            const mockFn = vi.fn();
            const task = new OtterTask('Test', 'Description', false, false, '', mockFn);

            await task.execute();
            await task.execute();

            expect(task.getExecutionCount()).toBe(2);
            expect(task.getLastExecutionTime()).toBeGreaterThanOrEqual(0);

            task.resetStats();

            expect(task.getStatus()).toBe(TaskStatus.IDLE);
            expect(task.getExecutionCount()).toBe(0);
            expect(task.getFailureCount()).toBe(0);
            expect(task.getLastExecutionTime()).toBeNull();
        });
    });

    describe('Activation/Désactivation', () => {

        it('Tâche activée par défaut', () => {
            const task = new OtterTask('Test', 'Description', false, false, '', () => {});
            expect(task.isEnabled()).toBe(true);
        });

        it('Désactivation empêche l\'exécution', async () => {
            const mockFn = vi.fn();
            const task = new OtterTask('Test', 'Description', false, false, '', mockFn);

            task.setEnabled(false);

            await expect(task.execute()).rejects.toThrow('Task Test is disabled');
            expect(mockFn).not.toHaveBeenCalled();
        });

        it('Réactivation permet l\'exécution', async () => {
            const mockFn = vi.fn();
            const task = new OtterTask('Test', 'Description', false, false, '', mockFn);

            task.setEnabled(false);
            task.setEnabled(true);

            await task.execute();

            expect(mockFn).toHaveBeenCalledTimes(1);
        });
    });
});
