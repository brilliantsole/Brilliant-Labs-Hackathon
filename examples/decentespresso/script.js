import DecentScale from "../../lib/decentexpresso/DecentScale.js";

const decentScale = new DecentScale();

decentScale.addEventListener("connected", () => {
  powerOffButton.disabled = false;

  startTimerButton.disabled = false;
  stopTimerButton.disabled = false;
  resetTimerButton.disabled = false;

  tareButton.disabled = false;
});
decentScale.addEventListener("disconnected", () => {
  powerOffButton.disabled = true;

  startTimerButton.disabled = true;
  stopTimerButton.disabled = true;
  resetTimerButton.disabled = true;

  tareButton.disabled = true;
});

const toggleConnectionButton = document.getElementById("toggleConnectionButton");
toggleConnectionButton.addEventListener("click", async () => {
  toggleConnectionButton.disabled = true;
  toggleConnectionButton.innerText += "ing...";

  try {
    if (decentScale.isConnected) {
      await decentScale.disconnect();
    } else {
      await decentScale.connect();
    }
  } finally {
    toggleConnectionButton.disabled = false;
    toggleConnectionButton.innerText = decentScale.isConnected ? "disconnect" : "connect";
  }
});

const powerOffButton = document.getElementById("powerOffButton");
powerOffButton.addEventListener("click", async () => {
  powerOffButton.disabled = true;
  powerOffButton.innerText = "powering off...";
  try {
    await decentScale.powerOff();
  } finally {
    powerOffButton.innerText = "power off";
    powerOffButton.disabled = true;
  }
});

const firmwareVersionInput = document.getElementById("firmwareVersion");
decentScale.addEventListener("firmwareVersion", () => {
  firmwareVersionInput.value = decentScale.firmwareVersion;
});

const batteryInput = document.getElementById("battery");
decentScale.addEventListener("battery", (event) => {
  batteryInput.value = decentScale.battery;
});

const isUSBInput = document.getElementById("isUSB");
decentScale.addEventListener("isUSB", (event) => {
  isUSBInput.checked = decentScale.isUSB;
});

const tareButton = document.getElementById("tare");
tareButton.addEventListener("click", async () => {
  await decentScale.tare();
});
const weightInput = document.getElementById("weight");
const isStableInput = document.getElementById("isStable");
const timeInput = document.getElementById("time");
decentScale.addEventListener("weight", (event) => {
  const { weight, isStable, change, time } = event.message;
  weightInput.value = weight;
  isStableInput.checked = isStable;
  timeInput.value = time.string;
});

const showWeightInput = document.getElementById("showWeight");
showWeightInput.addEventListener("input", async () => {
  await setLED();
});
const showTimerInput = document.getElementById("showTimer");
showTimerInput.addEventListener("input", async () => {
  await setLED();
});
const weightTypeInput = document.getElementById("weightType");
weightTypeInput.addEventListener("input", async () => {
  await setLED();
});
const setLED = () => {
  decentScale.setLED(showWeightInput.checked, showTimerInput.checked, weightTypeInput.value == "grams");
};

const startTimerButton = document.getElementById("startTimer");
startTimerButton.addEventListener("click", async () => {
  await decentScale.startTimer();
});
const stopTimerButton = document.getElementById("stopTimer");
stopTimerButton.addEventListener("click", async () => {
  await decentScale.stopTimer();
});
const resetTimerButton = document.getElementById("resetTimer");
resetTimerButton.addEventListener("click", async () => {
  await decentScale.resetTimer();
});

const buttonTapsInput = document.getElementById("buttonTaps");
decentScale.addEventListener("buttonTap", (event) => {
  const { button, tap } = event.message;
  buttonTapsInput.innerText += `${button}: ${tap}\n`;
});
