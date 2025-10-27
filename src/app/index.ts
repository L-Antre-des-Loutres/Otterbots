import {Otterbots} from "../otterbots";

// Get bot instance
const bot = new Otterbots();

// Start the bot
bot.start();
bot.setActivity("custom", "Hello Otters !")
bot.startOtterGuard()

// Start tasks
bot.initTask()