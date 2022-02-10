#!/usr/bin/env node
import fs from "fs";
import path from "path";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import program from "commander";

import log from "./logger";
import startServer from "./server";

// determine if we are in development mode
// https://github.com/TypeStrong/ts-node/issues/846#issuecomment-631828160
// @ts-ignore
if (process[Symbol.for("ts-node.register.instance")]) {
  process.env.ETH95_DEV = "true";
}

clear();
console.log("");
console.log(chalk.red(figlet.textSync("Eth95", { font: "ANSI Shadow" })));

program
  .version(require("../package.json").version)
  .name("eth95")
  .description("Графический интерфейс для управления децентрализованными приложениями Ethereum.")
  .usage("[path-to-artifacts-dir] [options]")
  .option("-b, --buidler", "наблюдает за каталогом артефактов Builder по умолчанию")
  .option("-t, --truffle", "наблюдает за каталогом артефактов Truffle по умолчанию")
  .option("-p, --port <number>", "указать порт для размещения внешнего интерфейса")
  .parse(process.argv);

program.outputHelp();
console.log("");

// determine what path (if any) to try
let targetPath;
if (program.args[0]) {
  targetPath = program.args[0];
} else if (program.truffle) {
  targetPath = "./build/contracts";
} else if (program.buidler) {
  targetPath = "./artifacts";
}

if (targetPath) {
  const artifactPath = path.resolve(targetPath);
  const validPath =
    fs.existsSync(artifactPath) && fs.lstatSync(artifactPath).isDirectory();

  if (!validPath) {
    log.error(`Неверная дериктория: ${chalk.white(artifactPath)}\n`);
    process.exit(1);
  }

  log.info(`Каталог артефактов: ${chalk.yellow(artifactPath)}`);
  startServer({
    port: program.port || 3000,
    artifactPath,
  });
} else {
  startServer({
    port: program.port || 3000,
  });
}
