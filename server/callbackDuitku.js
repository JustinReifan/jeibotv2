// callbackDuitku.js (ESM)
import express from "express";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import suntikController from "../controllers/suntikController.js"; // pastikan export default
// import CONFIG from "../config.json" assert { type: "json" }; // optional jika butuh config

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.CALLBACK_PORT || 5000;

// support x-www-form-urlencoded & JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// DB file for credits (relative ke folder file ini)
const CREDITS_FILE = path.join(__dirname, "..", "database", "userCredits.json");

function readJson(file, def = {}) {
  try {
    console.log("[DEBUG] readJson target:", file);
    if (!fs.existsSync(file)) {
      console.log("[DEBUG] File not found, returning default");
      return def;
    }
    const raw = fs.readFileSync(file, "utf8");
    console.log("[DEBUG] File content:", raw);
    const parsed = JSON.parse(raw || "{}");
    return Array.isArray(parsed) ? {} : parsed; // 🔑 paksa object
  } catch (e) {
    console.error("readJson err:", e);
    return def;
  }
}

function writeJson(file, data) {
  try {
    console.log("[DEBUG] writeJson target:", file);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    // 🔑 pastikan data selalu object
    const objData = Array.isArray(data) ? {} : data;
    fs.writeFileSync(file, JSON.stringify(objData, null, 2));
    console.log("[DEBUG] JSON saved:", objData);
  } catch (e) {
    console.error("writeJson err:", e);
  }
}

// normalisasi jid: accept "4017...", "6285...", "0812...", "6285...@s.whatsapp.net", "4017...@lid"
function ensureJid(jid) {
  if (!jid) return jid;
  // if already contains @
  if (typeof jid === "string" && jid.includes("@")) {
    const userPart = String(jid).split("@")[0].replace(/\D/g, "");
    if (!userPart) return jid;
    // if looks like indonesia international
    if (/^62\d{7,}$/.test(userPart)) return `${userPart}@s.whatsapp.net`;
    // if starts with 0 -> convert
    if (/^0\d+/.test(userPart)) return `62${userPart.slice(1)}@s.whatsapp.net`;
    // fallback use numeric userPart + s.whatsapp.net
    return `${userPart}@s.whatsapp.net`;
  } else {
    // pure digits or mixed => strip non-digits
    let d = String(jid).replace(/\D/g, "");
    if (!d) throw new Error("Invalid phone");
    if (d.startsWith("0")) d = "62" + d.slice(1);
    if (!d.startsWith("62")) d = "62" + d;
    return `${d}@s.whatsapp.net`;
  }
}

// credit calc: profit = total * 0.5; credit = floor(profit / 1000)
function creditsFromAmount(total) {
  const num = Number(total) || 0;
  const profit = num * 0.33;
  return Number((profit / 1000).toFixed(2));
}

// shareable instance of WA (set from start file)
let globalConn = null;
export function setConnInstance(juna) {
  globalConn = juna;
}

// debug middleware (optional) - log content-type and body for the callback route
app.use((req, res, next) => {
  if (req.path === "/duitku/callback") {
    // console.log("[duitku callback] headers:", req.headers["content-type"]);
    // console.log("[duitku callback] body:", req.body);
  }
  next();
});

app.post("/duitku/callback", async (req, res) => {
  try {
    // validasi socket ready
    if (!globalConn || typeof globalConn.sendMessage !== "function") {
      console.error("Socket WA belum siap");
      // still return 200 to gateway in some cases, but use 503 here
      return res.status(503).json({ ok: false, message: "WA not ready" });
    }

    // call controller to validate and process payment -> it returns structured result
    const result = await suntikController.paymentCallback(
      req.headers,
      req.body
    );

    // If payment processed and order created successfully
    if (result && result.ok && result.type === "ordered" && result.order) {
      const ord = result.order;
      console.log("Order processed:", ord);

      // determine total; fallback to tinpedResponse price if needed
      const total =
        Number(ord.total) ||
        Number(ord.tinpedResponse?.data?.price) ||
        Number(result.TinpedRes?.data?.price) ||
        0;
      const addCredit = creditsFromAmount(total);

      // persist credit to DB file
      const db = readJson(CREDITS_FILE, {});
      const buyerRaw = ord.buyerPhone || ord.buyer || ord.buyerPhoneJid || "";
      let buyerJid;
      try {
        buyerJid = ensureJid(buyerRaw);
      } catch (e) {
        // fallback: use buyerRaw as-is
        buyerJid = buyerRaw;
      }

      if (!db[buyerJid]) db[buyerJid] = { credits: 0, history: [] };
      db[buyerJid].credits = Number(
        ((db[buyerJid].credits || 0) + addCredit).toFixed(2)
      );
      db[buyerJid].history = db[buyerJid].history || [];
      db[buyerJid].history.push({
        at: new Date().toISOString(),
        orderId: ord.orderId,
        amount: total,
        creditsAdded: addCredit,
      });
      writeJson(CREDITS_FILE, db);

      // send WA notification to buyer (if instance available)
      if (globalConn && typeof globalConn.sendMessage === "function") {
        const buyerToSend = buyerJid;
        const msg =
          `⚡ *PEMBAYARAN BERHASIL*\n\n` +
          `🆔 Order: *${ord.orderId}*\n` +
          `📌 Layanan: *${ord.serviceName}*\n` +
          `🎯 Target: ${ord.target}\n` +
          `🔢 Jumlah: ${ord.qty}\n` +
          `💰 Total Bayar: Rp${Number(total).toLocaleString("id-ID")}\n\n` +
          `🎉 Kamu memperoleh *${addCredit} credit* dari pembelian ini.\n` +
          `🔖 Total credit kamu sekarang: *${db[buyerJid].credits}*\n\n` +
          `📝 Untuk memperpanjang sewa bot pakai credit: ketik .sewabot dan pilih paket\n` +
          `🔎 Cek detail pesanan: .ceksuntik ${ord.orderId}`;

        // try {
        //   await globalConn.sendMessage(buyerToSend, { text: msg });
        // } catch (e) {
        //   console.warn("Gagal kirim WA ke buyer:", e?.message || e);
        // }

        // Also notify group if order has groupId
        if (ord.groupId) {
          try {
            await globalConn.sendMessage(ord.groupId, { text: msg });
          } catch (e) {
            // ignore
          }
        }
      }

      return res
        .status(200)
        .json({ ok: true, result, creditsAdded: addCredit });
    }

    // payment failed or non-ordered
    if (result && result.type === "payment_failed") {
      const p = result.payment;
      try {
        const buyerJid = ensureJid(p?.buyerPhone || p?.merchantUserId || "");
        if (
          globalConn &&
          typeof globalConn.sendMessage === "function" &&
          buyerJid
        ) {
          await globalConn.sendMessage(buyerJid, {
            text: `⚠️ Pembayaran untuk Order ${p.merchantOrderId} gagal. Silakan coba lagi atau hubungi admin.`,
          });
        }
      } catch (e) {
        // ignore
      }
    }

    // default response
    return res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error("duitku callback err", err);
    return res
      .status(400)
      .json({ ok: false, error: String(err?.message || err) });
  }
});

const server = createServer(app);

export function startCallbackServer() {
  server.listen(PORT, "0.0.0.0", () =>
    console.log(`[callback] server ready on port ${PORT}`)
  );
}
