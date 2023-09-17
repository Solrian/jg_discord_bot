import { config } from "dotenv";
import { REST, Routes, Client, IntentsBitField } from "discord.js";
import bpcCommands from "./commands/bpc-command.js";
import posCommands from "./commands/pos-command.js";
import { PosCommandHandler } from "./commands-handler/pos-command-handler.js";
import { BpcCommandHandler } from "./commands-handler/bpc-command-handler.js";

class DiscordHandler {
  constructor(databaseHandler) {
    config();
    this.name = "DiscordHandler";
    this.databaseHandler = databaseHandler;
    this.client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
      ],
    });
    this.rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_BOT_TOKEN
    );
    this.startAsync();
  }

  async startAsync() {
    this.client.login(process.env.DISCORD_BOT_TOKEN);
    const commands = [bpcCommands, posCommands];
    try {
      console.log("Started refreshing application (/) commands.");
      await this.rest.put(
        Routes.applicationGuildCommands(
          process.env.BOT_CLIENT_ID,
          process.env.GUILD_ID
        ),
        {
          body: commands,
        }
      );
    } catch (err) {
      console.log(err);
    }

    this.client.on("interactionCreate", async (interaction) => {
      try {
        if (interaction.commandName == "pos") {
          const posHandler = new PosCommandHandler(interaction);
          await posHandler.run();
        } else if (interaction.commandName == "bpc") {
          const bpcHandler = new BpcCommandHandler(interaction);
          await bpcHandler.run();
        }
      } catch (err) {
        console.log(err);
      }
    });

    this.client.on("ready", () => {
      console.log(`${this.client.user.tag} has logged in!`);
    });
  }
}

export { DiscordHandler };
