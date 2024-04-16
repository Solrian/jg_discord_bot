import EventEmitter from "events";

const eventEmitter = new EventEmitter();

class DataManager {
  isUpdating = false;
  constructor(josshApiHandler, databaseHandler) {
    this.name = "DataManager";
    this.updateDoneEvent = eventEmitter;
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
      await this.#update(currentTS, lastTS);
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
  async #update(currentTS, lastTS) {
    console.log("updating data.");
    let tmp = Date.now();
    await Promise.all([
      this.#updatePilots(currentTS, lastTS),
      this.#updateInventory(),
      this.#updateMap(),
      this.#updateMissions(),
      this.#updatePos(),
    ]);
    console.log("update complete.");
    console.log("time needed: " + (Date.now() - tmp) + "ms");
  }

  async #calculateLeaderboards(currentTS) {
    let currentDate = new Date(currentTS.replace(" ", "T"));
    let currentTime = currentDate.getTime();
    let boards = [
      {
        timespan: 0.25,
        time: currentTime - 1000 * 60 * 60 * 24 * 0.25,
      },
      {
        timespan: 1,
        time: currentTime - 1000 * 60 * 60 * 24 * 1,
      },
      {
        timespan: 7,
        time: currentTime - 1000 * 60 * 60 * 24 * 7,
      },
    ];
    let boardStats = [
      ["played"],
      ["confluxKills"],
      ["beacons"],
      ["shotsHit", "shotsFired"],
      ["missions"],
      ["missilesHit", "missilesFired"],
      ["pures"],
      ["artifacts"],
      ["credits", "played"],
      ["experience", "played"],
      ["deaths"],
    ];
    let values = [];
    for (let board of boards) {
      let date = new Date(board.time);
      let pastGen = await this.databaseHandler.getGenerationFromTimelog(date);
      let rows = await this.databaseHandler.getPilotChanges(
        [
          "played",
          "confluxKills",
          "beacons",
          "shotsHit",
          "shotsFired",
          "missions",
          "missilesHit",
          "missilesFired",
          "pures",
          "artifacts",
          "credits",
          "experience",
          "deaths",
        ],
        pastGen
      );
      for (let stats of boardStats) {
        if (stats.length == 1) {
          let statRows = rows
            .filter((x) => x.stat == stats[0])
            .sort((a, b) => {
              if (a.callsign < b.callsign) return -1;
              if (a.callsign > b.callsign) return 1;
              if (a.generation < b.generation) return -1;
              if (a.generation > b.generation) return 1;
            });
          while (statRows.length > 1) {
            let newest = statRows.shift();
            let oldest = statRows.shift();
            if (newest.callsign != oldest.callsign) {
              statRows.unshift(oldest);
              oldest = newest;
            }
            let score = parseInt(newest.newValue - oldest.oldValue, 10);
            if (score > 0)
              values.push([newest.callsign, board.timespan, stats[0], score]);
          }
        } else if (stats.length == 2) {
          let statRows1 = rows.filter((x) => x.stat == stats[0]);
          while (statRows1.length > 1) {
            let score = 0;
            let score1 = 0;
            let score2 = 0;
            let newest1 = statRows1.shift();
            let oldest1 = statRows1.shift();
            if (newest1.callsign != oldest1.callsign) {
              statRows1.unshift(oldest1);
              oldest1 = newest1;
            }
            let statRow2 = rows.filter(
              (x) => x.callsign == newest1.callsign && x.stat == stats[1]
            );
            let newest2 = statRow2.shift();
            let oldest2 = statRow2.shift();
            if (oldest2) {
              if (newest2.callsign != oldest2.callsign) {
                statRows1.unshift(oldest2);
                oldest2 = newest2;
              }
              score1 = parseInt(newest1.newValue - oldest1.oldValue, 10);
              score2 = parseInt(newest2.newValue - oldest2.oldValue, 10);
            }

            if (score1 > 0 && score2 > 0) {
              if (stats[1] == "shotsFired" || stats[1] == "MissilesFired") {
                score = parseInt((score1 / score2) * 100, 10);
              } else if (stats[1] == "Played") {
                score = parseInt(score1 / score2, 10);
              }
              if (score > 0)
                values.push([
                  newest1.callsign,
                  board.timespan,
                  stats[0],
                  score,
                ]);
            }
          }
        }
      }
      await this.databaseHandler.insertLeaderboard(values);
    }
  }

  async #initPilots() {
    let users = await this.josshApiHandler.getAllUsers();
    let pilotsToCheck = [];
    for await (const user of users) {
      pilotsToCheck.push(user.callsign);
    }
    await this.#savePilots(pilotsToCheck, true);
  }
  async #updatePilots(currentTS, lastTS) {
    let tmp = Date.now();
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
    await this.#calculateLeaderboards(currentTS);
    eventEmitter.emit("pilots", Date.now() - tmp + "ms");
  }
  async #initInventory() {
    await this.#saveInventory();
  }
  async #updateInventory() {
    let tmp = Date.now();
    await this.#saveInventory();
    await this.#compareInventory();
    eventEmitter.emit("inventory", Date.now() - tmp + "ms");
  }
  async #initMap() {
    await this.#saveMap();
  }
  async #updateMap() {
    let tmp = Date.now();
    await this.#saveMap();
    await this.#compareMap();
    eventEmitter.emit("map", Date.now() - tmp + "ms");
  }
  async #initMissions() {
    await this.#saveMissions();
  }
  async #updateMissions() {
    let tmp = Date.now();
    await this.#saveMissions();
    await this.#compareMissions();
    eventEmitter.emit("missions", Date.now() - tmp + "ms");
  }
  async #initPos() {
    await this.#savePos();
  }
  async #updatePos() {
    let tmp = Date.now();
    await this.#savePos();
    await this.#comparePos();
    eventEmitter.emit("pos", Date.now() - tmp + "ms");
  }

  async #savePilots(callsigns, withLog) {
    let count = 0;
    let logCount = 0;
    let logCountMax = callsigns.length;
    let pilots = [];
    let promises = [];
    console.log(logCountMax + " pilots to load.");
    console.log(callsigns);
    while (callsigns.length > 0) {
      count++;
      logCount++;
      promises.push(this.josshApiHandler.getUserProfile(callsigns.shift()));
      if (count == 30) {
        try {
          pilots.push(...(await Promise.all(promises)));
          promises = [];
          if (withLog)
            console.log(
              Math.round((logCount / logCountMax) * 100, 2) +
                "% (" +
                logCount +
                "/" +
                logCountMax +
                ") "
            );
          count = 0;
        } catch (err) {
          if (err) console.error(err);
        }
      }
    }
    try {
      pilots.push(...(await Promise.all(promises)));
    } catch (err) {
      if (err) console.error(err);
    }
    await this.databaseHandler.insertPilot(pilots);
  }
  async #saveInventory() {
    let items = await this.josshApiHandler.getStationsInventory();
    await this.databaseHandler.insertInventory(items);
  }
  async #saveMap() {
    let map = await this.josshApiHandler.getMap();
    await this.databaseHandler.insertSectorLinks(map.sector_links);
    let sectors = Object.values(map.sectors);
    await this.databaseHandler.insertBeacons(sectors);
  }
  async #saveMissions() {
    let missions = await this.josshApiHandler.getMissions();
    await this.databaseHandler.insertMissions(missions);
  }
  async #savePos() {
    let posList = await this.josshApiHandler.getPosList();
    let allPos = [];
    let promises = [];
    let count = 0;
    console.log(Object.entries(posList).length + " pos to load.");
    for (const [pid, p] of Object.entries(posList)) {
      count++;
      promises.push(this.josshApiHandler.getPos(pid, p));
      if (count == 30) {
        try {
          let ps = await Promise.all(promises);
          for (let i = 0; i < ps.length; i++) {
            allPos.push([ps[i][0], ps[i][1], ps[i][2]]);
          }
          promises = [];
          count = 0;
        } catch (err) {
          if (err) console.error(err);
        }
      }
    }
    try {
      let ps = await Promise.all(promises);
      for (let i = 0; i < ps.length; i++) {
        allPos.push([ps[i][0], ps[i][1], ps[i][2]]);
      }
    } catch (err) {
      if (err) console.error(err);
    }
    await this.databaseHandler.insertPos(allPos);
  }
  async #comparePilots() {
    let pilots = await this.databaseHandler.getPilotsToCompare();
    let changes = [];
    while (pilots.length > 1) {
      let cur = pilots.shift();
      let old = pilots.shift();
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
      //console.log(changes);
      await this.databaseHandler.insertInventoryChanges(changes);
    }
    await this.databaseHandler.deleteOldInventory();
  }
  async #compareMap() {
    let beacons = await this.databaseHandler.getBeaconsToCompare();
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
    let links = await this.databaseHandler.getSectorLinksToCompare();
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
      await this.databaseHandler.insertSectorLinksChanges(changes);
    }
    await this.databaseHandler.deleteOldSectorLinks();
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

function wait(millisec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, millisec);
  });
}

export { DataManager };
