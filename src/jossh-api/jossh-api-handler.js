import axios from "axios";
import EventEmitter from "events";

const minTimeout = 20000;
let lastMissionsTS;
let currentMissionsTS;
const eventEmitter = new EventEmitter();

class JosshApiHandler {
  constructor() {
    this.name = "JosshApiHandler";
    this.updateFoundEvent = eventEmitter;
    checkForUpdate();
  }
  async getCurrentTS() {
    return await getMissionsTS();
  }
  async getUserProfile(callsign) {
    try {
      let url =
        "http://jumpgate-tri.org/jossh-api/user-profile/" + callsign + ".json";
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.status + " " + callsign);
        return await getPilotProfile(callsign);
      }
    }
  }
  async getAllUsers() {
    try {
      let url = "http://jumpgate-tri.org/jossh-api/all-users.json";
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return console.error(error);
    }
  }
  async getStationsInventory() {
    try {
      let url = "http://jumpgate-tri.org/jossh-api/stations-inventory.json";
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return console.error(error);
    }
  }
  async getPosList() {
    try {
      let url = "http://jumpgate-tri.org/jossh-api/pos-list.json";
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return console.error(error);
    }
  }
  async getPos(posUrl) {
    try {
      let url = "http://jumpgate-tri.org" + posUrl;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return console.error(error);
    }
  }
  async getMap() {
    try {
      let url = "http://jumpgate-tri.org/jossh-api/map.json";
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return console.error(error);
    }
  }
  async getMissions() {
    try {
      let url = "http://jumpgate-tri.org/jossh-api/missions.json";
      const { data } = await axios.get(url);
      return data.missions;
    } catch (error) {
      return console.error(error);
    }
  }
}

async function checkForUpdate() {
  let timeout = minTimeout;
  let startTS = Date.now();
  let missionsTS = await getMissionsTS();
  if (missionsTS != null) currentMissionsTS = missionsTS;
  if (lastMissionsTS == null || lastMissionsTS != currentMissionsTS) {
    if (lastMissionsTS != null) timeout = 360000;
    lastMissionsTS = currentMissionsTS;
    eventEmitter.emit("newtimestamp");
  }
  timeout = timeout - (Date.now() - startTS);
  if (timeout < minTimeout) timeout = minTimeout;
  console.log("next check in: " + timeout + "ms");
  setTimeout(checkForUpdate, timeout);
}
async function getMissionsTS() {
  try {
    let url = "http://jumpgate-tri.org/jossh-api/missions.json";
    const { data } = await axios.get(url);
    return data.last_update;
  } catch (error) {
    return console.error(error);
  }
}

export { JosshApiHandler };
