class PilotManager {
  isUpdating = false;
  constructor(josshApiHandler, databaseHandler) {
    this.name = "PilotManager";
    this.josshApiHandler = josshApiHandler;
    this.databaseHandler = databaseHandler;
  }
  async initializePilots() {
    this.isUpdating = true;
    console.log("updating initial pilots.");
    let users = await this.josshApiHandler.getAllUsers();
    let count = 1;
    if (users.length > 0) {
      for await (const user of users) {
        let pilot = await this.josshApiHandler.getUserProfile(user.callsign);
        if (pilot) {
          await this.databaseHandler.insertPilotProfile(pilot);
          console.log(
            Math.round((count / users.length) * 100) +
              "% (" +
              count +
              "/" +
              users.length +
              ") " +
              pilot.callsign
          );
        }
        count++;
      }
    }
    console.log("updating initial pilots. - done");
    this.isUpdating = false;
  }
  async updatePilots(lastTS) {
    this.isUpdating = true;
    console.log("updating pilots.");
    let lastDate = new Date(lastTS.replace(" ", "T"));
    let lastTime = lastDate.getTime();
    let users = await this.josshApiHandler.getAllUsers();
    let count = 1;
    let usersToCheck = [];
    if (users.length > 0) {
      //get callsigns to check from alluserlist
      for await (const user of users) {
        let userDate = new Date(user.updated_time.replace(" ", "T"));
        let userTime = userDate.getTime();
        if (lastTime < userTime) {
          usersToCheck.push(user.callsign);
        }
      }
      //get callsigns to check for beacons
      let pilots = await this.databaseHandler.getBeaconPilots();
      for await (const pilot of pilots) {
        if (!usersToCheck.includes(pilot.callsign))
          usersToCheck.push(pilot.callsign);
      }

      for await (const callsign of usersToCheck) {
        let pilot = await this.josshApiHandler.getUserProfile(callsign);
        if (pilot) {
          console.log(
            Math.round((count / usersToCheck.length) * 100) +
              "% (" +
              count +
              "/" +
              usersToCheck.length +
              ") " +
              pilot.callsign
          );
          await this.databaseHandler.insertPilotProfile(pilot);
          let changes = [];
          let profiles = await this.databaseHandler.getProfilesToCompare(
            callsign
          );
          if (profiles) {
            let cur = profiles[0];
            let old = profiles[1];

            if (cur.isOnline != old.isOnline) {
              changes.push(["isOnline", cur.isOnline, old.isOnline]);
            }
            if (cur.isDocked != old.isDocked) {
              changes.push(["isDocked", cur.isDocked, old.isDocked]);
            }
            if (cur.squad != old.squad) {
              changes.push(["squad", cur.squad, old.squad]);
            }
            if (cur.level != old.level) {
              changes.push(["level", cur.level, old.level]);
            }
            if (cur.experience != old.experience) {
              changes.push(["experience", cur.experience, old.experience]);
            }
            if (cur.faction != old.faction) {
              changes.push(["faction", cur.faction, old.faction]);
            }
            if (cur.registration != old.registration) {
              changes.push([
                "registration",
                cur.registration,
                old.registration,
              ]);
            }
            if (cur.ratingSolrain != old.ratingSolrain) {
              changes.push([
                "ratingSolrain",
                cur.ratingSolrain,
                old.ratingSolrain,
              ]);
            }
            if (cur.ratingOctavius != old.ratingOctavius) {
              changes.push([
                "ratingOctavius",
                cur.ratingOctavius,
                old.ratingOctavius,
              ]);
            }
            if (cur.ratingQuantar != old.ratingQuantar) {
              changes.push([
                "ratingQuantar",
                cur.ratingQuantar,
                old.ratingQuantar,
              ]);
            }
            if (cur.RatingAmananth != old.RatingAmananth) {
              changes.push([
                "RatingAmananth",
                cur.RatingAmananth,
                old.RatingAmananth,
              ]);
            }
            if (cur.ratingHyperial != old.ratingHyperial) {
              changes.push([
                "ratingHyperial",
                cur.ratingHyperial,
                old.ratingHyperial,
              ]);
            }
            if (cur.killsSolrain != old.killsSolrain) {
              changes.push([
                "killsSolrain",
                cur.killsSolrain,
                old.killsSolrain,
              ]);
            }
            if (cur.killsOctavius != old.killsOctavius) {
              changes.push([
                "killsOctavius",
                cur.killsOctavius,
                old.killsOctavius,
              ]);
            }
            if (cur.killsQuantar != old.killsQuantar) {
              changes.push([
                "killsQuantar",
                cur.killsQuantar,
                old.killsQuantar,
              ]);
            }
            if (cur.credits != old.credits) {
              changes.push(["credits", cur.credits, old.credits]);
            }
            if (cur.shotsHit != old.shotsHit) {
              changes.push(["shotsHit", cur.shotsHit, old.shotsHit]);
            }
            if (cur.shotsFired != old.shotsFired) {
              changes.push(["shotsFired", cur.shotsFired, old.shotsFired]);
            }
            if (cur.missilesHit != old.missilesHit) {
              changes.push(["missilesHit", cur.missilesHit, old.missilesHit]);
            }
            if (cur.missilesFired != old.missilesFired) {
              changes.push([
                "missilesFired",
                cur.missilesFired,
                old.missilesFired,
              ]);
            }
            if (cur.missionsCompleted != old.missionsCompleted) {
              changes.push([
                "missionsCompleted",
                cur.missionsCompleted,
                old.missionsCompleted,
              ]);
            }
            if (cur.missionsFlown != old.missionsFlown) {
              changes.push([
                "missionsFlown",
                cur.missionsFlown,
                old.missionsFlown,
              ]);
            }
            if (cur.confluxKills != old.confluxKills) {
              changes.push([
                "confluxKills",
                cur.confluxKills,
                old.confluxKills,
              ]);
            }
            if (cur.deaths != old.deaths) {
              changes.push(["deaths", cur.deaths, old.deaths]);
            }
            if (cur.pures != old.pures) {
              changes.push(["pures", cur.pures, old.pures]);
            }
            if (cur.artifacts != old.artifacts) {
              changes.push(["artifacts", cur.artifacts, old.artifacts]);
            }
            if (cur.beacons != old.beacons) {
              changes.push(["beacons", cur.beacons, old.beacons]);
            }
            if (cur.bounty != old.bounty) {
              changes.push(["bounty", cur.bounty, old.bounty]);
            }
            if (cur.launches != old.launches) {
              changes.push(["launches", cur.launches, old.launches]);
            }
            if (cur.landings != old.landings) {
              changes.push(["landings", cur.landings, old.landings]);
            }
            if (cur.disconnects != old.disconnects) {
              changes.push(["disconnects", cur.disconnects, old.disconnects]);
            }
            if (cur.played != old.played) {
              changes.push(["played", cur.played, old.played]);
            }

            if (changes.length > 0) console.log(changes);
            await this.databaseHandler.insertPilotChanges(callsign, changes);
            await this.databaseHandler.deleteOldPilotProfile(pilot.callsign);
          }
        }
        count++;
      }
    }

    console.log("updating pilots. - done");
    this.isUpdating = false;
  }
}

export { PilotManager };
