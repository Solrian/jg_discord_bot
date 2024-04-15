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
  async getUserProfiles(callsigns) {
    let tmp;
    let urls = [];
    let retVal;
    let count = 0;
    while (callsigns.length > 0) {
      let callsign = callsigns.shift();
      urls.push(
        "http://jumpgate-tri.org/jossh-api/user-profile/" + callsign + ".json"
      );
      count++;
      if (count == 10) {
        const requests = urls.map((url) => axios.get(url));
        count = 0;
        urls = [];
        try {
          const data = await axios.all(requests);
          retVal = retVal + data;
        } catch (error) {
          console.log(error);
        }
      }
    }
    return retVal;
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
  async getPosAll(posUrls) {
    let urls = [];
    for await (let posUrl of posUrls) {
      urls.push("http://jumpgate-tri.org" + posUrl);
    }
    const requests = urls.map((url) => axios.get(url));
    try {
      const data = await axios.all(requests);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async getPos(pid, pos) {
    try {
      let url = "http://jumpgate-tri.org" + pos.url;
      const { data } = await axios.get(url);
      return [pid, pos, data];
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
