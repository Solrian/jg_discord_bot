async function bpcCommandHandler(interaction) {
  try {
    await interaction.deferReply({ ephemeral: true });
    await interaction.editReply({
      content: "not implemented yet",
      ephemeral: true,
    });
  } catch (err) {
    console.log(err);
  }
}

export default bpcCommandHandler;
