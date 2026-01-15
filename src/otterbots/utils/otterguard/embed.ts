import { EmbedBuilder } from "discord.js";

/**
 * Creates and returns an instance of EmbedBuilder with a standardized format for OtterGuard.
 *
 * @param {string} title - The title of the embed.
 * @param {string} reason - The reason or context for the embed.
 * @param {string} [messageContent] - Optional additional message content, which will be truncated to 1024 characters if provided.
 * @return {EmbedBuilder} An EmbedBuilder instance with the specified details and a preset OtterGuard style.
 */
export function otterguard_Embed(title: string, reason: string, messageContent?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setColor(0xED4245) // Harmonized with Moderation Red
        .setAuthor({ name: '🛡️ OtterGuard Protection' }) // Harmonized Author style
        .setTitle(title)
        .setDescription(`**Reason:**\n${reason}`) // Added structured Reason prefix
        .setTimestamp()
        .setFooter({ text: 'Otterguard - Security System' }); // Harmonized Footer

    if (messageContent) {
        embed.addFields({ name: '📝 Context / Content', value: messageContent.substring(0, 1024) });
    }

    return embed;
}

/**
 * Creates and returns a formatted EmbedBuilder instance for moderation purposes.
 *
 * @param {string} title - The title to be displayed in the embed.
 * @param {string} reason - The main content or description to appear in the embed.
 * @param {string} messageContent - (Optional) Additional context or message content.
 * @return {EmbedBuilder} A configured EmbedBuilder instance with the specified title, description, timestamp, and footer.
 */
export function otterguard_EmbedModeration(title: string, reason: string, messageContent?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setColor(0xED4245) // Discord Red
        .setAuthor({ name: '🛡️ OtterGuard Moderation' })
        .setTitle(title)
        .setDescription(`**Reason:**\n${reason}`)
        .setTimestamp()
        .setFooter({ text: 'Otterguard - Moderation Team' });

    if (messageContent) {
        embed.addFields({ name: '📝 Context / Content', value: messageContent.substring(0, 1024) });
    }

    return embed;
}
