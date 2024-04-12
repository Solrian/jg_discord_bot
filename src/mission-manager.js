class MissionManager {
  isUpdating = false;
  constructor(josshApiHandler, databaseHandler) {
    this.name = "MissionManager";
    this.josshApiHandler = josshApiHandler;
    this.databaseHandler = databaseHandler;
  }
  async initializeMissions() {
    this.isUpdating = true;
    console.log("updating initial missions.");
    let missions = await this.josshApiHandler.getMissions();
    await this.databaseHandler.insertMissions(missions);
    console.log("updating initial missions. - done");
    this.isUpdating = false;
  }
  async updateMissions() {
    this.isUpdating = true;
    console.log("updating missions.");
    let missions = await this.josshApiHandler.getMissions();
    await this.databaseHandler.insertMissions(missions);
    missions = await this.databaseHandler.getMissions();
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
    await this.databaseHandler.insertMissionChanges(changes);
    await this.databaseHandler.deleteMissions();
    console.log("updating missions. - done");
    this.isUpdating = false;
  }
}

export { MissionManager };
