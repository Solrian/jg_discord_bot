const stats = [
  {
    name: "flux",
    dbprop: "confluxKills",
  },
];

class TopCommandHandler {
  constructor(interaction, databaseHandler) {
    this.name = "BpcCommandHandler";
    this.interaction = interaction;
    this.databaseHandler = databaseHandler;
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
        let retString = "Top " + max + " " + stat + "\n";
        for (let i = 0; i < max; i++) {
          retString +=
            "#" +
            (i + 1) +
            ": " +
            dbrows[i][stat].toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") +
            " (" +
            dbrows[i].callsign +
            ")\n";
        }
        if (retString != "") {
          if (retString.length > 2000) {
            retString = retString.substring(0, 2000);
          }
          await this.interaction.editReply({
            content: retString,
            ephemeral: true,
          });
        }
      } else if (this.interaction.isAutocomplete()) {
        const focusedValue = this.interaction.options.getFocused();
        const choices = [];
        stats.forEach((stat) => {
          choices.push(stat.name.toLowerCase());
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
