// plugins/ordersuntik.js
import QRCode from "qrcode";
import suntikController from "../controllers/suntikController.js";

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply("❌ Fitur khusus group!");

  if (!text)
    return m.reply(
      `❌ Format salah.\n\nGunakan:\n${
        usedPrefix + command
      } id_layanan | jumlah | target\n\nContoh:\n${
        usedPrefix + command
      } 123 | 100 | https://instagram.com/tinped.id/`
    );

  const [serviceId, qty, target] = text.split("|").map((s) => s.trim());
  if (!serviceId || !qty || !target)
    return m.reply(
      `❌ Format salah.\n\nContoh benar:\n${
        usedPrefix + command
      } 123 | 100 | https://instagram.com/tinped.id/`
    );

  await m.reply("⏳ Membuat order... mohon tunggu sebentar");

  try {
    const invoiceResp = await suntikController.orderSuntik({
      m,
      api_id: global.tinped_id,
      api_key: global.tinped_key,
      serviceId,
      qty,
      target,
      buyerPhone: m.sender,
      buyerName: m.pushName || "Pembeli",
      returnUrl: global.duitku_return_url,
      callbackUrl: global.duitku_callback_url,
    });

    const paymentUrl = invoiceResp.invoice?.paymentUrl;
    const qrString = invoiceResp.invoice?.qrString;
    const ord = invoiceResp.order;

    if (qrString) {
      const qrBuffer = await QRCode.toBuffer(qrString, { type: "png" });

      await conn.sendMessage(
        m.chat,
        {
          image: qrBuffer,
          caption:
            `💳 *INVOICE PEMBAYARAN*\n` +
            `━━━━━━━━━━━━━━━━━━\n` +
            `🆔 *Order ID* : ${ord?.orderId}\n` +
            `📌 *Layanan*  : ${ord?.serviceName}\n` +
            `🔢 *Jumlah*   : ${ord?.qty}\n` +
            `🎯 *Target*   : ${ord?.target}\n` +
            `💰 *Total*    : Rp${Number(ord?.total).toLocaleString(
              "id-ID"
            )}\n` +
            `━━━━━━━━━━━━━━━━━━\n\n` +
            `⚡ Silakan scan QR di atas untuk melakukan pembayaran.\n\n` +
            `Jika ada kendala, hubungi *Owner*.`,
        },
        { quoted: m }
      );
    } else if (paymentUrl) {
      await m.reply(
        `💳 *INVOICE PEMBAYARAN*\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `🆔 *Order ID* : ${ord?.orderId}\n` +
          `📌 *Layanan*  : ${ord?.serviceName}\n` +
          `🔢 *Jumlah*   : ${ord?.qty}\n` +
          `🎯 *Target*   : ${ord?.target}\n` +
          `💰 *Total*    : Rp${Number(ord?.total).toLocaleString("id-ID")}\n` +
          `━━━━━━━━━━━━━━━━━━\n\n` +
          `🔗 Silakan lakukan pembayaran melalui link berikut:\n${paymentUrl}`
      );
    } else {
      await m.reply(
        "ℹ️ Invoice berhasil dibuat:\n" +
          JSON.stringify(invoiceResp.invoice, null, 2).slice(0, 400)
      );
    }
  } catch (e) {
    console.error(e);
    if (e.response?.data) {
      m.reply(
        "❌ Gagal buat order: " +
          (e.response.data.Message || e.response.data.message)
      );
    } else {
      m.reply("❌ Gagal buat order: " + e.message);
    }
  }
};

// handler.help = ["ordersuntik <id_layanan>|<jumlah>|<target>"];
// handler.tags = ["suntik"];
handler.command = /^ordersuntik$/i;
handler.group = true;
handler.limit = true;

export default handler;
