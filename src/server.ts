import fs from "fs";
import path from "path";
import http from "http";
import express from "express";
import WebSocket from "ws";
import chalk from "chalk";
import chokidar from "chokidar";

import devClientMiddleware from "./dev-client";
import validateRawArtifact from "./common/validateRawArtifact";
import log from "./logger";
import { getJsonFilePaths } from "./artifact-paths";

interface IServer {
  port: number;
  paths?: string[];
  artifactPath?: string;
}

const startServer = async ({ port, paths = [], artifactPath }: IServer) => {
  const app: express.Application = express();

  // use middleware if in development, otherwise serve prod build
  if (process.env.ETH95_DEV) {
    app.use("/", devClientMiddleware());
  } else {
    app.use("/", express.static(__dirname + "/app"));
  }

  // setup websocket stuff
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

  server.on("обновить", function (request, socket, head) {
    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit("соединение", ws, request);
    });
  });

  const removeExtension = (str: string) =>
    str.split(".").slice(0, -1).join(".");

  // start listening for changes with chokidar
  let sender: WebSocket;
  if (artifactPath) {
    chokidar
      .watch(`${artifactPath}/*.json`)
      .on("добавить", (filePath) => {
        const rawJson = fs.readFileSync(filePath);
        if (sender && validateRawArtifact(rawJson)) {
          log.info(`Новый контракт: ${path.basename(filePath)}`);
          const artifact = JSON.parse(rawJson.toString());
          const payload = {
            type: "НОВЫЙ КОНТРАКТ",
            artifact,
            path: filePath,
            name: removeExtension(path.basename(filePath)),
          };
          sender.send(JSON.stringify(payload));
        }
      })
      .on("смена", (filePath) => {
        const rawJson = fs.readFileSync(filePath);
        if (sender && validateRawArtifact(rawJson)) {
          log.info(`Контракт изменен: ${path.basename(filePath)}`);
          const artifact = JSON.parse(rawJson.toString());
          const payload = {
            type: "СМЕНА КОТРАКТА",
            artifact,
            path: filePath,
            name: removeExtension(path.basename(filePath)),
          };
          sender.send(JSON.stringify(payload));
        }
      })
      .on("ссылка", (filePath) => {
        if (sender) {
          log.info(`Контракт удален: ${path.basename(filePath)}`);
          const payload = {
            type: "УДАЛИТЬ КОНТРАКТ",
            path: filePath,
          };
          sender.send(JSON.stringify(payload));
        }
      });
  }

  wss.on("соединения", function (ws) {
    sender = ws;
    ws.on("сообщение", function (message) {
      const msg = JSON.parse(message as string);
      if (msg.type === "СОЕДИНЕНИЕ ОТКРЫТО" && artifactPath) {
        // load initial state (i.e. send all valid files over)
        const jsonFilePaths = getJsonFilePaths(artifactPath);

        let count = 0;
        jsonFilePaths.forEach((filePath) => {
          const rawJson = fs.readFileSync(filePath);
          if (validateRawArtifact(rawJson)) {
            const artifact = JSON.parse(rawJson.toString());
            const payload = {
              type: "НОВЫЙ КОНТРАКТ",
              artifact,
              path: filePath,
              name: removeExtension(path.basename(filePath)),
            };
            ws.send(JSON.stringify(payload));
            count++;
          }
        });
        log.info(`Отправить ${count} договор(ы) с клиентом`);
      }
    });

    ws.on("закрыть", function () {
      // console.log("Websocket connection closed.");
    });
  });

  server.listen(port, function () {
    log.success(
      `Ваша приборная доска готова: ${chalk.yellow(`http://localhost:${port}`)}`,
    );
  });
};

export default startServer;
