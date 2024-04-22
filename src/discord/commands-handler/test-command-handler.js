import { EmbedBuilder } from "@discordjs/builders";
import { buttonPages } from "../pagination.js";

class TestCommandHandler {
  constructor(interaction, databaseHandler) {
    this.name = "TestCommandHandler";
    this.interaction = interaction;
    this.databaseHandler = databaseHandler;
  }

  async run() {
    try {
      if (this.interaction.isChatInputCommand()) {
        let embed1 = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("1")
          .setDescription("discription 1");
        let embed2 = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("2")
          .setDescription("discription 2");
        let embed3 = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle("3")
          .setDescription("discription 3");
        let pages = [embed1, embed2, embed3];
        await this.interaction.deferReply();
        buttonPages(this.interaction, pages);
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

export { TestCommandHandler };
