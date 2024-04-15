import mysql from "./mysql.js";
import { config } from "dotenv";
config();

class DatabaseHandler {
  constructor() {
    this.name = "DatabaseHandler";
  }
  async listTables() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      let rows = await connection.query(`show tables`);
      await connection.query("COMMIT");
      return rows;
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async createTables() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      connection.query(
        "create table timelog (" +
          "generation int(11), " +
          "time timestamp not null default current_timestamp()" +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table pilots (" +
          "generation int(11), " +
          "updated_time datetime, " +
          "callsign varchar(50), " +
          "isOnline tinyint(1), " +
          "isDocked tinyint(1), " +
          "squad varchar(50), " +
          "level int(11), " +
          "experience int(11), " +
          "faction varchar(50), " +
          "registration varchar(50), " +
          "ratingSolrain int(3), " +
          "ratingOctavius int(3), " +
          "ratingQuantar int(3), " +
          "RatingAmananth int(3), " +
          "ratingHyperial int(3), " +
          "killsSolrain int(11), " +
          "killsOctavius int(11), " +
          "killsQuantar int(11), " +
          "credits bigint(20), " +
          "shotsHit bigint(20), " +
          "shotsFired bigint(20), " +
          "missilesHit bigint(20), " +
          "missilesFired bigint(20), " +
          "missionsCompleted int(11), " +
          "missionsFlown int(11), " +
          "confluxKills int(11), " +
          "deaths int(11), " +
          "pures int(11), " +
          "artifacts int(11), " +
          "beacons int(11), " +
          "bounty int(11), " +
          "launches int(11), " +
          "landings int(11), " +
          "disconnects int(11), " +
          "played decimal(10,2) " +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table pilot_changes (" +
          "generation int(11), " +
          "callsign varchar(50), " +
          "stat varchar(50), " +
          "oldValue varchar(50), " +
          "newValue varchar(50) " +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table inventory (" +
          "generation int(11), " +
          "id int(11), " +
          "station varchar(50), " +
          "itemgroup varchar(50), " +
          "name varchar(50), " +
          "price int(11), " +
          "amount int(11), " +
          "produce tinyint(1) " +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table inventory_changes (" +
          "generation int(11), " +
          "station varchar(50), " +
          "name varchar(50), " +
          "stat varchar(50), " +
          "oldValue int(11), " +
          "newValue int(11) " +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table pos (" +
          "generation int(11), " +
          "posid varchar(50), " +
          "name varchar(50), " +
          "permission varchar(50), " +
          "size tinyint(1), " +
          "rearm tinyint(1), " +
          "refuel int(11), " +
          "repair int(11), " +
          "sector varchar(50), " +
          "x decimal(10,2), " +
          "y decimal(10,2), " +
          "z decimal(10,2) " +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table pos_inventory (" +
          "generation int(11), " +
          "posid varchar(50), " +
          "itemgroup varchar(50), " +
          "name varchar(50), " +
          "price int(11), " +
          "amount int(11) " +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table pos_inventory_changes (" +
          "generation int(11), " +
          "posid varchar(50), " +
          "name varchar(50), " +
          "stat varchar(50), " +
          "oldValue int(11), " +
          "newValue int(11) " +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table sector_links (" +
          "generation int(11), " +
          "sector1 varchar(50), " +
          "sector2 varchar(50) " +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table sector_link_changes (" +
          "generation int(11), " +
          "sector1 varchar(50), " +
          "sector2 varchar(50), " +
          "isActive tinyint(1) " +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table beacons (" +
          "generation int(11), " +
          "sector varchar(50), " +
          "status tinyint(1) " +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table beacon_changes (" +
          "generation int(11), " +
          "sector varchar(50), " +
          "oldStatus tinyint(1), " +
          "newStatus tinyint(1) " +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table missions (" +
          "generation int(11), " +
          "faction varchar(50), " +
          "text text, " +
          "complete  decimal(10,2)" +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
      connection.query(
        "create table mission_changes (" +
          "generation int(11), " +
          "faction varchar(50), " +
          "stat varchar(50), " +
          "oldValue text, " +
          "newValue text " +
          ") ",
        (err, result, fields) => {
          if (err) {
            return console.log(err);
          }
          return console.log(result);
        }
      );
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async dropTables() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query("drop table timelog");
      await connection.query("drop table pilots");
      await connection.query("drop table pilot_changes");
      await connection.query("drop table inventory");
      await connection.query("drop table inventory_changes");
      await connection.query("drop table pos");
      await connection.query("drop table pos_inventory");
      await connection.query("drop table pos_inventory_changes");
      await connection.query("drop table sector_links");
      await connection.query("drop table sector_link_changes");
      await connection.query("drop table beacons");
      await connection.query("drop table beacon_changes");
      await connection.query("drop table missions");
      await connection.query("drop table mission_changes");
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }

  async addNewGeneration(timestamp) {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      connection.query(`update timelog set generation = generation + 1`);
      connection.query(`update pilots set generation = generation + 1`);
      connection.query(`update pilot_changes set generation = generation + 1`);
      connection.query(`update inventory set generation = generation + 1`);
      connection.query(
        `update inventory_changes set generation = generation + 1`
      );
      connection.query(`update pos set generation = generation + 1`);
      connection.query(`update pos_inventory set generation = generation + 1`);
      connection.query(
        `update pos_inventory_changes set generation = generation + 1`
      );
      connection.query(`update sector_links set generation = generation + 1`);
      connection.query(
        `update sector_link_changes set generation = generation + 1`
      );
      connection.query(`update beacons set generation = generation + 1`);
      connection.query(`update beacon_changes set generation = generation + 1`);
      connection.query(`update missions set generation = generation + 1`);
      connection.query(
        `update mission_changes set generation = generation + 1`
      );
      connection.query(
        `insert into timelog (generation, time) values (0,?)`,
        timestamp
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async deleteChanges(gen) {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query(
        "delete from pilot_changes where generation > ?",
        gen
      );
      await connection.query(
        "delete from inventory_changes where generation > ?",
        gen
      );
      await connection.query(
        "delete from beacon_changes where generation > ?",
        gen
      );
      await connection.query(
        "delete from mission_changes where generation > ?",
        gen
      );
      await connection.query(
        "delete from pos_inventory_changes where generation > ?",
        gen
      );
      await connection.query(
        "delete from sector_link_changes where generation > ?",
        gen
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }

  async getCurrentTS() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      let rows = await connection.query(
        `SELECT time from timelog order by Generation ASC Limit 1`
      );
      await connection.query("COMMIT");
      if (rows.length > 0) return rows[0].time;
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async getBeaconUsers() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      let rows = await connection.query(
        `SELECT distinct callsign from pilot_changes where generation <= 25`
      );
      await connection.query("COMMIT");
      return rows;
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }

  async insertPilot(pilots) {
    let values = [];
    for await (let rows of pilots) {
      let pilot = rows.data;
      //catch unconsitencies of user.json
      if (pilot.number_launches >= 4294967294) pilot.number_launches = 0;
      values.push([
        0,
        pilot.updated_time,
        pilot.callsign,
        pilot.online,
        pilot.is_docked,
        pilot.squad,
        pilot.rank,
        pilot.experience,
        pilot.faction,
        pilot.registration,
        pilot.rating_solrain,
        pilot.rating_quantar,
        pilot.rating_octavius,
        pilot.rating_amanath,
        pilot.rating_hyperial,
        pilot.solrain_kills,
        pilot.octavian_kills,
        pilot.quantar_kills,
        pilot.credits,
        pilot.shots_hit,
        pilot.shots_fired,
        pilot.missiles_hit,
        pilot.missiles_fired,
        pilot.missions_completed,
        pilot.missions_flown,
        pilot.conflux_kills,
        pilot.deaths,
        pilot.pure_mined,
        pilot.artyfacts_found,
        pilot.beacon_captured,
        pilot.bounty_collected,
        pilot.number_launches,
        pilot.number_landing,
        pilot.disconnects,
        pilot.time_ingame,
      ]);
    }
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query(
        "insert into pilots (" +
          "generation, " +
          "updated_time, " +
          "callsign, " +
          "isOnline, " +
          "isDocked, " +
          "squad, " +
          "level, " +
          "experience, " +
          "faction, " +
          "registration, " +
          "ratingSolrain, " +
          "ratingOctavius, " +
          "ratingQuantar, " +
          "RatingAmananth, " +
          "ratingHyperial, " +
          "killsSolrain, " +
          "killsOctavius, " +
          "killsQuantar, " +
          "credits, " +
          "shotsHit, " +
          "shotsFired, " +
          "missilesHit, " +
          "missilesFired, " +
          "missionsCompleted, " +
          "missionsFlown, " +
          "confluxKills, " +
          "deaths, " +
          "pures, " +
          "artifacts, " +
          "beacons, " +
          "bounty, " +
          "launches, " +
          "landings, " +
          "disconnects, " +
          "played" +
          ") values ?",
        [values]
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async insertInventory(items) {
    let values = [];
    for await (let item of items) {
      values.push([
        0,
        item.item_id,
        item.station_name,
        item.group_name,
        item.name,
        item.price,
        item.amount,
        item.produce,
      ]);
    }
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query(
        "insert into inventory (generation, id, station, itemgroup, name, price, amount, produce) values ?",
        [values]
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async insertSectorLinks(links) {
    let values = [];
    for await (const link of links) {
      values.push([0, link[0], link[1]]);
    }
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query(
        "insert into sector_links (generation, sector1, sector2) values ?",
        [values]
      );

      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async insertBeacons(sectors) {
    let values = [];
    for await (const sector of sectors) {
      values.push([0, sector.name, sector.beacon]);
    }
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query(
        "insert into beacons (generation, sector, status) values ?",
        [values]
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async insertMissions(missions) {
    let values = [];
    for await (const [faction, val] of Object.entries(missions)) {
      values.push([0, faction, val.text, val.complete]);
    }
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query(
        "insert into missions (generation, faction, text, complete) values ?",
        [values]
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async insertPos(allPos) {
    let posValues = [];
    let posInventoryValues = [];
    for await (let tmp of allPos) {
      let pid = tmp[0];
      let p = tmp[1];
      let pos = tmp[2];
      posValues.push([
        0,
        pid,
        p.name,
        p.premission,
        pos.size,
        pos.rearm / 1000,
        pos.refuel / 1000,
        pos.repair,
        pos.sector,
        pos.x,
        pos.y,
        pos.z,
      ]);
      if (pos.market.length > 0) {
        for await (const item of pos.market) {
          posInventoryValues.push([
            0,
            pid,
            item.type,
            item.name,
            item.price,
            item.amount,
          ]);
        }
      }
    }
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query(
        "insert into pos (generation, posid, name, permission, size, rearm, refuel, repair, sector, x, y, z) values ?",
        [posValues]
      );
      await connection.query(
        "insert into pos_inventory (generation, posid, itemgroup, name, price, amount) values ?",
        [posInventoryValues]
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }

  async insertPilotChanges(changes) {
    let values = [];
    for await (let change of changes) {
      values.push([0, change[0], change[1], change[2], change[3]]);
    }
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");

      await connection.query(
        "insert into pilot_changes (generation, callsign, stat, newValue, oldValue) values ?",
        [values]
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async insertInventoryChanges(changes) {
    let values = [];
    for await (let change of changes) {
      values.push([0, change[0], change[1], change[2], change[3], change[4]]);
    }
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");

      await connection.query(
        "insert into inventory_changes (generation, station, name, stat, newValue, oldValue) values ?",
        [values]
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async insertSectorLinksChanges(changes) {
    let values = [];
    for await (let change of changes) {
      values.push([0, change[0], change[1], change[2]]);
    }
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query(
        "insert into sector_link_changes (generation, sector1, sector2, isActive) values ?",
        [values]
      );

      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async insertBeaconChanges(changes) {
    let values = [];
    for await (let change of changes) {
      values.push([0, change[0], change[1], change[2]]);
    }
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");

      await connection.query(
        "insert into beacon_changes (generation, sector, newStatus, oldStatus) values (0,?,?,?)",
        [values]
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async insertMissionChanges(changes) {
    let values = [];
    for await (let change of changes) {
      values.push([0, change[0], change[1], change[2], change[3]]);
    }
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query(
        "insert into mission_changes (generation, faction, stat, newValue, oldValue) values (0,?,?,?,?)",
        [values]
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async insertPosInventoryChanges(changes) {
    let values = [];
    for await (let change of changes) {
      values.push([0, change[0], change[1], change[2], change[3], change[4]]);
    }
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query(
        "insert into pos_inventory_changes (generation, posid, name, stat, newValue, oldValue) values ?",
        [values]
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }

  async getPilotsToCompare() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      let rows = await connection.query(
        `SELECT * from pilots order by callsign, generation asc`
      );
      await connection.query("COMMIT");
      return rows;
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async getInventoryToCompare() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      let rows = await connection.query(
        `SELECT * from inventory order by id, station, generation asc`
      );
      await connection.query("COMMIT");
      return rows;
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async getSectorLinksToCompare() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      let rows = await connection.query(
        `SELECT * from sector_links order by sector1, sector2, generation asc`
      );
      await connection.query("COMMIT");
      return rows;
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async getBeaconsToCompare() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      let rows = await connection.query(
        `SELECT * from beacons order by sector, generation asc`
      );
      await connection.query("COMMIT");
      return rows;
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async getPosInventoryToCompare() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      let rows = await connection.query(
        `SELECT * from pos_inventory order by posid, name, generation asc`
      );
      await connection.query("COMMIT");
      return rows;
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async getMissionsToCompare() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      let rows = await connection.query(
        `SELECT * from missions order by faction, generation asc`
      );
      await connection.query("COMMIT");
      return rows;
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }

  async deleteOldPilotProfile(callsign) {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query(
        "delete from pilots where callsign = ? and generation > 0",
        callsign
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async deleteOldInventory() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query("delete from inventory where generation > 0");
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async deleteOldBeacons() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query("delete from beacons where generation > 0");
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async deleteOldSectorLinks() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query("delete from sector_links where generation > 0");
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async deleteOldMissions() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query("delete from missions where generation > 0");
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async deleteOldPosData() {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      await connection.query("delete from pos where generation > 0");
      await connection.query("delete from pos_inventory where generation > 0");
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
}

export { DatabaseHandler };
