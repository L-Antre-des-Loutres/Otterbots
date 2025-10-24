import {otterlogs} from "../otterlogs";
import {Client} from "discord.js";
import {otterguard_protectLink} from "./protectLink";
import {otterguardConfig} from "../../../app/config/otterguardConfig";

/**
 * Initializes and configures the Otterguard protection mechanisms for the client.
 *
 * @param {Client} client - The client instance that Otterguard is managing.
 * @return {Promise<void>} A promise that resolves once Otterguard has been successfully initialized and, if enabled, link protection has been configured.
 */
export async function otterbots_otterguard(client: Client): Promise<void> {
    otterlogs.success("Otterguard is working!")
    if (otterguardConfig.protectLink) {
        await otterguard_protectLink(client)
        otterlogs.debug("Link protection is enabled!")
    }

}