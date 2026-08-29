import {Client} from "discord.js";
import {otterguard_protectLink} from "../utils/otterguard/modules/protectLink";
import {otterguard_protectScam} from "../utils/otterguard/modules/protectScam";
import {otterguard_protectSpam} from "../utils/otterguard/modules/protectSpam";
import {OtterbotsConfig} from "../types/config";

export async function otterguard_onMessageUpdate(client: Client, config?: OtterbotsConfig["otterguard"]) {
    client.on('messageUpdate', async (_oldMessage, newMessage) => {
        // Check if the message is from a bot
        if (newMessage.author.bot) return;

        // Start protections
        await otterguard_protectLink(client, newMessage, config)
        await otterguard_protectScam(client, newMessage, config)
        await otterguard_protectSpam(client, newMessage, config)

    })
}
