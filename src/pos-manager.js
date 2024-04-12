class PosManager {
  isUpdating = false;
  constructor(josshApiHandler, databaseHandler) {
    this.name = "PosManager";
    this.josshApiHandler = josshApiHandler;
    this.databaseHandler = databaseHandler;
  }
  async InitializePos() {
    this.isUpdating = true;
    let posList = await this.josshApiHandler.getListOfPos();
    let count = 1;
    if (posList.length > 0) {
      for await (const p of posList) {
        let pos = await this.josshApiHandler.getPosDetails(p.url);
        if (pos) {
          await this.databaseHandler.insertPos(pos);
          console.log(
            Math.round((count / posList.length) * 100) +
              "% (" +
              count +
              "/" +
              posList.length +
              ") " +
              pos.name
          );
        }
        count++;
      }
    }
    this.isUpdating = false;
  }
  async UpdatePos() {
    this.isUpdating = true;
    console.log("updating pos.");
    let posList = await this.josshApiHandler.getListOfPos();
    let posListValues = Object.values(posList);
    let count = 1;
    for (const p of posListValues) {
      let pos = await this.josshApiHandler.getPosDetails(p.url);
      if (pos) {
        let regex = /[A-Za-z0-9]+\.json/;
        let tmp = regex.exec(p.url);
        let pid = tmp[0].substring(0, tmp[0].length - 5);
        await this.databaseHandler.insertPos(pid, p, pos);
        console.log(
          Math.round((count / posListValues.length) * 100) +
            "% (" +
            count +
            "/" +
            posListValues.length +
            ") " +
            pos.name
        );
        await this.databaseHandler.deleteOldPosData(pid);
        count++;
      }
    }
    console.log("updating pos. - done");
    this.isUpdating = false;
  }
}

export { PosManager };
