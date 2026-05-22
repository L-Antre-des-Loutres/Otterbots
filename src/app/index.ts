import {Otterbots} from "../otterbots";
import {otterlogs} from "../otterbots/utils/otterlogs";
import {OtterPocketBase} from "../otterbots/utils/pocketbase/pocketbase";

// Get bot instance
const bot = new Otterbots();

// Start the bot
bot.start();
bot.setActivity("custom", "Hello Otters !")
bot.startOtterGuard()

// Start tasks (if you not use tasks, you can delete this)
bot.initTask()

// Example of OtterPocketBase
OtterPocketBase.execByAlias("get_discord_users").then(data => {
    otterlogs.log(JSON.stringify(data, null, 2));
});