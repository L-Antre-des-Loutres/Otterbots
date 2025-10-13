import {displayLogo} from "./utils/displayLogo";
import dotenv from 'dotenv';
import {getClient} from "../app/config/client";
import {Client} from "discord.js";
import {otterlogs} from "./utils/otterlogs";
import {loadCommands} from "./handlers/commandHandler";

// On active les variables d'environnement'
dotenv.config()

otterlogs.important(`🔑 .env loaded?" ${process.env.BOT_TOKEN ? "Yes" : "No"}`);

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
        this.clientReady(this.client)

        // Start handlers
        this.startHandlers(this.client)
    }

    // Event de démarrage du bot
    private clientReady(client: Client) {
        client.on('clientReady', () => {
            const now = new Date()
            otterlogs.success(`Bot is ready at ${now.toLocaleString()} for ${client.user?.tag}!`)
        })
    }

    // Command handlers
    private async startHandlers(client: Client) {
        await loadCommands(client)
    }
}
