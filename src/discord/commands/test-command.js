import { SlashCommandBuilder } from "@discordjs/builders";

const testCommands = new SlashCommandBuilder()
  .setName("test")
  .setDescription("test command")
  .addStringOption((option) =>
    option.setName("testoption").setDescription("test option").setRequired(true)
  );

export default testCommands.toJSON();
