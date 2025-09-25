// plugins/mycredit.js
import fs from "fs";
import path from "path";

const CREDITS_FILE = path.join(process.cwd(), "database", "userCredits.json");

function readJson(file, def = {}) {
  try {
    if (!fs.existsSync(file)) return def;
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw || "{}");
  } catch (e) {
    console.error("readJson error:", e);
    return def;
  }
}

let handler = async (m, { conn }) => {
  const db = readJson(CREDITS_FILE, {});

  const jid = m.sender;
  const userData = db[jid];

  if (!userData) {
    return conn.reply(
      m.chat,
      `❌ Kamu belum punya credit.\n\nLakukan pembelian layanan agar dapat bonus credit. Coba ketik *.pricelist* untuk mulai belanja.`,
      m
    );
  }

  let teks = `
💳 *MY CREDIT INFO*

👤 User: ${jid}
💰 Credit Saat Ini: *${userData.credits.toFixed(2)}*

📜 Riwayat Transaksi:
${
  userData.history
    .slice(-5)
    .map(
      (h, i) =>
        `${i + 1}. 🆔 ${h.orderId}\n   +${h.creditsAdded} credit (Rp ${Number(
          h.amount
        ).toLocaleString("id-ID")})\n   📅 ${new Date(h.at).toLocaleString(
          "id-ID"
        )}`
    )
    .join("\n\n") || "- Tidak ada riwayat -"
}

🛒 Anda bisa gunakan credit untuk memperpanjang bot,

Ketik *.sewabot* untuk memperpanjang.
  `;

  await conn.reply(m.chat, teks.trim(), m);
};

handler.help = ["mycredit"];
handler.tags = ["info"];
handler.command = /^mycredit$/i;

export default handler;
