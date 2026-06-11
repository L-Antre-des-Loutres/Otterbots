import {Otterbots} from "../otterbots";
import {OtterTask} from "@/otterbots/utils/ottertask/OtterTask";
import {OtterTaskManager} from "@/otterbots/utils/ottertask/OtterTaskManager";

// Get bot instance
const bot = new Otterbots();

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