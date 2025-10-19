import {Client} from "discord.js";
import {otterlogs} from "../utils/otterlogs";

export async function otterbots_purgeCommand(client: Client) {
    client.on('clientReady', async () => {
        try {
            const guilds = await client.guilds.fetch();

            for (const guild of guilds.values()) {
                const guildObj = await guild.fetch();
                const commands = await guildObj.commands.fetch();

                for (const command of commands.values()) {
                    await command.delete();
                }
            }

            const globalCommands = await client.application?.commands.fetch();
            if (globalCommands) {
                for (const command of globalCommands.values()) {
                    await command.delete();
                }
            }
        } catch (error) {
            otterlogs.error('Erreur lors de la suppression des commandes :' + error);
        }

    });
}