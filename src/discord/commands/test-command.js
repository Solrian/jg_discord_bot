import { SlashCommandBuilder } from "@discordjs/builders";

const testCommands = new SlashCommandBuilder()
  .setName("test")
  .setDescription("test command");

export default testCommands.toJSON();
