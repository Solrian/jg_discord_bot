import mysql from "./mysql.js";
import { config } from "dotenv";
config();

class DatabaseHandler {
  constructor() {
    this.name = "DatabaseHandler";
  }

  async Test(timespan) {
    const connection = await mysql.connection();
    try {
      await connection.query("START TRANSACTION");
      let rows = await connection.query(
        `Select max(generation) as gen from timelog where time > (now() - interval ${timespan})`
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
          "played decimal(10,0) " +
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

  AddNewGeneration() {
    this.pool.query(
      "Insert into timelog (generation) values (0)",
      function (err, results) {
        if (err) console.error(err);
      }
    );
  }

  async SelectMaxGeneration(timespan) {
    this.pool.query(
      `Select max(generation) as gen from timelog where time > (now() - interval ${timespan})`,
      function (err, results) {
        if (err) {
          console.error(err);
          return null;
        }
        if (results != null) {
          console.log(results[0].gen);
          return results[0].gen;
        }
      }
    );
  }
  InsertIntoTimelog() {}
}

export { DatabaseHandler };
