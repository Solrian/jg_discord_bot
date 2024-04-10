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
      let rows = await connection.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = '${process.env.SQL_DB}'`
      );
      console.log(rows);
      await connection.query("COMMIT");
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
          "callsign varchar(25), " +
          "isOnline tinyint(1), " +
          "isDocked tinyint(1), " +
          "squad varchar(25), " +
          "level int(11), " +
          "experience int(11), " +
          "faction varchar(25), " +
          "registration varchar(25), " +
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
          "callsign varchar(25), " +
          "stat varchar(25), " +
          "oldValue varchar(25), " +
          "newValue varchar(25) " +
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
          "station varchar(25), " +
          "itemgroup varchar(25), " +
          "name varchar(25), " +
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
          "station varchar(25), " +
          "name varchar(25), " +
          "stat varchar(25), " +
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
      connection.query(
        `insert into timelog (generation, time) values (0,'` + timestamp + `')`
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
  async insertPilotProfile(pilot) {
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
          ") values (0," +
          "'" +
          pilot.updated_time +
          "'," +
          "'" +
          pilot.callsign +
          "'," +
          pilot.online +
          "," +
          pilot.is_docked +
          "," +
          "'" +
          pilot.squad +
          "'," +
          pilot.rank +
          "," +
          pilot.experience +
          "," +
          "'" +
          pilot.faction +
          "'," +
          "'" +
          pilot.registration +
          "'," +
          pilot.rating_solrain +
          "," +
          pilot.rating_quantar +
          "," +
          pilot.rating_octavius +
          "," +
          pilot.rating_amanath +
          "," +
          pilot.rating_hyperial +
          "," +
          pilot.solrain_kills +
          "," +
          pilot.octavian_kills +
          "," +
          pilot.quantar_kills +
          "," +
          pilot.credits +
          "," +
          pilot.shots_hit +
          "," +
          pilot.shots_fired +
          "," +
          pilot.missiles_hit +
          "," +
          pilot.missiles_fired +
          "," +
          pilot.missions_completed +
          "," +
          pilot.missions_flown +
          "," +
          pilot.conflux_kills +
          "," +
          pilot.deaths +
          "," +
          pilot.pure_mined +
          "," +
          pilot.artyfacts_found +
          "," +
          pilot.beacon_captured +
          "," +
          pilot.bounty_collected +
          "," +
          pilot.number_launches +
          "," +
          pilot.number_landing +
          "," +
          pilot.disconnects +
          "," +
          "'" +
          pilot.time_ingame +
          "'" +
          `)`
      );
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async getProfilesToCompare(callsign) {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      let rows = await connection.query(
        `select * from pilots a where a.callsign = "` +
          callsign +
          `"` +
          ` and (a.generation = (select min(generation) from pilots b where a.callsign = b.callsign and b.generation >= 1) or a.generation = 0) order by a.generation asc`
      );
      await connection.query("COMMIT");
      if (rows.length == 2) return rows;
    } catch (err) {
      await connection.query("ROLLBACK");
      if (err) console.error(err);
    } finally {
      await connection.release();
    }
  }
  async insertPilotChanges(callsign, changes) {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      for await (let change of changes) {
        await connection.query(
          "insert into pilot_changes (generation, callsign, stat, oldValue, newValue) values (0, '" +
            callsign +
            "','" +
            change[0] +
            "','" +
            change[1] +
            "','" +
            change[2] +
            "')"
        );
      }
      await connection.query("COMMIT");
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
        "delete from pilots where callsign = '" +
          callsign +
          "' and generation <> (select min(b.generation) from pilots as b where b.callsign = callsign)"
      );
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
