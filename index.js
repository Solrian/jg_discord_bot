import { DiscordHandler } from "./src/discord/discord-handler.js";
import { DatabaseHandler } from "./src/database/database-handler.js";
import { JosshApiHandler } from "./src/jossh-api/jossh-api-handler.js";
import readline from "readline";

const josshApiHandler = new JosshApiHandler();
const databaseHandler = new DatabaseHandler();
const discordHandler = new DiscordHandler(databaseHandler);

//databaseHandler.AddNewGeneration();
//let tmp = await databaseHandler.Test("7 day");
// console.log(tmp);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function terminalInput() {
  rl.question("", (input) => {
    if (input == "exit") return rl.close();
    console.log(`Command to execute: ${input}`);
    if (input == "dbtables") databaseHandler.listTables();
    else if (input == "createdbtables") databaseHandler.createTables();
    else if (input == "dropdbtables") databaseHandler.dropTables();
    terminalInput();
  });
}

terminalInput();
