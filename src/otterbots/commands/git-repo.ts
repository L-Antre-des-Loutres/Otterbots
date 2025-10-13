import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("git-repo")
        .setDescription("Exemple de commande"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("Commande git-repo exécutée !");
    }
};