import { DiscordHandler } from "./src/discord/discord-handler.js";
import { DatabaseHandler } from "./src/database/database-handler.js";
import { JosshApiHandler } from "./src/jossh-api/jossh-api-handler.js";
import { PilotManager } from "./src/pilot-manager.js";
import { MarketManager } from "./src/market-manager.js";
import readline from "readline";

const databaseHandler = new DatabaseHandler();
const discordHandler = new DiscordHandler(databaseHandler);
const josshApiHandler = new JosshApiHandler();
const pilotManger = new PilotManager(josshApiHandler, databaseHandler);
const marketManger = new MarketManager(josshApiHandler, databaseHandler);

const updateEvent = josshApiHandler.updateFoundEvent;

updateEvent.on("newtimestamp", async () => {
  console.log("newtimestamp detected.");
  let startTS = Date.now();
  let currentTS = await josshApiHandler.getCurrentTS();
  let lastTS = await databaseHandler.getCurrentTS();
  if (lastTS == null) {
    await databaseHandler.addNewGeneration(currentTS);
    await pilotManger.initializePilots();
    await marketManger.InitializeMarket();
    console.log("time needed: " + (Date.now() - startTS) + "ms");
  } else if (currentTS != lastTS) {
    if (!pilotManger.isUpdating && !marketManger.isUpdating) {
      await databaseHandler.addNewGeneration(currentTS);
      await pilotManger.updatePilots(lastTS);
      await marketManger.UpdateMarket();
      console.log("time needed: " + (Date.now() - startTS) + "ms");
    } else console.log("Update Suspended - previous Update still running");
  }
  console.log("waiting for next server update");
});

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function terminalInput() {
  rl.question("", (input) => {
    if (input == "exit") return rl.close();
    if (input == "listtables") {
      console.log(`executing: ${input}`);
      databaseHandler.listTables();
    } else if (input == "createtables") {
      console.log(`executing: ${input}`);
      databaseHandler.createTables();
    } else if (input == "droptables") {
      console.log(`executing: ${input}`);
      databaseHandler.dropTables();
    }
    terminalInput();
  });
}

terminalInput();
