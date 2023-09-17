import axios from "axios";

const minTimeout = 20000;
let lastMissionsTS;
let newMissionsTS;

class JosshApiHandler {
  constructor() {
    this.name = "JosshApiHandler";
    doInterval();
  }
}

async function doInterval() {
  let timeout = minTimeout;
  let startTS = Date.now();
  let missions = await getMissions();
  if (missions != null) newMissionsTS = missions.last_update;
  if (lastMissionsTS == null || lastMissionsTS != newMissionsTS) {
    if (lastMissionsTS != null) timeout = 359000;
    // Do Updating Stuff here

    lastMissionsTS = newMissionsTS;
  } else {
    console.log("no update found");
  }
  let endTS = Date.now();
  console.log("time needed: " + (endTS - startTS) + "ms");
  timeout = timeout - (endTS - startTS);
  if (timeout < minTimeout) timeout = minTimeout;
  console.log("next interval: " + timeout + "ms");
  setTimeout(doInterval, timeout);
}

async function getMissions() {
  try {
    let url = "http://jumpgate-tri.org/jossh-api/missions.json";
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    return console.error(error);
  }
}

export { JosshApiHandler };
