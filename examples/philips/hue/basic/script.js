import HueClient from "../../../../lib/philips/HueClient.js";
const hueClient = new HueClient();
window.hueClient = hueClient;
console.log(hueClient);

hueClient.connect("https://192.168.1.44:8443");

/** @type {HTMLElement} */
const lightsContainer = document.getElementById("lights");
/** @type {HTMLTemplateElement} */
const lightTemplate = document.getElementById("lightTemplate");

function updateLightsContainer() {
  lightsContainer.innerHTML = "";
  hueClient.bridges.forEach((bridge, bridgeId) => {
    Object.keys(bridge.lights).forEach((lightId) => {
      const light = bridge.lights[lightId];

      /** @type {HTMLElement} */
      const lightContainer = lightTemplate.content.cloneNode(true).querySelector(".light");

      /** @type {HTMLSpanElement} */
      const nameSpan = lightContainer.querySelector(".name");
      nameSpan.innerText = light.name;

      /** @type {HTMLInputElement} */
      const colorInput = lightContainer.querySelector("input");
      colorInput.addEventListener("input", (event) => {
        const value = event.target.value;
        const rgb = hueClient.htmlColorToRgbArray(value);
        hueClient.setLights([{ lightId, bridgeId: bridgeId, color: rgb }]);
      });
      lightsContainer.appendChild(lightContainer);
    });
  });
}
hueClient.addEventListener("bridges", () => updateLightsContainer());
