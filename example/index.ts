import {Otterbots} from "../src";
import {OtterTask} from "@/utils/ottertask/OtterTask";
import {OtterTaskManager} from "@/utils/ottertask/OtterTaskManager";
import {clientGatewayIntent} from "./config/client";
import {botSalon, salonCategory} from "./config/salon";
import {otterguardConfig, authorizedDomains} from "./config/otterguardConfig";
import {otterbots_reactions} from "./config/emojiReact";

// Get bot instance with configuration
const bot = new Otterbots({
    clientOptions: clientGatewayIntent.options,
    salons: {
        categories: salonCategory,
        botSalons: botSalon
    },
    otterguard: {
        ...otterguardConfig,
        authorizedDomains: authorizedDomains
    },
    reactions: otterbots_reactions
});

// Start the bot
bot.start();
bot.setActivity("custom", "Hello Otters !")
bot.startOtterGuard()

// Start tasks (if you not use tasks, you can delete this)
const task = new OtterTask("Test", "Test", true, true, "* * * * *", () => console.log("Test"))
const taskManager = new OtterTaskManager()
taskManager.addTask(task)
taskManager.initTasksOnCron()
taskManager.initTasksOnStart().then(r => console.log(r))