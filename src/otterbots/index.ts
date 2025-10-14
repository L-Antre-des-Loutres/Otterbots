import {displayLogo} from "./utils/displayLogo";
import dotenv from 'dotenv';
import {getClient} from "../app/config/client";
import {Client} from "discord.js";
import {otterlogs} from "./utils/otterlogs";
import {loadCommands} from "./handlers/commandHandler";

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
        this.clientReady(this.client)
        this.interactionCreate(this.client)

        // Start handlers
        this.commandHandler(this.client)
    }

    // Event de démarrage du bot
    private clientReady(client: Client) {
        client.on('clientReady', () => {
            const now = new Date()
            otterlogs.success(`Bot is ready at ${now.toLocaleString()} for ${client.user?.tag}!`)
        })
    }

    // Event de gestion des commandes
    private async interactionCreate(client: Client) {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;
            const command = interaction.client.slashCommands.get(interaction.commandName);
            if (!command) {
                otterlogs.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(interaction);
            } catch (error) {
                otterlogs.error(`${error}`);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: '🦦 Oups! Une loutre a fait tomber le serveur dans l\'eau! La commande n\'a pas pu être exécutée.',
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: '🦦 La loutre responsable de cette commande est partie faire la sieste! Réessayez plus tard.',
                        ephemeral: true
                    });
                }
            }
        });
    }

    // Command handlers
    private async commandHandler(client: Client) {
        await loadCommands(client)
    }
}
