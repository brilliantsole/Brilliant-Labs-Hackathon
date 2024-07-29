var express = require("express");
var https = require("https");
var http = require("http");
const { Server } = require("socket.io");
var fs = require("fs");
const Phea = require("./phea/phea");
const mdns = require("mdns");
const _ = require("lodash");
const ip = require("ip");

var app = express();

process.on("SIGINT", () => {
  // Stop example with ctrl+c
  console.log("SIGINT Detected. Shutting down...");
  bridges.forEach((bridge, index) => {
    const _bridge = _bridges[bridge.id];
    if (_bridge) {
      console.log(`stopping bridge #${index}...`);
      _bridge.stop();
      console.log(`stopped bridge #${index}`);
    }
  });
});

let philipsHueBridgesInformation;
async function getPhilipsHueBridgesInformation() {
  try {
    const data = await fs.promises.readFile("philips-hue-bridges-information.json", "utf8");
    philipsHueBridgesInformation = JSON.parse(data);
    console.log("philipsHueBridgesInformation", philipsHueBridgesInformation);
  } catch (error) {
    console.error("Error getting philips hue bridges information:", error);
    // throw error;
  }
}
async function _savePhilipsHueBridgesInformation() {
  try {
    console.log("save philipsHueBridgesInformation", philipsHueBridgesInformation);
    await fs.promises.writeFile(
      "philips-hue-bridges-information.json",
      JSON.stringify(philipsHueBridgesInformation, null, 2),
      "utf8"
    );
    console.log("bridge information saved successfully.");
  } catch (error) {
    console.error("Error saving bridge information:", error);
    // throw error;
  }
}
const savePhilipsHueBridgesInformation = _.debounce(async function () {
  await _savePhilipsHueBridgesInformation();
}, 500);

const bridges = [];
const _bridges = {};

function discoverBridges() {
  const browser = mdns.createBrowser(mdns.tcp("hue"));
  browser.on("serviceUp", (service) => {
    console.log("Found a Philips Hue bridge:", service);
    const { name, txtRecord } = service;
    const { bridgeid, modelid } = txtRecord;
    const ip = service.addresses[service.addresses.length - 1];
    const discoveredBridge = { name, id: bridgeid, ip };
    onDiscoverdBridge(discoveredBridge);
  });

  browser.on("error", (error) => {
    console.error("Error while discovering Philips Hue bridges:", error);
  });

  browser.start();
}

function onDiscoverdBridge(discoveredBridge) {
  const { name, id, ip } = discoveredBridge;
  if (!philipsHueBridgesInformation[id]) {
    philipsHueBridgesInformation[id] = {};
  }
  const { credentials, group } = philipsHueBridgesInformation[id];
  let bridge = bridges.find((bridge) => bridge.id == id);
  if (bridge) {
    return;
  }
  bridge = {
    name,
    id,
    ip,
    credentials,
    group,
  };
  bridges.push(bridge);
  if (bridge.credentials) {
    onBridgeCredentials(bridge);
  }
  io.emit("bridges", bridges);
}

async function onBridgeCredentials(bridge) {
  try {
    const _bridge = await Phea.bridge({
      ...bridge.credentials,
      address: bridge.ip,
    });
    console.log("got bridge", _bridge);
    _bridges[bridge.id] = _bridge;
    onBridgeConnection(bridge);
  } catch (error) {
    console.log("failed getting bridge", error);
  }
}

async function onBridgeConnection(bridge) {
  await getBridgeGroup(bridge);
  await getBridgeLights(bridge);
  await startBridge(bridge);
}

async function getBridgeLights(bridge, overwrite = false) {
  if (!bridge.lights || overwrite) {
    const _bridge = _bridges[bridge.id];
    const bridgeInformation = philipsHueBridgesInformation[bridge.id];
    console.log(`getting lights for bridge ${bridge.id}...`);
    const lights = await _bridge.getLights();
    console.log("got lights", lights);
    bridge.lights = {};
    for (const lightId in lights) {
      const { name } = lights[lightId];
      const light = { name };
      const _light = bridgeInformation?.lights?.[lightId];
      if (_light) {
        const { position } = _light;
        light.position = position;
      }
      bridge.lights[lightId] = light;
    }
    bridgeInformation.lights = bridge.lights;
    await savePhilipsHueBridgesInformation();
  }
}
async function getBridgeGroup(bridge, overwrite = false) {
  if (!bridge.group || overwrite) {
    const _bridge = _bridges[bridge.id];
    const bridgeInformation = philipsHueBridgesInformation[bridge.id];
    console.log(`getting groups for bridge ${bridge.id}...`);
    const groups = await _bridge.getGroup(0); // 0 will fetch all groups.
    console.log("got groups", groups);
    for (const groupId in groups) {
      const group = groups[groupId];
      if (group.type == "Entertainment") {
        console.log("found Entertainment group", group);
        const lights = {};
        group.lights.forEach((lightId) => {
          lights[lightId] = {};
        });
        const groupInformation = {
          id: groupId,
          lights,
        };
        bridgeInformation.group = bridge.group = groupInformation;
        await savePhilipsHueBridgesInformation();
        break;
      }
    }
  }
}

async function startBridge(bridge) {
  const _bridge = _bridges[bridge.id];
  if (_bridge && bridge.group?.id) {
    try {
      console.log(`starting bridge ${bridge.id}...`);
      await _bridge.start(bridge.group.id);
      console.log("started bridge");
    } catch (error) {
      console.log("error starting bridge", error);
      if (/DTLS handshake timed out/gi.test(error?.message)) {
        //A connection is most probably still alive for this group
        //This can happen if you hot reload your server without
        //giving enought time to the bridge to timeout the connection
        //You may want to wait a little and try to connect again if
        //you endup here
      }
    }
  }
}

async function setupBridges() {
  bridges.length = 0;
  await getPhilipsHueBridgesInformation();
  if (!philipsHueBridgesInformation) {
    console.log("no philips hue bridges information");
    philipsHueBridgesInformation = {};
    await savePhilipsHueBridgesInformation();
  }

  discoverBridges();
}
setupBridges();

var serverOptions = {
  key: fs.readFileSync("./sec/key.pem"),
  cert: fs.readFileSync("./sec/cert.pem"),
};

app.use(function (req, res, next) {
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("x-frame-options", "same-origin");

  next();
});

const httpServer = http.createServer(app);
httpServer.listen(82);
const httpsServer = https.createServer(serverOptions, app);
httpsServer.listen(445, () => {
  console.log(`server listening on https://${ip.address()}:${httpServer.address().port}`);
});

const io = new Server(httpsServer, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("new client");

  socket.emit("bridges", bridges);

  socket.on("discoverBridges", () => setupBridges());

  socket.on("getCredentials", async (ip, response) => {
    const bridge = bridges.find((bridge) => bridge.ip == ip);
    let credentials;
    if (bridge) {
      try {
        credentials = await Phea.register(ip);
        if (credentials) {
          console.log("successfully got credentials", credentials);
          bridge.credentials = credentials;
          onBridgeCredentials(bridge);
          philipsHueBridgesInformation[bridge.id].credentials = credentials;
          savePhilipsHueBridgesInformation();
        }
      } catch (error) {
        if (error instanceof Promise) {
          error = await error;
        }
        console.log("error getting credentials", error);
      }
    }
    response(credentials);
  });
  socket.on("getGroup", async (ip, response) => {
    const bridge = bridges.find((bridge) => bridge.ip == ip);
    if (bridge) {
      await getBridgeGroup(bridge, true);
    }
    response(bridge.group);
  });
  socket.on("getLights", async (ip, response) => {
    const bridge = bridges.find((bridge) => bridge.ip == ip);
    if (bridge) {
      await getBridgeLights(bridge, true);
    }
    response(bridge.lights);
  });

  socket.on("setLights", async (message) => {
    const { lights } = message;

    let didUpdatePosition = false;
    lights.forEach(({ bridgeId, lightId, color, position }) => {
      const bridge = bridges[bridgeId];

      if (bridge) {
        if (color) {
          const _bridge = _bridges[bridge.id];
          if (_bridge) {
            //console.log(`setting ${bridgeId}:${lightId} light to ${color}...`);
            _bridge.transition(lightId, color);
          }
        }

        if (position) {
          //console.log(`setting ${bridgeId}:${lightId} position to ${position}...`);
          bridge.lights[lightId].position = position;
          philipsHueBridgesInformation[bridge.id].lights[lightId].position = position;
          didUpdatePosition = true;
        }
      }
    });
    if (didUpdatePosition) {
      await savePhilipsHueBridgesInformation();
      //socket.emit("bridges", bridges);
    }
  });

  socket.on("lights", (message) => {
    const { lights } = message;
    lights.forEach(({ light: lightIndex, bridge: bridgeIndex, color }) => {
      const bridge = bridges[bridgeIndex];
      if (bridge) {
        // console.log(
        //   `setting light #${lightIndex} of bridge #${bridgeIndex} to ${color}...`
        // );
        bridge.transition(lightIndex, color);
      }
    });
  });
  socket.on("disconnect", () => {
    console.log("client left");
  });
});
