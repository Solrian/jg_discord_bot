import capacitor from "../../data/items/capacitor.js";
import commodities from "../../data/items/commodities.js";
import ecm from "../../data/items/ecm.js";
import engine from "../../data/items/engine.js";
import gun from "../../data/items/gun.js";
import missiles from "../../data/items/missile.js";
import modx from "../../data/items/modx.js";
import powerplant from "../../data/items/powerplant.js";
import radar from "../../data/items/radar.js";
import shield from "../../data/items/shield.js";

const items = capacitor
  .concat(commodities)
  .concat(ecm)
  .concat(engine)
  .concat(gun)
  .concat(missiles)
  .concat(modx)
  .concat(powerplant)
  .concat(radar)
  .concat(shield);

async function posCommandHandler(interaction) {
  try {
    if (interaction.isChatInputCommand()) {
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({
        content: `${interaction.options.get("item").value}`,
        ephemeral: true,
      });
    } else if (interaction.isAutocomplete()) {
      const focusedValue = interaction.options.getFocused();
      const choices = [];
      items.forEach((item) => {
        choices.push(item.name.toLocaleLowerCase());
      });
      const filtered = choices.filter((choice) =>
        choice.startsWith(focusedValue)
      );
      while (filtered.length > 25) filtered.pop();
      await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
      );
    }
  } catch (err) {
    console.log(err);
  }
}

export default posCommandHandler;
