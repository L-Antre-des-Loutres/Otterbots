import {Client} from "discord.js";
import {authorizedDomains} from "../../../app/config/otterguardConfig";
import {otterguard_Embed} from "./embed";

/**
 * Monitors and handles messages in a Discord server to enforce restrictions on URLs and links. It performs checks to delete messages
 * containing unauthorized or unwanted links, such as `http://` links, Discord invitations, or URLs from unapproved domains.
 * Informative messages are sent to the user if their message is removed.
 *
 * @param {Client} client - The Discord.js client instance used to interact with the Discord API and listen for message events.
 * @return {Promise<void>} Resolves when the function completes its asynchronous operations for processing messages.
 */
export async function otterguard_protectLink(client: Client) {
    client.on('messageCreate', async (message) => {

        let messageContent, titleContent

        // Check that the message is not from a bot
        if (message.author.bot) return;

        // Check if the message contains a link
        if (!message.content.includes('http://') && !message.content.includes('https://')) return;

        // Check if the link is http://
        if (message.content.includes('http://')) {
            await message.delete();

            if (process.env.BOT_LANGUAGE.toLowerCase() == "fr") {
                titleContent= `Lien HTTP non autorisé.`
                messageContent = `Les liens http:// ne sont pas autorisés sur le serveur ${process.env.DISCORD_NAME}.`
            } else {
                titleContent= `HTTP link not authorized.`
                messageContent = `HTTP links are not allowed on the server ${process.env.DISCORD_NAME}.`
            }

            // Send the message to the user
            await message.author.send({
                embeds: [otterguard_Embed(titleContent, messageContent)]
            });

            return
        }

        // Check if the link is a discord invite
        if (message.content.includes('discord.gg/')) {
            await message.delete();

            if (process.env.BOT_LANGUAGE.toLowerCase() == "fr") {
                titleContent = `Envoi d'invitation Discord interdite.`
                messageContent = `L'envoi d'invitation vers d'autres serveurs Discord est interdit sur le serveur ${process.env.DISCORD_NAME}. Merci de contacter un administrateur pour plus d'informations.`
            } else {
                titleContent = `Discord invite sending prohibited.`
                messageContent = `Sending invitations to other Discord servers is prohibited on the server ${process.env.DISCORD_NAME}. Please contact an administrator for more information.`
            }

            // Send the message to the user
            await message.author.send({
                embeds: [otterguard_Embed(titleContent, messageContent)]
            });

            return
        }

        // Check if the link has an authorized domain
        if (message.content.includes('https://')) {
            const link = message.content.split(' ')[0];
            const domainFound = authorizedDomains.some(domain => link.includes(domain));
            if (!domainFound) {
                await message.delete();

                // Send a message to the user with the link and the reason for the deletion
                if (process.env.BOT_LANGUAGE.toLowerCase() == "fr") {
                    titleContent = `Ce site n'est pas autorisé.`
                    messageContent = `L'url ${link} n'est pas autorisé sur le serveur ${process.env.DISCORD_NAME}, si cela est une erreur merci de contacter un administrateur.`
                } else {
                    titleContent = `This site is not authorized.`
                    messageContent = `The url ${link} is not authorized on the server ${process.env.DISCORD_NAME}, if this is an error please contact an administrator.`
                }

                // Send the message to the user
                await message.author.send({
                    embeds: [otterguard_Embed(titleContent, messageContent)]
                });

                return
            }
        }
    })
}