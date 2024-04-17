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
const updateDoneEvent = dataManager.updateDoneEvent;

updateEvent.on("newtimestamp", async () => {
  console.log("new timestamp detected.");
  if (!dataManager.isUpdating) dataManager.newGeneration();
  else console.log("Update Suspended - previous Update still running");
  console.log("waiting for next server update");
});

updateDoneEvent.on("pilots", async (b) => {
  console.log("pilots updated : " + b);
  discordHandler.updateLeaderboards();
});
updateDoneEvent.on("inventory", async (b) => {
  console.log("inventory updated : " + b);
});
updateDoneEvent.on("map", async (b) => {
  console.log("map updated : " + b);
});
updateDoneEvent.on("missions", async (b) => {
  console.log("missions updated : " + b);
});
updateDoneEvent.on("pos", async (b) => {
  console.log("pos updated : " + b);
});
updateDoneEvent.on("newLinkChanges", async (b) => {
  while (b.length > 0) {
    let change = b.shift();
    discordHandler.notifyLinkChange(change);
  }
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
    } else if (input == "links") {
      console.log(`executing: ${input}`);
      let links = await databaseHandler.listLinkChanges();
      console.log(links);
    }
    terminalInput();
  });
}

terminalInput();
