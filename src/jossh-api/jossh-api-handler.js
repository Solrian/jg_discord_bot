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
  async getPilot(callsign) {
    return await getPilotProfile(callsign);
  }
  async getUsers() {
    return await getAllUsers();
  }
}

async function checkForUpdate() {
  let timeout = minTimeout;
  let startTS = Date.now();
  let missionsTS = await getMissionsTS();
  if (missionsTS != null) currentMissionsTS = missionsTS;
  if (lastMissionsTS == null || lastMissionsTS != currentMissionsTS) {
    if (lastMissionsTS != null) timeout = 359000;
    lastMissionsTS = currentMissionsTS;
    eventEmitter.emit("newdata");
  }
  let endTS = Date.now();
  console.log("time needed: " + (endTS - startTS) + "ms");
  timeout = timeout - (endTS - startTS);
  if (timeout < minTimeout) timeout = minTimeout;
  console.log("next interval: " + timeout + "ms");
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

async function getPilotProfile(callsign) {
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

async function getAllUsers() {
  try {
    let url = "http://jumpgate-tri.org/jossh-api/all-users.json";
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    return console.error(error);
  }
}

export { JosshApiHandler };
