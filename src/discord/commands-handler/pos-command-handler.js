import { EmbedBuilder } from "@discordjs/builders";

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

class PosCommandHandler {
  constructor(interaction, databaseHandler) {
    this.name = "PosCommandHandler";
    this.interaction = interaction;
    this.databaseHandler = databaseHandler;
  }
  async run() {
    try {
      if (this.interaction.isChatInputCommand()) {
        await this.interaction.deferReply({ ephemeral: true });
        let dbrows =
          await this.databaseHandler.getPosInventoryByItemNameAndPermission(
            this.interaction.options.get("item").value,
            this.interaction.options.get("public").value
          );
        let embeds = [];
        let embed = new EmbedBuilder();
        let retString = "";
        for (let i = 0; i < dbrows.length; i++) {
          let tmp =
            dbrows[i].posName.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") +
            " : " +
            dbrows[i].amount +
            "x " +
            dbrows[i].price +
            "c" +
            "\n";
          if (retString.length + tmp.length > 1024) {
            embed.addFields({
              name: this.interaction.options.get("item").value,
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
        if (retString != "") {
          embed.addFields({
            name: this.interaction.options.get("item").value,
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
            content:
              "nothing found for: " +
              this.interaction.options.get("item").value,
            ephemeral: true,
          });
        }
      } else if (this.interaction.isAutocomplete()) {
        const focusedValue = this.interaction.options.getFocused();
        const choices = [];
        items
          .sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
          })
          .forEach((item) => {
            choices.push(item.name.toLowerCase());
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

export { PosCommandHandler };
