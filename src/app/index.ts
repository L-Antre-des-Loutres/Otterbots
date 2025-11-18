import {Otterbots} from "../otterbots";
import {getSalonByAlias} from "../otterbots/utils/salon";

// Get bot instance
const bot = new Otterbots();

// Start the bot
bot.start();
bot.setActivity("custom", "Hello Otters !")
bot.startOtterGuard()

// Start tasks (if you not use tasks, you can delete this)
bot.initTask()
