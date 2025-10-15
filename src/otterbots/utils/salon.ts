import {Client, Colors, Guild, PermissionFlagsBits, ChannelType} from "discord.js";
import {otterlogs} from "./otterlogs";
import {botSalon, salonCategory} from "../../app/config/salon";

/**
 * Creates a set of channels and a category with specific permissions in a Discord server.
 * Ensures the existence of a specific role and manages permissions for that role.
 *
 * @param {Client} client - The Discord client used to interact with the Discord API.
 * @return {Promise<void>} A promise that resolves when all channels and roles have been successfully created or logged.
 */
export type SalonType = {
    name: string;
    categoryName: string;
}

/**
 * Creates Discord text channels within specific categories for a guild. Ensures that categories and channels are created only if they do not already exist, and manages permissions for a specific role.
 *
 * @param {Client} client The Discord bot client instance used to interact with the Discord API and execute guild-related operations.
 * @return {Promise<void>} A promise that resolves once the channels and roles are created or the operation concludes. If an error occurs, it logs the error and does not throw it further.
 */
export async function createSalon(client: Client): Promise<void> {
    client.on('clientReady', async () : Promise<void> => {
        try {
            const channelNames: SalonType[] = [];
            // Noms des salons à créer
            for (const category of salonCategory) {
                for (const salon of botSalon) {
                    if (salon.category === category.id && !channelNames.some(c => c.name === salon.name)) {
                        channelNames.push({name: salon.name, categoryName: category.name});
                    }
                }
            }

            // ID du serveur
            const guildId = process.env.DISCORD_GUILD_ID;
            if (!guildId) {
                otterlogs.error("❌ GuildId non trouvée");
                return;
            }

            // Tableau pour stocker les noms des salons existants
            const channelsDiscord: string[] = [];

            try {
                // Récupère la guild
                const guild: Guild | undefined = client.guilds.cache.get(guildId);
                if (!guild) {
                    otterlogs.error(`❌  Guild non trouvée (ID: ${guildId})`);
                    return;
                }

                // Récupère la liste des salons et stocke les noms dans un tableau
                guild.channels.cache.forEach((channel) => {
                    channelsDiscord.push(channel.name);
                });

                // Vérifie si le rôle existe déjà
                let role = guild.roles.cache.find((r) => r.name === process.env.BOT_NAME);
                if (!role) {
                    // Crée un rôle spécifique
                    role = await guild.roles.create({
                        name: process.env.BOT_NAME,
                        color: Colors.Blue,
                        reason: "Role spécifique pour la catégorie",
                    });
                }

                // Pour chaque catégorie
                for (const category of salonCategory) {
                    // Vérifie si la catégorie existe déjà
                    let categoryChannel = guild.channels.cache.find(
                        (channel) =>
                            channel.name === category.name &&
                            channel.type === 4
                    );

                    if (!categoryChannel) {
                        // Crée une catégorie avec les permissions pour le rôle spécifique
                        categoryChannel = await guild.channels.create({
                            name: category.name,
                            type: ChannelType.GuildCategory,
                            permissionOverwrites: [
                                {
                                    id: guild.id,
                                    deny: [PermissionFlagsBits.ViewChannel],
                                },
                                {
                                    id: role.id,
                                    allow: [PermissionFlagsBits.ViewChannel],
                                },
                            ],
                        });
                        otterlogs.success(`✅  Catégorie "${category.name}" créée avec les permissions !`);
                    }

                    // Crée les salons de cette catégorie
                    for (const salon of botSalon) {
                        if (salon.category === category.id && !channelsDiscord.includes(salon.name)) {
                            await guild.channels.create({
                                name: salon.name,
                                type: ChannelType.GuildText,
                                parent: categoryChannel.id,
                                permissionOverwrites: [
                                    {
                                        id: guild.id,
                                        deny: [PermissionFlagsBits.ViewChannel],
                                    },
                                    {
                                        id: role.id,
                                        allow: [PermissionFlagsBits.ViewChannel],
                                    },
                                ],
                            });
                            otterlogs.success(`✅  Salon "${salon.name}" créé !`);
                        }
                    }
                }
            } catch (error) {
                otterlogs.error(`❌  Erreur lors de la création des salons : ${error}`);
            }
        } catch (error) {
            otterlogs.error(`❌  Impossible d'exécuter l'événement OnReady : ${error}`);
            otterlogs.error("Erreur lors de l'événement OnReady" + `👤 tag : ${client.user?.username} (ID: ${client.user?.id}) \n ${error}`);
        }
    });
}