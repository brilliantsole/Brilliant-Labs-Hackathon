import express from "express";
import https from "https";
import http from "http";
import fs from "fs";
import ip from "ip";
import * as BS from "./lib/brilliantsole/brilliantsole.node.module.js";
import { WebSocketServer } from "ws";
//BS.setAllConsoleLevelFlags({ log: true, warn: true });

const app = express();

app.use(function (req, res, next) {
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("x-frame-options", "same-origin");

  next();
});

const serverOptions = {
  key: fs.readFileSync("./sec/key.pem"),
  cert: fs.readFileSync("./sec/cert.pem"),
};

const httpServer = http.createServer(app);
httpServer.listen(81);
const httpsServer = https.createServer(serverOptions, app);
httpsServer.listen(444, () => {
  console.log(`server listening on https://${ip.address()}:${httpServer.address().port}`);
});

const wss = new WebSocketServer({ server: httpsServer });

const webSocketServer = new BS.WebSocketServer();
webSocketServer.server = wss;
