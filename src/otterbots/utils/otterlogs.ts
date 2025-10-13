import { WebhookClient } from "discord.js";

/**
 * An object containing ANSI color codes for styled log messages.
 *
 * Each property represents a specific log style or color formatting
 * that can be used to enhance the visibility and differentiation
 * of log outputs in the console.
 *
 * Properties:
 * - `success` - ANSI color-coded string representing a success log label.
 * - `info` - ANSI color-coded string representing an info log label.
 * - `warn` - ANSI color-coded string representing a warning log label.
 * - `error` - ANSI color-coded string representing an error log label.
 * - `errorColor` - ANSI color code for error-related text styling.
 * - `importantColor` - ANSI color code for highlighting important text.
 * - `resetColor` - ANSI color code to reset text styling to default.
 */
const logStyles = {
    success: "\u001b[32m[success]\u001b[0m",
    info: "\u001b[34m[info]\u001b[0m",
    warn: "\u001b[33m[warn]\u001b[0m",
    error: "\u001b[31m[error]\u001b[0m",
    errorColor: "\u001b[31m",
    importantColor: "\u001b[33m",
    resetColor: "\u001b[0m",
};

/**
 * Log functions with different styling and Discord webhook integration
 * @property success - Green [success] prefix + Discord webhook
 * @property log - Blue [info] prefix + Discord webhook
 * @property warn - Yellow [warn] prefix + Discord webhook
 * @property error - Red [error] prefix + Discord error webhook
 * @property important - Yellow text + Discord webhook
 * @property silentlog - Plain console log only
 */
export const otterlogs = {
    success: (message: string): void => {
        console.log(logStyles.success, message);
        sendLogMessage(message, false, "success");
    },
    log: (message: string): void => {
        console.log(logStyles.info, message);
        sendLogMessage(message, false, "log");
    },
    warn: (message: string): void => {
        console.warn(logStyles.warn, message);
        sendLogMessage(message, false, "warn");
    },
    error: (message: string): void => {
        console.error(logStyles.error, message);
        sendLogMessage(message, true, "error");
    },
    important: (message: string): void => {
        console.log(`${logStyles.importantColor}${message}${logStyles.resetColor}`);
        sendLogMessage(message, false, "important");
    },
    silentlog: (message: string): void => {
        console.log(message);
    }
};

// Fonction pour envoyer un message dans le salon de logs via webhook
function sendLogMessage(message: string, error: boolean, type?: string): void {
    if (process.env.ENABLE_DISCORD_SUCCESS === "false" && type === "success") return;
    if (process.env.ENABLE_DISCORD_LOGS === "false" && type === "log") return;
    if (process.env.ENABLE_DISCORD_WARNS === "false" && type === "warn") return;
    if (process.env.ENABLE_DISCORD_ERRORS === "false" && type === "error") return;

    const webhookURL = error ? process.env.ERROR_WEBHOOK_URL : process.env.GLOBAL_WEBHOOK_URL;

    if (!webhookURL) {
        console.error(logStyles.error, "Webhook URL non définie dans le fichier .env !");
        return;
    }

    const webhookClient = new WebhookClient({ url: webhookURL });

    webhookClient.send({
        content: message,
        username: `${process.env.BOT_NAME} - ${type?.toUpperCase()}`,
    }).catch((err) => {
        console.error(logStyles.error, "Erreur lors de l'envoi du message via webhook:", err);
    });
}