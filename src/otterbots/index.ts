import {displayLogo} from "./utils/displayLogo";
import dotenv from 'dotenv';
import {getClient} from "../app/config/client";
import {Client} from "discord.js";
import {loadCommands} from "./handlers/commandHandler";
import {createSalon} from "./utils/salon";
import {otterBots_commandInteraction} from "./event/commandInteraction";
import {otterBots_clientReady} from "./event/clientReady";

// On active les variables d'environnement'
dotenv.config()

/**
 * La classe `Otterbots` est responsable de l'initialisation et de la gestion d'un client bot,
 * de la gestion des événements tels que l'état prêt et les commandes d'interaction, et du chargement
 * des gestionnaires de commandes pour le bot.
 */
export class Otterbots {

    private readonly client: Client;

    constructor(client?: Client) {
        this.client = client ?? getClient();
    }

    // Lancement du bot
    public start() {
        displayLogo(process.env.BOT_NAME);

        this.client.login(process.env.BOT_TOKEN)

        // Évènement du bot
        this.clientReady()
        this.interactionCreate()

        // Start handlers
        this.commandHandler()

        // Start salons
        this.initSalons()

    }

    // Event de démarrage du bot
    private async clientReady(client: Client = this.client): Promise<void> {
        await otterBots_clientReady(client)
    }

    // Event de gestion des commandes
    private async interactionCreate(client: Client = this.client): Promise<void> {
        await otterBots_commandInteraction(client)
    }

    // Command handlers
    private async commandHandler(client: Client = this.client): Promise<void> {
        await loadCommands(client)
    }

    // Initialisation des salons
    private async initSalons(client: Client = this.client): Promise<void> {
      await createSalon(client)
    }


}
