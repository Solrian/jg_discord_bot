class PosManager {
  isUpdating = false;
  constructor(josshApiHandler, databaseHandler) {
    this.name = "PosManager";
    this.josshApiHandler = josshApiHandler;
    this.databaseHandler = databaseHandler;
  }
  async initializePos() {
    this.isUpdating = true;
    console.log("updating initial pos.");
    let posList = await this.josshApiHandler.getPosList();
    let count = 1;
    for (const [pid, p] of Object.entries(posList)) {
      let pos = await this.josshApiHandler.getPos(p.url);
      if (pos) {
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
    console.log("updating initial pos. - done");
    this.isUpdating = false;
  }
  async updatePos() {
    this.isUpdating = true;
    console.log("updating pos.");
    let posList = await this.josshApiHandler.getPosList();
    let count = 1;
    for (const [pid, p] of Object.entries(posList)) {
      let pos = await this.josshApiHandler.getPos(p.url);
      if (pos) {
        await this.databaseHandler.insertPos(pid, p, pos);
        console.log(
          Math.round((count / Object.entries(posList).length) * 100) +
            "% (" +
            count +
            "/" +
            Object.entries(posList).length +
            ") " +
            pos.name
        );
        count++;
      }
    }
    await this.logPosInventoryChanges();
    await this.databaseHandler.deleteOldPosData();
    console.log("updating pos. - done");
    this.isUpdating = false;
  }
  async logPosInventoryChanges() {
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
