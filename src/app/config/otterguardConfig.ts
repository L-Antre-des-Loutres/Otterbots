/**
 * Represents the configuration settings for the Otterguard system.
 * This configuration determines specific protective behaviors.
 *
 * @type {Object<boolean>}
 * @property {boolean} protectLink - Indicates whether link protection is enabled or disabled.
 */
export const otterguardConfig: { [key: string]: boolean } = {
    protectLink: true
};

/**
 * List of authorized domains for link protection.
 */
export const authorizedDomains = [
    "https://discord.com",
    "https://discord.gg",
    "https://youtube.com",
    "https://www.youtube.com",
    "https://www.twitch.tv",
    "https://twitch.tv",
    "https://pokekalos.fr",
    "https://www.pokekalos.fr",
];