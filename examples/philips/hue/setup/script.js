const socket = io("https://192.168.1.44:8443");
socket.on("connect", () => {
  console.log("connection opened");
  socketConnectionContainer.innerText = "connected to server";
});
socket.on("disconnect", () => {
  console.log("connection closed");
  socketConnectionContainer.innerText = "disconnected from server";
});

const socketConnectionContainer = document.getElementById("socketConnection");

const discoverBridgesButton = document.getElementById("discoverBridges");
discoverBridgesButton.addEventListener("click", () => {
  socket.emit("discoverBridges");
});

const bridgeTemplate = document.getElementById("bridgeTemplate");
const bridgesContainer = document.getElementById("bridges");

const lightTemplate = document.getElementById("lightTemplate");

let bridges = [];
socket.on("bridges", (_bridges) => {
  bridges = _bridges;
  bridgesContainer.innerHTML = "";
  bridges.forEach((bridge, bridgeIndex) => {
    const bridgeContainer = bridgeTemplate.content.cloneNode(true).querySelector(".bridge");
    for (const key in bridge) {
      let value = bridge[key];
      if (typeof value == "object") {
        value = JSON.stringify(value);
      }
      const container = bridgeContainer.querySelector(`.${key}`);
      if (container) {
        container.innerText = value;
      }
    }
    if (!bridge.credentials) {
      const credentialsContainer = bridgeContainer.querySelector(`.credentials`);
      credentialsContainer.parentElement.setAttribute("hidden", "");
      const getCredentialsButton = bridgeContainer.querySelector(".getCredentials");
      getCredentialsButton.removeAttribute("hidden");
      getCredentialsButton.addEventListener("click", () => {
        socket.emit("getCredentials", bridge.ip, (credentials) => {
          bridge.credentials = credentials;
          if (credentials) {
            credentialsContainer.parentElement.removeAttribute("hidden");
            credentialsContainer.innerText = JSON.stringify(credentials);
            getCredentialsButton.setAttribute("hidden", "");
          }
        });
      });
    }

    const lightsContainer = bridgeContainer.querySelector(".lightControls");
    const onGroupUpdate = () => {
      lightsContainer.innerHTML = "";
      for (const lightId in bridge.group.lights) {
        const lightContainer = lightTemplate.content.cloneNode(true).querySelector(".light");
        lightContainer.setAttribute("value", lightId);

        lightContainer.querySelector(".name").innerText = bridge.lights[lightId].name;
        lightContainer.querySelector("input").addEventListener("input", (event) => {
          const value = event.target.value;
          const rgb = htmlColorToRgbArray(value);
          socket.emit("setLights", {
            lights: [
              {
                bridgeId: bridgeIndex,
                lightId,
                color: rgb,
              },
            ],
          });
        });
        lightsContainer.appendChild(lightContainer);
      }
    };

    if (bridge.group) {
      onGroupUpdate();

      const groupContainer = bridgeContainer.querySelector(".group");
      const getGroupButton = bridgeContainer.querySelector(".getGroup");
      getGroupButton.removeAttribute("hidden");
      getGroupButton.addEventListener("click", () => {
        socket.emit("getGroup", bridge.ip, (group) => {
          bridge.group = group;
          if (group) {
            groupContainer.parentElement.removeAttribute("hidden");
            groupContainer.innerText = JSON.stringify(group);
            onGroupUpdate();
          }
        });
      });
    }
    bridgesContainer.appendChild(bridgeContainer);
  });
});

// thanks ChatGPT
function htmlColorToRgbArray(htmlColor) {
  // Remove the '#' symbol if present
  htmlColor = htmlColor.replace("#", "");

  // Parse the hexadecimal color values
  const red = parseInt(htmlColor.substring(0, 2), 16);
  const green = parseInt(htmlColor.substring(2, 4), 16);
  const blue = parseInt(htmlColor.substring(4, 6), 16);

  // Create and return the RGB array
  return [red, green, blue];
}
