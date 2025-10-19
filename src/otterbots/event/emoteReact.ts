import {Client} from "discord.js";
import {otterbots_reactions} from "../../app/config/emojiReact";

export async function otterBots_initEmoteReact(client: Client) {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        // Parcours de la liste des conditions
        for (const { condition, emoji } of otterbots_reactions) {
            try {
                if (condition(message)) {
                    await message.react(emoji);
                }
            } catch (err) {
                console.error(`Impossible de réagir avec ${emoji}:`, err);
            }
        }
    })
}