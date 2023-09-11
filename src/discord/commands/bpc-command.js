import { SlashCommandBuilder } from "@discordjs/builders";
import stations from "../../data/stations.js";

const bpcCommands = new SlashCommandBuilder()
  .setName("bpc")
  .setDescription("best profit calculator")
  .addStringOption((option) =>
    option
      .setName("from")
      .setDescription("From which station?")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("to").setDescription("To which station?").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("pilot")
      .setDescription("Your Pilots Callsign for precise tax calculation")
      .setRequired(false)
  )
  .addBooleanOption((option) =>
    option
      .setName("commodities")
      .setDescription("Commodities only? standard: True")
      .setRequired(false)
  );

stations.forEach((choice) => {
  bpcCommands.options[0].addChoices(choice);
  bpcCommands.options[1].addChoices(choice);
});

export default bpcCommands.toJSON();
