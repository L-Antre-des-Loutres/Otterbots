import {displayLogo} from "./utils/displayLogo";
import dotenv from 'dotenv';
import {getClient} from "../app/config/client";

// On active les variables d'environnement'
dotenv.config()

export class Otterbots {
    public static start() {
        displayLogo();

        const client =  getClient();

        client.login(process.env.BOT_TOKEN)

        client.on('clientReady', () => {
            const now = new Date()
            console.log(`Bot is ready at ${now.toLocaleString()} for tag ${client.user?.tag}!`)
        })
    }
}
