import {displayLogo} from "./utils/displayLogo";
import dotenv from 'dotenv';
import {getClient} from "../app/config/client";
import {Client} from "discord.js";
import {otterBots_loadCommands} from "./handlers/commandHandler";
import {otterBots_initSalon} from "./utils/salon";
import {otterBots_commandInteraction} from "./event/commandInteraction";
import {otterBots_clientReady} from "./event/clientReady";
import {otterBots_setActivity} from "./utils/activity";

dotenv.config()

/**
 * The `Otterbots` class is responsible for initializing and managing a bot client,
 * handling events such as ready state and interaction commands, and loading
 * command handlers for the bot.
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
    
    // Mettre une activité en cours
    public setActivity(activityType: string = "playing", activity: string) {
        otterBots_setActivity(activityType, activity, this.client)
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
        await otterBots_loadCommands(client)
    }

    // Initialisation des salons
    private async initSalons(client: Client = this.client): Promise<void> {
      await otterBots_initSalon(client)
    }


}
