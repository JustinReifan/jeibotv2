// server/callback.js
import express from "express";
import { createServer } from "http";
import suntikController from "../controllers/suntikController.js";

const app = express();
const PORT = process.env.CALLBACK_PORT || 5000;

// Middleware untuk parsing body
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // untuk x-www-form-urlencoded

// Debug log untuk callback Duitku
app.use((req, res, next) => {
  if (req.path === "/duitku/callback") {
    console.log("Headers:", req.headers["content-type"]);
    console.log("Body:", req.body);
  }
  next();
});

// Simpan referensi ke instance WhatsApp
let globalConn = null;

function setConnInstance(conn) {
  globalConn = conn;
}

// Route callback untuk Duitku
app.post("/duitku/callback", async (req, res) => {
  try {
    if (!globalConn || typeof globalConn.sendMessage !== "function") {
      console.error("Socket WA belum siap");
      return res.status(503).json({ ok: false, message: "WA not ready" });
    }

    const result = await suntikController.paymentCallback(
      req.headers,
      req.body
    );

    // Kirim notifikasi WA ke pembeli
    if (result.order && result.order.buyerPhone) {
      let status = result.order.status;
      let orderId = result.order.orderId;
      let layanan = result.order.serviceName;
      let target = result.order.target;
      let qty = result.order.qty;
      let total = result.order.total;

      let msg =
        `⚡ *PEMBAYARAN BERHASIL!* \n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `🆔 *Order ID*   : ${orderId}\n` +
        `📌 *Layanan*    : ${layanan}\n` +
        `🎯 *Target*     : ${target}\n` +
        `🔢 *Jumlah*     : ${qty}\n` +
        `💰 *Total Bayar*: Rp${Number(total).toLocaleString("id-ID")}\n\n`;

      if (status === "ordered") {
        msg +=
          `✅ *STATUS: PEMBAYARAN SUKSES*\n` +
          `Pesanan Anda sedang *diproses otomatis* 🚀\n\n`;
      } else {
        msg +=
          `❌ *STATUS: ${status.toUpperCase()}*\n` +
          `Hubungi admin untuk bantuan lebih lanjut ⚠️\n\n`;
      }

      msg +=
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📝 Untuk cek progres pesanan:\n` +
        `Ketik: *.ceksuntik ${orderId}*`;

      // kirim ke group jika ada, fallback ke buyer
      const targetChat = result.order.groupId || result.order.buyerPhone;
      await globalConn.sendMessage(targetChat, { text: msg });
    }

    res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error("duitku callback err", err);
    res.status(400).json({ ok: false, error: err.message });
  }
});

const server = createServer(app);

function startCallbackServer() {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Callback server jalan di port ${PORT}`);
  });
}

export { startCallbackServer, setConnInstance };
