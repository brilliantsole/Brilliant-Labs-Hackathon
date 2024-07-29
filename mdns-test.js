const mdns = require("mdns");

const sequence = [
  mdns.rst.DNSServiceResolve(),
  mdns.rst.getaddrinfo({ families: [4] }),
];

const browser = mdns.createBrowser(mdns.tcp("hue"));

browser.on("serviceUp", (service) => {
  //console.log("Found a Philips Hue bridge:", service);
  const { name, txtRecord } = service;
  const { bridgeid, modelid } = txtRecord;
  const ip = service.addresses[3];
  console.log({ name, bridgeid, modelid, ip });
});

browser.on("error", (error) => {
  console.error("Error while discovering Philips Hue bridges:", error);
});

browser.start();
