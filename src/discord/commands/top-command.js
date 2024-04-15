import { SlashCommandBuilder } from "@discordjs/builders";

const topCommands = new SlashCommandBuilder()
  .setName("top")
  .setDescription("alltime top stats")
  .addStringOption((option) =>
    option
      .setName("stat")
      .setDescription("what stat?")
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addIntegerOption((option) =>
    option.setName("max").setDescription("How many?").setRequired(true)
  );

export default topCommands.toJSON();
