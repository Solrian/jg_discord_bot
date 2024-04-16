import { DatabaseHandler } from "./src/database/database-handler.js";
import { DiscordHandler } from "./src/discord/discord-handler.js";
import { JosshApiHandler } from "./src/jossh-api/jossh-api-handler.js";
import { DataManager } from "./src/data-manager.js";
import readline from "readline";

const databaseHandler = new DatabaseHandler();
let tables = await databaseHandler.listTables();
if (tables.length < 15) {
  await databaseHandler.createTables();
}
const discordHandler = new DiscordHandler(databaseHandler);
const josshApiHandler = new JosshApiHandler();
const dataManager = new DataManager(josshApiHandler, databaseHandler);

const updateEvent = josshApiHandler.updateFoundEvent;

updateEvent.on("newtimestamp", async () => {
  console.log("new timestamp detected.");
  if (!dataManager.isUpdating) dataManager.newGeneration();
  else console.log("Update Suspended - previous Update still running");
  console.log("waiting for next server update");
});

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function terminalInput() {
  rl.question("", async (input) => {
    if (input == "exit") return rl.close();
    if (input == "listtables") {
      console.log(`executing: ${input}`);
      let tables = await databaseHandler.listTables();
      console.log(tables);
    } else if (input == "createtables") {
      console.log(`executing: ${input}`);
      await databaseHandler.createTables();
    } else if (input == "droptables") {
      console.log(`executing: ${input}`);
      await databaseHandler.dropTables();
    }
    terminalInput();
  });
}

terminalInput();
