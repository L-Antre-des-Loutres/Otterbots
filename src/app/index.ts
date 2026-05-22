import {Otterbots} from "../otterbots";
import {OtterHealthCheck} from "../otterbots/utils/healthcheck/healthcheck";

// Get bot instance
const bot = new Otterbots();

// Start the bot
bot.start();
bot.setActivity("custom", "Hello Otters !")
bot.startOtterGuard()

// Start health check server
OtterHealthCheck.start(bot.getClient());

// Start tasks (if you not use tasks, you can delete this)
bot.initTask()
