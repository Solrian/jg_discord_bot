import { DiscordHandler } from "./src/discord/discord-handler.js";
import { DatabaseHandler } from "./src/database-handler.js";

const databaseHandler = new DatabaseHandler();
const discordHandler = new DiscordHandler(databaseHandler);
discordHandler.startAsync();
