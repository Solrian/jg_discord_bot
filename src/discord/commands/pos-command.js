import { SlashCommandBuilder } from "@discordjs/builders";

const posCommands = new SlashCommandBuilder()
  .setName("pos")
  .setDescription("Find Item on POS markets")
  .addStringOption((option) =>
    option
      .setName("item")
      .setDescription("Enter Item Name")
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addBooleanOption((option) =>
    option
      .setName("public")
      .setDescription("public POS only? standard: True")
      .setRequired(false)
  );

export default posCommands.toJSON();
