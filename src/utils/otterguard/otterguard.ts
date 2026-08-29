import {otterlogs} from "../otterlogs";
import {Client} from "discord.js";
import {otterguard_messageCreate} from "../../events/messageCreate";
import {otterguard_onMessageUpdate} from "../../events/onMessageUpdate";
import {OtterbotsConfig} from "../../types/config";

/**
 * Initializes the Otterguard protection system for the provided client.
 * This function sets up message monitoring and logs the activation status.
 *
 * @param {Client} client - The client instance on which the Otterguard protection system will be initialized.
 * @param {OtterbotsConfig["otterguard"]} config - The Otterguard configuration.
 * @return {void} This method does not return any value.
 */
export function otterbots_otterguard(client: Client, config?: OtterbotsConfig["otterguard"]): void {
    otterlogs.success("Otterguard is working!")
    otterguard_messageCreate(client, config).then(() => otterlogs.debug("Otterguard protection : messageCreate is enabled!"))
    otterguard_onMessageUpdate(client, config).then(() => otterlogs.debug("Otterguard protection : messageUpdate is enabled!"))

}

