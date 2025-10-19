import {
    AutocompleteInteraction,
    ButtonInteraction,
    CacheType, ChannelSelectMenuInteraction,
    ChatInputCommandInteraction,
    Collection, MentionableSelectMenuInteraction,
    MessageContextMenuCommandInteraction,
    ModalSubmitInteraction, PrimaryEntryPointCommandInteraction, RoleSelectMenuInteraction,
    SlashCommandBuilder, StringSelectMenuInteraction, UserContextMenuCommandInteraction, UserSelectMenuInteraction
} from "discord.js"

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string
            DISCORD_CLIENT_ID: string
            DISCORD_GUILD_ID: string
            GIT_REPOSITORY: string
            PROJECT_LOGO: string
            BOT_NAME: string



        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
    }
}

export interface SlashCommand {
    name: string,
    data: SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType> | UserContextMenuCommandInteraction<CacheType> | PrimaryEntryPointCommandInteraction<CacheType> | StringSelectMenuInteraction<"cached" | "raw" | undefined> | UserSelectMenuInteraction<"cached" | "raw" | undefined> | RoleSelectMenuInteraction<"cached" | "raw" | undefined> | MentionableSelectMenuInteraction<"cached" | "raw" | undefined> | ChannelSelectMenuInteraction<"cached" | "raw" | undefined> | ButtonInteraction<CacheType> | AutocompleteInteraction<CacheType> | ModalSubmitInteraction<CacheType>) => Promise<void>;
}

export { }