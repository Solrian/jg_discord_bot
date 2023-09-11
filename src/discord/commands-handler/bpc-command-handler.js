class BpcCommandHandler {
  constructor(interaction) {
    this.name = "BpcCommandHandler";
    this.interaction = interaction;
  }

  async run() {
    try {
      await this.interaction.deferReply({ ephemeral: true });
      await this.interaction.editReply({
        content: "not implemented yet",
        ephemeral: true,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export { BpcCommandHandler };
