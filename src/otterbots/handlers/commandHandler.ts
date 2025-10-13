import { Client, Collection, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { SlashCommand } from "../types";
import {otterlogs} from "../utils/otterlogs";

/**
 * Charge toutes les commandes et les enregistre dans Discord
 */
export async function loadCommands(client: Client) {
    const rootDir = path.join(__dirname, "..");
    const commandsPath = path.join(rootDir, "commands");
    const commandFiles = getAllCommandFiles(commandsPath);

    // otterlogs.success("📂 Command files trouvés :" + commandFiles);

    client.slashCommands = new Collection<string, SlashCommand>();
    const commandsData = [];

    for (const file of commandFiles) {
        if (file.endsWith(".d.ts")) continue;

        const fileUrl = pathToFileURL(file).href;
        const imported = await import(fileUrl);

        const command = resolveCommand(imported);

        // ⚠️ TypeScript type guard
        if (!isSlashCommand(command)) {
            otterlogs.error("⚠️ Commande ignorée :" + file  + " -> " + command);
            continue;
        }

        client.slashCommands.set(command.data.name, command);
        commandsData.push(command.data.toJSON());
    }

    // 🔁 Envoi à Discord
    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);
    await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
        { body: commandsData }
    );

    otterlogs.success(`✅  ${commandsData.length} commande(s) enregistrée(s) sur Discord.`);
}

/**
 * Récupère récursivement tous les fichiers de commande
 */
function getAllCommandFiles(dir: string): string[] {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    const isBuild = __dirname.includes("build") || __dirname.includes("dist");
    const ext = isBuild ? ".js" : ".ts";

    return files.flatMap(file =>
        file.isDirectory()
            ? getAllCommandFiles(path.join(dir, file.name))
            : file.name.endsWith(ext)
                ? [path.join(dir, file.name)]
                : []
    );
}

/**
 * Résout les exports multiples (default imbriqué)
 */
function resolveCommand(module: unknown): unknown {
    let cmd: unknown = module;
    while (cmd && typeof cmd === "object" && "default" in cmd) {
        cmd = (cmd as { default: unknown }).default;
    }
    return cmd;
}

/**
 * Type guard pour vérifier que l'objet est bien un SlashCommand
 */
function isSlashCommand(command: unknown): command is SlashCommand {
    return (
        typeof command === "object" &&
        command !== null &&
        "data" in command &&
        "execute" in command &&
        typeof (command as SlashCommand).execute === "function"
    );
}
