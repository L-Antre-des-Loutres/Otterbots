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
    "https://antredesloutres.fr",
    "https://hoyo.link",
    "https://sg-public-api.hoyoverse.com",
    "https://keqingmains.com",
    "https://akasha.cv",
    "https://x.com",
    "https://youtu.be",
    "https://tenor.com/",
    "https://cdn.discordapp.com",
    "https://minecraft.fr"
];