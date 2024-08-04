import Frame from "../../../lib/brilliantlabs/frame/Frame.js";

const frame = new Frame();
window.frame = frame;
console.log(frame);

const connectButton = document.getElementById("connect");
connectButton.addEventListener("click", () => {
  frame.connect();
});
const disconnectButton = document.getElementById("disconnect");
disconnectButton.addEventListener("click", () => {
  frame.disconnect();
});
function updateConnectButtons() {
  connectButton.disabled = frame.isConnected;
  disconnectButton.disabled = !frame.isConnected;
  runLuaButton.disabled = !frame.isConnected;
  textInput.disabled = !frame.isConnected;
}
frame.addEventListener("connected", () => {
  updateConnectButtons();
});
frame.addEventListener("disconnected", () => {
  updateConnectButtons();
});

let commands = [];
let commandIndex = -1;
if (localStorage.getItem("commands")) {
  commands = JSON.parse(localStorage.getItem("commands"));
  commandIndex = commands.length;
  console.log("commands", commands);
}

const runLuaButton = document.getElementById("runLua");
/** @type {HTMLInputElement} */
const luaInput = document.getElementById("lua");
luaInput.addEventListener("keypress", (event) => {
  if (event.key == "Enter" && !event.shiftKey) {
    runLuaButton.click();
    setTimeout(() => {
      luaInput.value = "";
    }, 0);
  }
});
runLuaButton.addEventListener("click", () => {
  if (luaInput.value.length == 0) {
    return;
  }
  const command = luaInput.value;
  console.log({ command });
  commands.push(command);
  localStorage.setItem("commands", JSON.stringify(commands));
  commandIndex = commands.length;
  frame.sendString(command);
  luaInput.value = "";
});

luaInput.addEventListener("keydown", (event) => {
  let newCommandIndex = commandIndex;
  switch (event.key) {
    case "ArrowUp":
      newCommandIndex--;
      break;
    case "ArrowDown":
      newCommandIndex++;
      break;
    default:
      return;
  }
  event.preventDefault();
  newCommandIndex = Math.max(0, Math.min(commands.length, newCommandIndex));
  console.log({ newCommandIndex });
  if (newCommandIndex == commandIndex) {
    return;
  }
  commandIndex = newCommandIndex;
  console.log({ commandIndex });
  setCommand(commandIndex);
});

function setCommand(commandIndex) {
  const command = commands[commandIndex];
  if (!command) {
    luaInput.value = "";
    return;
  }
  console.log("setting command", command);
  luaInput.focus();
  luaInput.value = "";
  luaInput.value = command;
  luaInput.setSelectionRange(command.length, command.length);
}

let responses = [];
/** @type {HTMLDivElement} */
const responsesContainer = document.getElementById("responses");
frame.addEventListener("response", (event) => {
  addResponse(event.message.response, Date.now(), true);
});
function addResponse(message, time, save = false) {
  if (save) {
    responses.push({ time, message });
    localStorage.setItem("responses", JSON.stringify(responses));
  }
  const responseContainer = document.createElement("div");
  responseContainer.innerText = `[${new Date(time).toLocaleTimeString()}]: ${message}`;
  responsesContainer.appendChild(responseContainer);
  responsesContainer.scrollTo(0, -responsesContainer.scrollHeight);
}

frame.addEventListener("devices", (event) => {
  const devices = event.message.devices;
  console.log("devices", devices);
  const device = devices[0];
  if (device) {
    frame.connectToDevice(device);
  }
});
frame.getDevices();

if (localStorage.getItem("responses")) {
  responses = JSON.parse(localStorage.getItem("responses"));
  console.log(responses);
  responses.forEach((response) => addResponse(response.message, response.time));
}

const samplesContainer = document.getElementById("samples");
const samples = {
  "write+display text": `frame.display.text('Hello world', 50, 100)\nframe.display.show()`,
  "write text": `frame.display.text('Hello world', 50, 100)`,
  "show text": `frame.display.show()`,
  "clear text": `frame.display.text(" ", 50, 100);frame.display.show()`,
};
Object.entries(samples).forEach(([label, script]) => {
  const sampleButton = document.createElement("button");
  sampleButton.innerText = label;
  sampleButton.addEventListener("click", (event) => {
    if (event.shiftKey && luaInput.value.length > 0) {
      luaInput.value += `\n${script}`;
    } else {
      luaInput.value = script;
    }
  });
  samplesContainer.appendChild(sampleButton);
});

const batteryLevelContainer = document.getElementById("batteryLevel");
frame.addEventListener("batteryLevel", (event) => {
  batteryLevelContainer.innerText = `${event.message.batteryLevel}%`;
});
frame.addEventListener("connected", () => frame.getBatteryLevel());

const clearHistoryButton = document.getElementById("clear");
clearHistoryButton.addEventListener("click", () => {
  responses.length = 0;
  localStorage.setItem("responses", JSON.stringify(responses));
  commands.length = 0;
  commandIndex = 0;
  localStorage.setItem("commands", JSON.stringify(commands));

  responsesContainer.innerHTML = "";
});

let textX = 50;
const textXInput = document.getElementById("textX");
const textXSpan = document.getElementById("textXSpan");
textXSpan.innerText = textX;
textXInput.value = textX;
textXInput.addEventListener("input", (event) => {
  textX = Number(event.target.value);
  console.log({ textX });
  textXSpan.innerText = textX;
  writeText();
});

let textY = 200;
const textYInput = document.getElementById("textY");
const textYSpan = document.getElementById("textYSpan");
textYInput.value = textY;
textYSpan.innerText = textY;
textYInput.addEventListener("input", (event) => {
  textY = Number(event.target.value);
  console.log({ textY });
  textYSpan.innerText = textY;
  writeText();
});

let textSpacing = 16;
const textSpacingInput = document.getElementById("textSpacing");
const textSpacingSpan = document.getElementById("textSpacingSpan");
textSpacingSpan.innerText = textSpacing;
textSpacingInput.value = textSpacing;
textSpacingInput.addEventListener("input", (event) => {
  textSpacing = Number(event.target.value);
  console.log({ textSpacing });
  textSpacingSpan.innerText = textSpacing;
  writeText();
});

let textColor = frame.colors[1];
const textColorSelect = document.getElementById("textColor");
textColorSelect.addEventListener("input", (event) => {
  textColor = event.target.value;
  console.log({ textColor });
  writeText();
});
frame.colors.forEach((color) => {
  if (color == "VOID") {
    return;
  }
  const textColorOption = new Option(color);
  textColorSelect.appendChild(textColorOption);
});

/** @type {HTMLInputElement} */
const textInput = document.getElementById("text");
textInput.addEventListener("input", () => {
  writeText();
});

function writeText() {
  const command = `frame.display.text('${
    textInput.value || " "
  }', ${textX}, ${textY}, {color='${textColor}', spacing=${textSpacing}});frame.display.show()`;
  luaInput.value = command;
  runLuaButton.click();
}

function throttle(mainFunction, delay) {
  let timerFlag = null; // Variable to keep track of the timer
  let lastArgs = null; // Variable to store the latest arguments

  // Returning a throttled version
  return (...args) => {
    lastArgs = args; // Store the latest arguments

    if (timerFlag === null) {
      // If there is no timer currently running
      timerFlag = setTimeout(() => {
        // Execute the main function with the latest arguments after the delay
        mainFunction(...lastArgs);

        // Clear the timerFlag to allow the main function to be executed again
        timerFlag = null;
      }, delay);
    }
  };
}

writeText = throttle(writeText, 100);
