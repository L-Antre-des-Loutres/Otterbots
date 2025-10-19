import {Message} from "discord.js";

/**
 * Emoji reaction config list.
 * Defines message conditions and their corresponding emojis.
 * @type {Array<{condition: (msg: Message) => boolean, emoji: string}>}
 */
export const otterbots_reactions = [
    { condition: (msg: Message) => msg.content.includes("otter"), emoji: "🦦" },
    { condition: (msg: Message) => msg.content.includes("bonjour"), emoji: "👋" },
];