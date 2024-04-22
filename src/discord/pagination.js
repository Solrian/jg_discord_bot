import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} from "@discordjs/builders";
import { ButtonStyle, ComponentType } from "discord.js";

async function buttonPages(interaction, pages, time = 60000) {
  if (pages.length == 1) {
    let page = await interaction.editReply({
      embeds: pages,
      components: [],
      fetchReply: true,
    });
    return page;
  }

  let prev = new ButtonBuilder()
    .setCustomId("prev")
    .setLabel("prev")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(true);

  let next = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("next")
    .setStyle(ButtonStyle.Primary);

  let buttonRow = new ActionRowBuilder().addComponents(prev, next);
  let index = 0;

  let currentPage = await interaction.editReply({
    embeds: [pages[index]],
    components: [buttonRow],
    fetchReply: true,
  });
  console.log(index);
  let collector = await currentPage.createMessageComponentCollector({
    ComponentType: ComponentType.Button,
    time,
  });

  collector.on("collect", async (i) => {
    if (i.user.id != interaction.user.id)
      i.reply({
        content: "You can't use these buttons",
        ephemeral: true,
      });
    await i.deferUpdate();

    if (i.customId == "prev") {
      if (index > 0) index--;
    } else if (i.customId == "next") {
      if (index < pages.length - 1) index++;
    }

    if (index == 0) prev.setDisabled(true);
    else prev.setDisabled(false);

    if (index == pages.length - 1) next.setDisabled(true);
    else next.setDisabled(false);

    await currentPage.edit({
      embeds: [pages[index]],
      components: [buttonRow],
    });
    collector.resetTimer();
  });

  collector.on("end", async (i) => {
    console.log(index);
    await currentPage.edit({
      embeds: [pages[index]],
      components: [],
    });
  });
  return currentPage;
}

export { buttonPages };
