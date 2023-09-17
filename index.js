import { DiscordHandler } from "./src/discord/discord-handler.js";
import { DatabaseHandler } from "./src/database/database-handler.js";
import { JosshApiHandler } from "./src/jossh-api/jossh-api-handler.js";

const josshApiHandler = new JosshApiHandler();
const databaseHandler = new DatabaseHandler();
const discordHandler = new DiscordHandler(databaseHandler);
discordHandler.startAsync();

//databaseHandler.AddNewGeneration();
//let tmp = await databaseHandler.Test("7 day");
// console.log(tmp);
