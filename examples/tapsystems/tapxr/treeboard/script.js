import Treeboard from "../../../../lib/tapsystems/tapxr/Treeboard.js";

const treeboard = new Treeboard({
  a: {},
  b: {
    x: () => {
      logToResultsContainer("x");
    },
    y: {
      wow: () => logToResultsContainer("wow"),
      hey: () => logToResultsContainer("hey"),
    },
  },
});
console.log(treeboard);
window.treeboard = treeboard;

const pathContainer = document.getElementById("path");
function updatePathContainer() {
  pathContainer.innerHTML = "";
  treeboard.path.forEach((segment, index, path) => {
    const segmentButton = document.createElement("button");
    segmentButton.disabled = index == path.length - 1;
    segmentButton.innerText = segment;
    segmentButton.addEventListener("click", () => {
      treeboard.path = path.slice(0, index + 1);
    });
    pathContainer.appendChild(segmentButton);
  });
}
updatePathContainer();
treeboard.addEventListener("path", () => updatePathContainer());

const optionsContainer = document.getElementById("options");

const goBackButton = document.createElement("button");
goBackButton.innerText = "<";
goBackButton.addEventListener("click", () => treeboard.goBack());

function updateOptionsContainer() {
  optionsContainer.innerHTML = "";
  if (treeboard.path.length) {
    optionsContainer.appendChild(goBackButton);
  }
  treeboard.options.forEach((option) => {
    const optionButton = document.createElement("button");
    optionButton.innerText = option;
    optionButton.addEventListener("click", () => treeboard.selectOption(option));
    optionsContainer.appendChild(optionButton);
  });
}
updateOptionsContainer();
treeboard.addEventListener("path", () => updateOptionsContainer());

const resultsContainer = document.getElementById("results");
function logToResultsContainer(string) {
  resultsContainer.innerText = string;
}
