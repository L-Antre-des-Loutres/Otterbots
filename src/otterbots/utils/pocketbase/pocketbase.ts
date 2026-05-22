import PocketBase from 'pocketbase';
import fs from 'fs';
import yaml from 'js-yaml';
import { PocketBaseAlias, PocketBaseConfig } from './modules/PocketBaseTypes';
import { otterlogs } from '../otterlogs';

export class OtterPocketBase {
    private static pb: PocketBase;
    private static config: PocketBaseConfig;
    private static readonly configPath = 'endpoint_alias.yaml';
    private static initPromise: Promise<void> | null = null;

    /**
     * Initialise l'instance PocketBase et charge la configuration YAML.
     * Cette méthode est désormais privée car appelée automatiquement.
     */
    private static async init(): Promise<void> {
        try {
            if (!fs.existsSync(OtterPocketBase.configPath)) {
                otterlogs.error(`OtterPocketBase: Fichier de configuration introuvable : ${OtterPocketBase.configPath}`);
                return;
            }

            const fileContents = fs.readFileSync(OtterPocketBase.configPath, 'utf8');
            OtterPocketBase.config = yaml.load(fileContents) as PocketBaseConfig;

            const url = process.env.PB_URL;
            const email = process.env.PB_EMAIL;
            const password = process.env.PB_PASSWORD;

            if (!url) {
                otterlogs.error("OtterPocketBase: URL PocketBase (PB_URL) manquante dans le .env.");
                return;
            }

            OtterPocketBase.pb = new PocketBase(url);

            if (email && password) {
                try {
                    // Authentification exclusive via la collection '_superusers' (PocketBase v0.23+)
                    await OtterPocketBase.pb.collection('_superusers').authWithPassword(email, password);
                    otterlogs.debug("OtterPocketBase: Initialisé avec succès via _superusers !");
                } catch (error) {
                    otterlogs.error(`OtterPocketBase: Échec de l'authentification (_superusers) : ${error}`);
                }
            } else {
                otterlogs.debug("OtterPocketBase: Initialisé en mode invité.");
            }
        } catch (error) {
            otterlogs.error(`OtterPocketBase: Erreur lors de l'initialisation : ${error}`);
        }
    }

    /**
     * S'assure que l'instance est initialisée avant toute opération.
     */
    private static async ensureInitialized(): Promise<void> {
        if (OtterPocketBase.pb) return;

        if (!OtterPocketBase.initPromise) {
            OtterPocketBase.initPromise = OtterPocketBase.init();
        }

        return OtterPocketBase.initPromise;
    }

    /**
     * Récupère la configuration d'un alias.
     */
    private static getAliasConfig(alias: string): PocketBaseAlias | undefined {
        return OtterPocketBase.config?.aliases.find(a => a.alias === alias);
    }

    /**
     * Exécute une action PocketBase via un alias.
     * 
     * @param alias L'alias défini dans le fichier YAML.
     * @param params Paramètres additionnels (ID pour getOne, data pour create/update, options pour getList).
     */
    public static async execByAlias<T>(alias: string, ...params: unknown[]): Promise<T | undefined> {
        await OtterPocketBase.ensureInitialized();

        const aliasConfig = OtterPocketBase.getAliasConfig(alias);

        if (!aliasConfig) {
            otterlogs.error(`OtterPocketBase: Alias "${alias}" non trouvé.`);
            return undefined;
        }

        if (!OtterPocketBase.pb) {
            otterlogs.error("OtterPocketBase: L'instance n'a pas pu être initialisée.");
            return undefined;
        }

        try {
            const collection = OtterPocketBase.pb.collection(aliasConfig.collection);
            let result: unknown;

            switch (aliasConfig.action) {
                case 'getList':
                    result = await collection.getList(params[0] as number || 1, params[1] as number || 30, (params[2] || aliasConfig.options) as Record<string, unknown>);
                    break;
                case 'getOne':
                    result = await collection.getOne(params[0] as string, (params[1] || aliasConfig.options) as Record<string, unknown>);
                    break;
                case 'getFullList':
                    result = await collection.getFullList((params[0] || aliasConfig.options) as Record<string, unknown>);
                    break;
                case 'getFirstListItem':
                    result = await collection.getFirstListItem(params[0] as string, (params[1] || aliasConfig.options) as Record<string, unknown>);
                    break;
                case 'create':
                    result = await collection.create(params[0] as Record<string, unknown>, (params[1] || aliasConfig.options) as Record<string, unknown>);
                    break;
                case 'update':
                    result = await collection.update(params[0] as string, params[1] as Record<string, unknown>, (params[2] || aliasConfig.options) as Record<string, unknown>);
                    break;
                case 'delete':
                    result = await collection.delete(params[0] as string, (params[1] || aliasConfig.options) as Record<string, unknown>);
                    break;
                default:
                    otterlogs.error(`OtterPocketBase: Action "${aliasConfig.action}" non supportée.`);
                    return undefined;
            }

            return result as T;
        } catch (error) {
            otterlogs.error(`OtterPocketBase: Erreur lors de l'exécution de l'alias "${alias}" : ${error}`);
            return undefined;
        }
    }

    /**
     * Accès direct à l'instance PocketBase pour des besoins complexes.
     * Initialise automatiquement la connexion si nécessaire.
     */
    public static async getClient(): Promise<PocketBase> {
        await OtterPocketBase.ensureInitialized();
        return OtterPocketBase.pb;
    }
}
