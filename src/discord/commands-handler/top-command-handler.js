import { EmbedBuilder } from "@discordjs/builders";

const stats = [
  {
    name: "experience",
    dbprop: "experience",
  },
  {
    name: "solrain pilots kills",
    dbprop: "killsSolrain",
  },
  {
    name: "octavius pilots kills",
    dbprop: "killsOctavius",
  },
  {
    name: "quantar pilots kills",
    dbprop: "killsQuantar",
  },
  {
    name: "credits",
    dbprop: "credits",
  },
  {
    name: "shots hit",
    dbprop: "shotsHit",
  },
  {
    name: "shots fired",
    dbprop: "shotsFired",
  },
  {
    name: "missiles hit",
    dbprop: "missilesHit",
  },
  {
    name: "missiles fired",
    dbprop: "missilesFired",
  },
  {
    name: "missions completed",
    dbprop: "missionsCompleted",
  },
  {
    name: "missions taken",
    dbprop: "missionsFlown",
  },
  {
    name: "conflux kills",
    dbprop: "confluxKills",
  },
  {
    name: "deaths",
    dbprop: "deaths",
  },
  {
    name: "pures mined",
    dbprop: "pures",
  },
  {
    name: "artifacts obtained",
    dbprop: "artifacts",
  },
  {
    name: "beacons held",
    dbprop: "beacons",
  },
  {
    name: "bounty",
    dbprop: "bounty",
  },
  {
    name: "launches",
    dbprop: "launches",
  },
  {
    name: "landings",
    dbprop: "landings",
  },
  {
    name: "disconnects",
    dbprop: "disconnects",
  },
  {
    name: "playtime",
    dbprop: "played",
  },
];

class TopCommandHandler {
  constructor(interaction, databaseHandler) {
    this.name = "TopCommandHandler";
    this.interaction = interaction;
    this.databaseHandler = databaseHandler;
    stats.sort((a, b) => {
      const name1 = a.name.toUpperCase();
      const name2 = b.name.toUpperCase();
      if (name1 < name2) return -1;
      if (name1 > name2) return 1;
      return 0;
    });
  }

  async run() {
    try {
      if (this.interaction.isChatInputCommand()) {
        await this.interaction.deferReply({ ephemeral: true });
        let max = this.interaction.options.get("max").value;
        let stat = stats.find(
          (x) => x.name == this.interaction.options.get("stat").value
        ).dbprop;
        if (max > 200) max = 200;
        let dbrows = await this.databaseHandler.getTopFromStat(stat, max);
        let embeds = [];
        let embed = new EmbedBuilder();
        let retString = "";
        for (let i = 0; i < dbrows.length; i++) {
          if (dbrows[i][stat] > 0) {
            let tmp =
              "#" +
              (i + 1) +
              ": " +
              dbrows[i][stat].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") +
              " (" +
              dbrows[i].callsign +
              ")\n";
            if (retString.length + tmp.length > 1024) {
              embed.addFields({
                name: "Alltime Top " + max + " " + stat,
                value: retString,
                inline: false,
              });
              embeds.push(embed);
              embed = new EmbedBuilder();
              retString = tmp;
            } else {
              retString += tmp;
            }
          }
        }
        if (retString != "") {
          embed.addFields({
            name: "Alltime Top " + max + " " + stat,
            value: retString,
            inline: false,
          });
          embeds.push(embed);
          let count = 1;
          let msgCount = embeds.length;
          while (embeds.length > 0) {
            let e = embeds.shift();
            e.setTitle(count + " / " + msgCount);
            if (count == 1) {
              await this.interaction.editReply({
                embeds: [e],
                ephemeral: true,
              });
            } else {
              await this.interaction.followUp({
                embeds: [e],
                ephemeral: true,
              });
            }
            count++;
          }
        } else {
          await this.interaction.editReply({
            content: "nothing found",
            ephemeral: true,
          });
        }
      } else if (this.interaction.isAutocomplete()) {
        const focusedValue = this.interaction.options.getFocused();
        const choices = [];
        stats.forEach((stat) => {
          choices.push(stat.name);
        });
        const filtered = choices.filter((choice) =>
          choice.startsWith(focusedValue)
        );
        while (filtered.length > 25) filtered.pop();
        await this.interaction.respond(
          filtered.map((choice) => ({ name: choice, value: choice }))
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export { TopCommandHandler };
