import { spawn } from "child_process";
import path, { dirname } from "path";
import os from "os";
import cfonts from "cfonts";
import chalk from "chalk";
import { fileURLToPath } from "url";

console.clear();

console.log("Starting...");
process.on("uncaughtException", console.error);
const unhandledRejections = new Map();

console.log(
  chalk.yellow("[ Starting ] ") + chalk.white.bold("Welcome In Terminal Zass!")
);

console.clear();

process.on("unhandledRejection", (reason, promise) => {
  unhandledRejections.set(promise, reason);
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("rejectionHandled", (promise) => {
  unhandledRejections.delete(promise);
});

process.on("Something went wrong", function (err) {
  console.log("Caught exception: ", err);
});

// __dirname fix untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function start() {
  let args = [path.join(__dirname, "main.js"), ...process.argv.slice(2)];
  let p = spawn(process.argv[0], args, {
    stdio: ["inherit", "inherit", "inherit", "ipc"],
  })
    .on("message", (data) => {
      if (data === "reset") {
        console.log("Restarting...");
        p.kill();
      }
    })
    .on("exit", (code) => {
      console.error("Exited with code:", code);
      start();
    });
}

console.clear();

setTimeout(() => {
  console.log(
    chalk.cyan.bold(`Operating System Information:
- Platform: ${os.platform()}
- Release: ${os.release()}
- Architecture: ${os.arch()}
- Hostname: ${os.hostname()}
- Total Memory: ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
- Free Memory: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB
- Uptime: ${os.uptime()} seconds`)
  );
  console.log(
    chalk.magenta.bold("===============================================")
  );
  console.log(
    chalk.blue.bold("[ Question ] Enter your WhatsApp number, example: 628****")
  );
}, 3000);

start();
