// lib/creditDb.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CREDITS_FILE = path.join(__dirname, "..", "database", "userCredits.json");

function readJson(file, def = {}) {
  try {
    if (!fs.existsSync(file)) return def;
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw || "{}");
  } catch (e) {
    console.error("readJson err:", e);
    return def;
  }
}

function writeJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("writeJson err:", e);
  }
}

export function getCredits(jid) {
  const db = readJson(CREDITS_FILE, {});
  return db[jid]?.credits || 0;
}

export function addCredits(jid, amount, orderId = null) {
  const db = readJson(CREDITS_FILE, {});
  if (!db[jid]) db[jid] = { credits: 0, history: [] };

  db[jid].credits = Number((db[jid].credits + amount).toFixed(2));
  if (orderId) {
    db[jid].history.push({
      at: new Date().toISOString(),
      orderId,
      creditsAdded: amount,
    });
  }

  writeJson(CREDITS_FILE, db);
  return db[jid];
}

export function getAllCredits() {
  return readJson(CREDITS_FILE, {});
}
