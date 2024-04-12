class MarketManager {
  isUpdating = false;
  constructor(josshApiHandler, databaseHandler) {
    this.name = "MarketManager";
    this.josshApiHandler = josshApiHandler;
    this.databaseHandler = databaseHandler;
  }
  async InitializeMarket() {
    this.isUpdating = true;
    console.log("getting market data.");
    let items = await this.josshApiHandler.getInventory();
    if (items.length > 0) {
      await this.databaseHandler.insertInventory(items);
    }
    this.isUpdating = false;
    1;
  }
  async UpdateMarket() {
    this.isUpdating = true;
    console.log("updating market.");
    let items = await this.josshApiHandler.getInventory();
    let changes = [];
    if (items.length > 0) {
      await this.databaseHandler.insertInventory(items);
      let inventory = await this.databaseHandler.getInventory();
      while (inventory.length > 1) {
        let cur = inventory.shift();
        let old = inventory.shift();
        if (cur.id != old.id && cur.station != old.station)
          inventory.unshift(old);
        else {
          if (cur.price != old.price) {
            changes.push([
              cur.station,
              cur.name,
              "price",
              cur.price,
              old.price,
            ]);
          }
          if (cur.amount != old.amount) {
            changes.push([
              cur.station,
              cur.name,
              "amount",
              cur.amount,
              old.amount,
            ]);
          }
        }
      }
    }
    await this.databaseHandler.insertInventoryChanges(changes);
    await this.databaseHandler.deleteOldInventory();
    console.log("updating market. - done");
    this.isUpdating = false;
  }
}

export { MarketManager };
