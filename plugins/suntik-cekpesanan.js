// plugins/ceksuntik.js
import suntikController from "../controllers/suntikController.js";

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!m.isGroup) return m.reply("❌ Fitur khusus group!");

  const id = text || args[0];
  if (!id) return m.reply(`❌ Kirim *${usedPrefix + command} <orderId>*`);

  try {
    const result = await suntikController.cekSuntik(id);
    const { order, status, paymentUrl } = result;

    let txt = "📦 *DETAIL PESANAN SUNTIK FOLLOWERS*\n";
    txt += "━━━━━━━━━━━━━━━━━━━━━━\n\n";

    txt += `🆔 *Order ID*   : ${order.orderId}\n`;
    txt += `📌 *Layanan*    : ${order.serviceName}\n`;
    txt += `🔢 *Jumlah*     : ${order.qty}\n`;
    txt += `🎯 *Target*     : ${order.target}\n`;
    txt += `👤 *Pemesan*    : ${order.buyerName}\n`;
    txt += `💰 *Total Bayar*: Rp${Number(order.total).toLocaleString(
      "id-ID"
    )}\n`;
    txt += `🕒 *Dibuat*     : ${new Date(order.createdAt).toLocaleString(
      "id-ID"
    )}\n`;
    if (order.updatedAt) {
      txt += `🕒 *Update Terakhir* : ${new Date(order.updatedAt).toLocaleString(
        "id-ID"
      )}\n`;
    }

    txt += "\n━━━━━━━━━━━━━━━━━━━━━━\n";
    txt += `📡 *Status Pesanan*\n`;

    if (status) {
      // Sudah terkirim ke provider (Tinped)
      txt += `   ➤ Status : ${status.data.status}\n`;
      txt += `   ➤ Start  : ${status.data.start_count}\n`;
      txt += `   ➤ Sisa   : ${status.data.remains}\n`;
    } else {
      // Masih pending pembayaran
      txt += `   ➤ Status : ⏳ *Menunggu Pembayaran*\n`;
      if (paymentUrl) {
        txt += `   ➤ Link Bayar: ${paymentUrl}\n`;
      }
    }

    txt += "━━━━━━━━━━━━━━━━━━━━━━\n\n";
    txt += "✨ Terima kasih telah menggunakan layanan kami ✨";

    await m.reply(txt);
  } catch (e) {
    console.error(e);
    m.reply("❌ Gagal cek pesanan: " + (e?.message || "Unknown error"));
  }
};

handler.help = ["ceksuntik <orderId>"];
handler.tags = ["suntik"];
handler.command = /^ceksuntik$/i;
handler.group = true;
handler.limit = true;

export default handler;
