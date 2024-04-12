class MapManager {
  isUpdating = false;
  constructor(josshApiHandler, databaseHandler) {
    this.name = "MapManager";
    this.josshApiHandler = josshApiHandler;
    this.databaseHandler = databaseHandler;
  }
  async initializeMap() {
    this.isUpdating = true;
    console.log("updating initial map.");
    let links = await this.josshApiHandler.getSectorLinks();
    await this.databaseHandler.insertSectorLinks(links);
    console.log("updating initial map. - done");
    this.isUpdating = false;
  }
  async updateMap() {
    this.isUpdating = true;
    console.log("updating map.");
    let map = await this.josshApiHandler.getMap();
    await this.databaseHandler.insertSectorLinks(map.sector_links);
    await this.logSectorLinkChanges();
    await this.databaseHandler.deleteOldSectorLinks();
    let sectors = Object.values(map.sectors);
    await this.databaseHandler.insertBeacons(sectors);
    await this.logBeaconChanges();
    await this.databaseHandler.deleteOldBeacons();
    console.log("updating map. - done");
    this.isUpdating = false;
  }
  async logBeaconChanges() {
    let beacons = await this.databaseHandler.getBeacons();
    let changes = [];
    let cur;
    let old;
    while (beacons.length > 0) {
      while (beacons.length > 1) {
        cur = beacons.shift();
        old = beacons.shift();
        if (cur.sector != old.sector) {
          beacons.unshift(old);
        } else {
          if (cur.status != old.status)
            changes.push([cur.sector, cur.status, old.status]);
        }
      }
      await this.databaseHandler.insertBeaconChanges(changes);
    }
  }
  async logSectorLinkChanges() {
    let links = await this.databaseHandler.getSectorLinks();
    let changes = [];
    let cur;
    let old;
    while (links.length > 0) {
      cur = links.shift();
      if (links.length > 0) old = links.shift();
      else {
        if (cur.generation == 0) changes.push([cur.sector1, cur.sector2, 1]);
        else if (cur.generation == 1)
          changes.push([cur.sector1, cur.sector2, 0]);
      }
      if (cur.posid != old.posid || cur.name != old.name) {
        if (cur.generation == 0) changes.push([cur.sector1, cur.sector2, 1]);
        else if (cur.generation == 1)
          changes.push([cur.sector1, cur.sector2, 0]);
        links.unshift(old);
      } else {
        if (cur.amount != old.amount)
          changes.push([cur.sector1, cur.sector2, 1]);
        if (cur.price != old.price) changes.push([cur.sector1, cur.sector2, 0]);
      }
    }
    await this.databaseHandler.insertSectorLinksChanges(changes);
  }
}

export { MapManager };
