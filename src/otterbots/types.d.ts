import {ChatInputCommandInteraction, Collection, SlashCommandBuilder} from "discord.js"

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string
            DISCORD_CLIENT_ID: string
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
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export { }