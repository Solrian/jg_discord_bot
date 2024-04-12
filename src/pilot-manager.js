import axios from "axios";
import EventEmitter from "events";

class PilotManager {
  isUpdating = false;
  constructor(josshApiHandler, databaseHandler) {
    this.name = "PilotManager";
    this.josshApiHandler = josshApiHandler;
    this.databaseHandler = databaseHandler;
  }

  async initializePilots(currentTS) {
    this.isUpdating = true;
    console.log("Starting Initial Run");
    let users = await this.josshApiHandler.getUsers();
    let count = 1;
    if (users.length > 0) {
      for await (const user of users) {
        let pilot = await this.josshApiHandler.getPilot(user.callsign);
        if (pilot) {
          this.databaseHandler.insertPilotProfile(pilot);
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
    this.isUpdating = false;
    console.log("Initial Run Done! Waiting for next update interval");
  }

  async updatePilots(currentTS, lastTS) {
    this.isUpdating = true;
    console.log("updating pilots.");

    let currentDate = new Date(currentTS.replace(" ", "T"));
    let lastDate = new Date(lastTS.replace(" ", "T"));
    let users = await this.josshApiHandler.getUsers();
    let currentTime = currentDate.getTime();
    let lastTime = lastDate.getTime();
    let count = 1;
    if (users.length > 0) {
      for await (const user of users) {
        let userDate = new Date(user.updated_time.replace(" ", "T"));
        let userTime = userDate.getTime();
        if (lastTime < userTime && userTime <= currentTime) {
          let pilot = await this.josshApiHandler.getPilot(user.callsign);
          if (pilot) {
            console.log("(" + count + ") " + pilot.callsign);
            await this.databaseHandler.insertPilotProfile(pilot);
            let changes = [];
            let profiles = await this.databaseHandler.getProfilesToCompare(
              user.callsign
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

              console.log(changes);
              await this.databaseHandler.insertPilotChanges(
                user.callsign,
                changes
              );
              await this.databaseHandler.deleteOldPilotProfile(pilot.callsign);
            }
          }
          count++;
        }
      }
    }

    console.log("Pilot Update Done");
    this.isUpdating = false;
  }
}

export { PilotManager };