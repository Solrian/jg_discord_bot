import { config } from "dotenv";
import { REST, Routes, Client, IntentsBitField } from "discord.js";
import bpcCommands from "./commands/bpc-command.js";
import posCommands from "./commands/pos-command.js";
import topCommands from "./commands/top-command.js";
import testCommands from "./commands/test-command.js";
import { PosCommandHandler } from "./commands-handler/pos-command-handler.js";
import { BpcCommandHandler } from "./commands-handler/bpc-command-handler.js";
import { TopCommandHandler } from "./commands-handler/top-command-handler.js";
import { TestCommandHandler } from "./commands-handler/test-command-handler.js";
import { EmbedBuilder } from "@discordjs/builders";

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
    const commands = [bpcCommands, posCommands, topCommands];
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
          new PosCommandHandler(interaction, this.databaseHandler).run();
        } else if (interaction.commandName == "bpc") {
          new BpcCommandHandler(interaction, this.databaseHandler).run();
        } else if (interaction.commandName == "top") {
          new TopCommandHandler(interaction, this.databaseHandler).run();
        } else if (interaction.commandName == "test") {
          console.log("interaction : test");
          new TestCommandHandler(interaction, this.databaseHandler).run();
        }
      } catch (err) {
        console.log(err);
      }
    });

    this.client.on("ready", () => {
      console.log(`${this.client.user.tag} has logged in!`);
    });
  }
  async updateLeaderboards() {
    let tmp = Date.now();
    console.log("updating discord leaderboard messages");
    let posts = [
      {
        timespan: 0.25,
        title: "Live Leaderboards last 6 h",
        id: process.env.MESSAGE_ID_6H,
      },
      {
        timespan: 1,
        title: "Live Leaderboards last 24 h",
        id: process.env.MESSAGE_ID_1D,
      },
      {
        timespan: 7,
        title: "Live Leaderboards last 7 days",
        id: process.env.MESSAGE_ID_7D,
      },
    ];
    let boards = [
      { title: "Top Played Time", stat: "played", limit: 10 },
      { title: "Top Conflux Kills", stat: "confluxKills", limit: 5 },
      { title: "Top Beacons Held", stat: "beacons", limit: 5 },
      { title: "Top Shots Hit Percent", stat: "shotsHit", limit: 5 },
      { title: "Top Missions Completed", stat: "missions", limit: 5 },
      { title: "Top Missiles Hit Percent", stat: "missilesHit", limit: 5 },
      { title: "Top Pures Mined", stat: "pures", limit: 5 },
      { title: "Top Artifacts Found", stat: "artifacts", limit: 5 },
      { title: "Top Credits Earned / Played Time", stat: "credits", limit: 5 },
      {
        title: "Top Experience Earned / Played Time",
        stat: "experience",
        limit: 5,
      },
      { title: "Top Deaths", stat: "Deaths", limit: 5 },
    ];
    for (let post of posts) {
      try {
        let message = await this.client.channels.cache
          .get(process.env.CHANNEL_ID)
          .messages.fetch(post.id);
        let embed = new EmbedBuilder(message.embeds[0]);
        embed.data.fields = [];
        for (let board of boards) {
          var msg = [];
          let rows = await this.databaseHandler.getTopFromLeaderboard([
            board.stat,
            post.timespan,
            board.limit,
          ]);
          if (rows.length > 0) {
            let position = 1;
            for (let row of rows) {
              let score = row.score;
              if (board.stat == "played") {
                let tmp = Math.floor(score / 60);
                let minutes = score % 60;
                let days = Math.floor(tmp / 24);
                let hours = tmp % 24;
                if (days > 0)
                  score = days + "d " + hours + "h " + minutes + "min";
                else if (hours > 0) score = hours + "h " + minutes + "min";
                else score = minutes + "min";
              } else if (
                board.stat == "shotsHit" ||
                board.stat == "missilesHit"
              ) {
                score = score + "%";
              }
              msg.push(
                "#" +
                  position +
                  ": " +
                  score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") +
                  " (" +
                  row.callsign +
                  ")\n"
              );
              position++;
            }
          }
          let txt = msg.join("");
          if (txt != "") {
            embed.addFields({
              name: board.title,
              value: txt,
              inline: false,
            });
          }
        }
        embed.setDescription(Date(Date.now()));
        embed.setTitle(post.title);
        await message.edit({ embeds: [embed] });
      } catch (error) {
        console.log(error);
      }
    }
    console.log("leaderboards updated : " + (Date.now() - tmp) + "ms");
  }
  async notifyLinkChange(change) {
    let embed = new EmbedBuilder();
    embed.setTitle("Infest " + (change[2] == 0 ? "appeared" : "destroyed"));
    embed.addFields({
      name: "Link " + (change[2] == 0 ? "dropped" : "restored"),
      value: change[0] + " to " + change[1],
      inline: false,
    });
    let callsigns = await this.databaseHandler.getPossibleInfestDestroyer();
    let callsignString = "";
    while (callsigns.length > 0) {
      callsignString += callsigns.shift().callsign + "\n";
    }
    embed.addFields({
      name: "Possible destroyers :",
      value: callsignString.length > 0 ? callsignString : "unknown",
      inline: false,
    });
    let channel = this.client.channels.cache.get(
      process.env.CHANNEL_ID_INFESTS
    );
    await channel.send({ embeds: [embed] });
  }
}

export { DiscordHandler };
