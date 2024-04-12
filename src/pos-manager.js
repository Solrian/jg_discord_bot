class PosManager {
  isUpdating = false;
  constructor(josshApiHandler, databaseHandler) {
    this.name = "PosManager";
    this.josshApiHandler = josshApiHandler;
    this.databaseHandler = databaseHandler;
  }
  async InitializePos() {
    this.isUpdating = true;
    console.log("updating initial pos.");
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
    console.log("updating initial pos. - done");
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
        count++;
      }
    }
    await this.LogPosInventoryChanges();
    await this.databaseHandler.deleteOldPosData();
    console.log("updating pos. - done");
    this.isUpdating = false;
  }
  async LogPosInventoryChanges() {
    let items = await this.databaseHandler.getPosInventoryToCompare();
    let changes = [];
    let cur;
    let old;
    while (items.length > 0) {
      cur = items.shift();
      if (items.length > 0) old = items.shift();
      else {
        if (cur.generation == 0)
          changes.push([cur.posid, cur.name, "amount", cur.amount, 0]);
        else if (cur.generation == 1)
          changes.push([cur.posid, cur.name, "amount", 0, cur.amount]);
      }
      if (cur.posid != old.posid || cur.name != old.name) {
        if (cur.generation == 0)
          changes.push([cur.posid, cur.name, "amount", cur.amount, 0]);
        else if (cur.generation == 1)
          changes.push([cur.posid, cur.name, "amount", 0, cur.amount]);
        items.unshift(old);
      } else {
        if (cur.amount != old.amount)
          changes.push([cur.posid, cur.name, "amount", cur.amount, old.amount]);
        if (cur.price != old.price)
          changes.push([cur.posid, cur.name, "price", cur.price, old.price]);
      }
    }
    await this.databaseHandler.insertPosInventoryChanges(changes);
  }
}

export { PosManager };
