class DataManager {
  isUpdating = false;
  constructor(josshApiHandler, databaseHandler) {
    this.name = "DataManager";
    this.josshApiHandler = josshApiHandler;
    this.databaseHandler = databaseHandler;
  }
  async newGeneration() {
    this.isUpdating = true;
    let currentTS = await this.josshApiHandler.getCurrentTS();
    let lastTS = await this.databaseHandler.getCurrentTS();
    if (!lastTS) {
      console.log("Starting Initial Run");
      await this.databaseHandler.addNewGeneration(currentTS);
      await this.#initialize();
      console.log("Initial Run Done! Waiting for next update interval");
    } else if (currentTS != lastTS) {
      await this.databaseHandler.addNewGeneration(currentTS);
      await this.#update(lastTS);
      await this.databaseHandler.deleteChanges(1000);
    }
    this.isUpdating = false;
  }
  async #initialize() {
    await Promise.all([
      this.#initPilots(),
      this.#initInventory(),
      this.#initMissions(),
      this.#initMap(),
      this.#initPos(),
    ]);
  }
  async #update(lastTS) {
    console.log("updating data.");
    let tmp = Date.now();
    await Promise.all([
      this.#updatePilots(lastTS),
      this.#updateInventory(),
      this.#updateMissions(),
      this.#updateMap(),
      this.#updatePos(),
    ]);
    console.log("update complete.");
    console.log("time needed: " + (Date.now() - tmp) + "ms");
  }
  async #initPilots() {
    let users = await this.josshApiHandler.getAllUsers();
    let pilotsToCheck = [];
    for await (const user of users) {
      pilotsToCheck.push(user.callsign);
    }
    await this.#savePilots(pilotsToCheck, true);
  }
  async #updatePilots(lastTS) {
    let lastDate = new Date(lastTS.replace(" ", "T"));
    let lastTime = lastDate.getTime();
    let users = await this.josshApiHandler.getAllUsers();
    let pilotsToCheck = [];
    if (users.length > 0) {
      //get callsigns to check from alluserlist
      for await (const user of users) {
        let userDate = new Date(user.updated_time.replace(" ", "T"));
        let userTime = userDate.getTime();
        if (lastTime < userTime) {
          pilotsToCheck.push(user.callsign);
        }
      }
      //get callsigns to check for beacons
      let pilots = await this.databaseHandler.getBeaconUsers();
      for await (const pilot of pilots) {
        if (!pilotsToCheck.includes(pilot.callsign))
          pilotsToCheck.push(pilot.callsign);
      }
    }
    await this.#savePilots(pilotsToCheck, false);
    await this.#comparePilots();
  }
  async #savePilots(callsigns, withLog) {
    let count = 1;
    for await (const callsign of callsigns) {
      let pilot = await this.josshApiHandler.getUserProfile(callsign);
      if (pilot) {
        await this.databaseHandler.insertPilot(pilot);
        if (withLog)
          console.log(
            Math.round((count / callsigns.length) * 100) +
              "% (" +
              count +
              "/" +
              callsigns.length +
              ") " +
              pilot.callsign
          );
      }
      count++;
    }
  }
  async #comparePilots() {
    let pilots = await this.databaseHandler.getPilotsToCompare();
    let changes = [];
    let cur;
    let old;
    while (pilots.length > 1) {
      cur = pilots.shift();
      old = pilots.shift();
      if (cur.callsign != old.callsign) pilots.unshift(old);
      else {
        if (cur.isOnline != old.isOnline) {
          changes.push([cur.callsign, "isOnline", cur.isOnline, old.isOnline]);
        }
        if (cur.isDocked != old.isDocked) {
          changes.push([cur.callsign, "isDocked", cur.isDocked, old.isDocked]);
        }
        if (cur.squad != old.squad) {
          changes.push([cur.callsign, "squad", cur.squad, old.squad]);
        }
        if (cur.level != old.level) {
          changes.push([cur.callsign, "level", cur.level, old.level]);
        }
        if (cur.experience != old.experience) {
          changes.push([
            cur.callsign,
            "experience",
            cur.experience,
            old.experience,
          ]);
        }
        if (cur.faction != old.faction) {
          changes.push([cur.callsign, "faction", cur.faction, old.faction]);
        }
        if (cur.registration != old.registration) {
          changes.push([
            cur.callsign,
            "registration",
            cur.registration,
            old.registration,
          ]);
        }
        if (cur.ratingSolrain != old.ratingSolrain) {
          changes.push([
            cur.callsign,
            "ratingSolrain",
            cur.ratingSolrain,
            old.ratingSolrain,
          ]);
        }
        if (cur.ratingOctavius != old.ratingOctavius) {
          changes.push([
            cur.callsign,
            "ratingOctavius",
            cur.ratingOctavius,
            old.ratingOctavius,
          ]);
        }
        if (cur.ratingQuantar != old.ratingQuantar) {
          changes.push([
            cur.callsign,
            "ratingQuantar",
            cur.ratingQuantar,
            old.ratingQuantar,
          ]);
        }
        if (cur.RatingAmananth != old.RatingAmananth) {
          changes.push([
            cur.callsign,
            "RatingAmananth",
            cur.RatingAmananth,
            old.RatingAmananth,
          ]);
        }
        if (cur.ratingHyperial != old.ratingHyperial) {
          changes.push([
            cur.callsign,
            "ratingHyperial",
            cur.ratingHyperial,
            old.ratingHyperial,
          ]);
        }
        if (cur.killsSolrain != old.killsSolrain) {
          changes.push([
            cur.callsign,
            "killsSolrain",
            cur.killsSolrain,
            old.killsSolrain,
          ]);
        }
        if (cur.killsOctavius != old.killsOctavius) {
          changes.push([
            cur.callsign,
            "killsOctavius",
            cur.killsOctavius,
            old.killsOctavius,
          ]);
        }
        if (cur.killsQuantar != old.killsQuantar) {
          changes.push([
            cur.callsign,
            "killsQuantar",
            cur.killsQuantar,
            old.killsQuantar,
          ]);
        }
        if (cur.credits != old.credits) {
          changes.push([cur.callsign, "credits", cur.credits, old.credits]);
        }
        if (cur.shotsHit != old.shotsHit) {
          changes.push([cur.callsign, "shotsHit", cur.shotsHit, old.shotsHit]);
        }
        if (cur.shotsFired != old.shotsFired) {
          changes.push([
            cur.callsign,
            "shotsFired",
            cur.shotsFired,
            old.shotsFired,
          ]);
        }
        if (cur.missilesHit != old.missilesHit) {
          changes.push([
            cur.callsign,
            "missilesHit",
            cur.missilesHit,
            old.missilesHit,
          ]);
        }
        if (cur.missilesFired != old.missilesFired) {
          changes.push([
            cur.callsign,
            "missilesFired",
            cur.missilesFired,
            old.missilesFired,
          ]);
        }
        if (cur.missionsCompleted != old.missionsCompleted) {
          changes.push([
            cur.callsign,
            "missionsCompleted",
            cur.missionsCompleted,
            old.missionsCompleted,
          ]);
        }
        if (cur.missionsFlown != old.missionsFlown) {
          changes.push([
            cur.callsign,
            "missionsFlown",
            cur.missionsFlown,
            old.missionsFlown,
          ]);
        }
        if (cur.confluxKills != old.confluxKills) {
          changes.push([
            cur.callsign,
            "confluxKills",
            cur.confluxKills,
            old.confluxKills,
          ]);
        }
        if (cur.deaths != old.deaths) {
          changes.push([cur.callsign, "deaths", cur.deaths, old.deaths]);
        }
        if (cur.pures != old.pures) {
          changes.push([cur.callsign, "pures", cur.pures, old.pures]);
        }
        if (cur.artifacts != old.artifacts) {
          changes.push([
            cur.callsign,
            "artifacts",
            cur.artifacts,
            old.artifacts,
          ]);
        }
        if (cur.beacons != old.beacons) {
          changes.push([cur.callsign, "beacons", cur.beacons, old.beacons]);
        }
        if (cur.bounty != old.bounty) {
          changes.push([cur.callsign, "bounty", cur.bounty, old.bounty]);
        }
        if (cur.launches != old.launches) {
          changes.push([cur.callsign, "launches", cur.launches, old.launches]);
        }
        if (cur.landings != old.landings) {
          changes.push([cur.callsign, "landings", cur.landings, old.landings]);
        }
        if (cur.disconnects != old.disconnects) {
          changes.push([
            cur.callsign,
            "disconnects",
            cur.disconnects,
            old.disconnects,
          ]);
        }
        if (cur.played != old.played) {
          changes.push([cur.callsign, "played", cur.played, old.played]);
        }
        await this.databaseHandler.deleteOldPilotProfile(cur.callsign);
      }
    }
    if (changes.length > 0) {
      console.log(changes);
      await this.databaseHandler.insertPilotChanges(changes);
    }
  }
  async #initInventory() {
    let items = await this.josshApiHandler.getStationsInventory();
    await this.#saveInventory(items);
  }
  async #updateInventory() {
    let items = await this.josshApiHandler.getStationsInventory();
    await this.#saveInventory(items);
    await this.#compareInventory();
  }
  async #saveInventory(items) {
    await this.databaseHandler.insertInventory(items);
  }
  async #compareInventory() {
    let inventory = await this.databaseHandler.getInventoryToCompare();
    let changes = [];
    while (inventory.length > 1) {
      let cur = inventory.shift();
      let old = inventory.shift();
      if (cur.id != old.id || cur.station != old.station)
        inventory.unshift(old);
      else {
        if (cur.price != old.price) {
          changes.push([cur.station, cur.name, "price", cur.price, old.price]);
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
    if (changes.length > 0) {
      console.log("station-inventory logged.");
      await this.databaseHandler.insertInventoryChanges(changes);
    }
    await this.databaseHandler.deleteOldInventory();
  }
  async #initMissions() {
    let missions = await this.josshApiHandler.getMissions();
    await this.#saveMissions(missions);
  }
  async #updateMissions() {
    let missions = await this.josshApiHandler.getMissions();
    await this.#saveMissions(missions);
    await this.#compareMissions();
  }
  async #saveMissions(missions) {
    await this.databaseHandler.insertMissions(missions);
  }
  async #compareMissions() {
    let missions = await this.databaseHandler.getMissionsToCompare();
    let changes = [];
    while (missions.length > 1) {
      let cur = missions.shift();
      let old = missions.shift();
      if (cur.faction != old.faction) missions.unshift(old);
      else {
        if (cur.text != old.text) {
          changes.push([cur.faction, "text", cur.text, old.text]);
        }
        if (cur.complete != old.complete) {
          changes.push([cur.faction, "complete", cur.complete, old.complete]);
        }
      }
    }
    if (changes.length > 0) {
      console.log(changes);
      await this.databaseHandler.insertMissionChanges(changes);
    }
    await this.databaseHandler.deleteOldMissions();
  }
  async #initMap() {
    let map = await this.josshApiHandler.getMap();
    await this.#saveMap(map);
  }
  async #updateMap() {
    let map = await this.josshApiHandler.getMap();
    await this.#saveMap(map);
    await this.#compareMap();
  }
  async #saveMap(map) {
    await this.databaseHandler.insertSectorLinks(map.sector_links);
    let sectors = Object.values(map.sectors);
    await this.databaseHandler.insertBeacons(sectors);
  }
  async #compareMap() {
    let beacons = await this.databaseHandler.getBeacons();
    let changes = [];
    let cur;
    let old;
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
    if (changes.length > 0) {
      console.log(changes);
      await this.databaseHandler.insertBeaconChanges(changes);
    }
    await this.databaseHandler.deleteOldBeacons();
    let links = await this.databaseHandler.getSectorLinks();
    changes = [];
    while (links.length > 0) {
      cur = links.shift();
      if (links.length > 0) {
        old = links.shift();
        if (cur.sector1 != old.sector1 || cur.sector2 != old.sector2) {
          if (cur.generation == 0) changes.push([cur.sector1, cur.sector2, 1]);
          else if (cur.generation == 1)
            changes.push([cur.sector1, cur.sector2, 0]);
          links.unshift(old);
        }
      } else {
        if (cur.generation == 0) changes.push([cur.sector1, cur.sector2, 1]);
        else if (cur.generation == 1)
          changes.push([cur.sector1, cur.sector2, 0]);
      }
    }
    if (changes.length > 0) {
      console.log(changes);
      await this.databaseHandler.insertSectorLinksChanges(changes);
    }
    await this.databaseHandler.deleteOldSectorLinks();
  }
  async #initPos() {
    let posList = await this.josshApiHandler.getPosList();
    await this.#savePos(posList);
  }
  async #updatePos() {
    let posList = await this.josshApiHandler.getPosList();
    await this.#savePos(posList);
    await this.#comparePos();
  }
  async #savePos(posList) {
    let count = 1;
    for (const [pid, p] of Object.entries(posList)) {
      let pos = await this.josshApiHandler.getPos(p.url);
      if (pos) {
        await this.databaseHandler.insertPos(pid, p, pos);
        // console.log(
        //   Math.round((count / Object.entries(posList).length) * 100) +
        //     "% (" +
        //     count +
        //     "/" +
        //     Object.entries(posList).length +
        //     ") " +
        //     pos.name
        // );
        count++;
      }
    }
  }
  async #comparePos() {
    let items = await this.databaseHandler.getPosInventoryToCompare();
    let changes = [];
    let cur;
    let old;
    while (items.length > 0) {
      cur = items.shift();
      if (items.length > 0) {
        old = items.shift();
        if (cur.posid != old.posid || cur.name != old.name) {
          if (cur.generation == 0)
            changes.push([cur.posid, cur.name, "amount", cur.amount, 0]);
          else if (cur.generation == 1)
            changes.push([cur.posid, cur.name, "amount", 0, cur.amount]);
          items.unshift(old);
        } else {
          if (cur.amount != old.amount)
            changes.push([
              cur.posid,
              cur.name,
              "amount",
              cur.amount,
              old.amount,
            ]);
          if (cur.price != old.price)
            changes.push([cur.posid, cur.name, "price", cur.price, old.price]);
        }
      } else {
        if (cur.generation == 0)
          changes.push([cur.posid, cur.name, "amount", cur.amount, 0]);
        else if (cur.generation == 1)
          changes.push([cur.posid, cur.name, "amount", 0, cur.amount]);
      }
    }
    if (changes.length > 0) {
      console.log(changes);
      await this.databaseHandler.insertPosInventoryChanges(changes);
    }
    await this.databaseHandler.deleteOldPosData();
  }
}

export { DataManager };
