import {displayLogo} from "./utils/displayLogo";
import dotenv from 'dotenv';
import {getClient} from "../app/config/client";
import {Client} from "discord.js";

// On active les variables d'environnement'
dotenv.config()

export class Otterbots {

    private client: Client;

    constructor(client?: Client) {
        this.client = client ?? getClient();
    }

    public start() {
        displayLogo(process.env.BOT_NAME);

        this.client.login(process.env.BOT_TOKEN)

        // Évènement du bot
        this.clientReady(this.client)
    }

    // Event de démarrage du bot
    private clientReady(client: Client) {
        client.on('clientReady', () => {
            const now = new Date()
            console.log(`Bot is ready at ${now.toLocaleString()} for ${client.user?.tag}!`)
        })
    }
}
