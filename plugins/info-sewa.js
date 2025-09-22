// plugins/info-sewa.js
import {
  generateWAMessageFromContent,
  generateWAMessageContent,
} from "@adiwajshing/baileys"; // atau sesuai fork kamu
import fs from "fs";
import path from "path";

const CREDITS_FILE = path.join(process.cwd(), "database", "userCredits.json");
function readJson(file, def = {}) {
  try {
    if (!fs.existsSync(file)) return def;
    return JSON.parse(fs.readFileSync(file, "utf8") || "{}");
  } catch {
    return def;
  }
}
function writeJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

let handler = async (m, { conn, text, args, command, usedPrefix }) => {
  const paket = {
    "2minggu": { credits: 8, days: 14, price: 5000 },
    "1bulan": { credits: 15, days: 30, price: 10000 },
    "3bulan": { credits: 30, days: 90, price: 25000 },
    "6bulan": { credits: 50, days: 180, price: 45000 },
    "1tahun": { credits: 100, days: 365, price: 80000 },
  };

  const used = (args || []).join(" ").trim().toLowerCase();

  // Kalau tanpa argumen -> tampilkan carousel
  if (!used) {
    // buat helper upload image ke server WA dan ambil imageMessage
    const createImageMessage = async (filePath) => {
      // kalau file ada sebagai buffer, kita bisa upload langsung
      let input = filePath;
      if (fs.existsSync(filePath)) input = fs.readFileSync(filePath);
      const { imageMessage } = await generateWAMessageContent(
        { image: input },
        { upload: conn.waUploadToServer }
      );
      return imageMessage;
    };

    // buat thumbnail (dipakai di header tiap card)
    let thumbnail;
    try {
      thumbnail = await createImageMessage("./media/logojei.jpg");
    } catch (e) {
      console.warn("Gagal buat thumbnail, fallback ke buffer jpeg:", e);
      // fallback: pakai raw buffer supaya ada thumbnail minimal
      const buf = fs.existsSync("./media/logojei.jpg")
        ? fs.readFileSync("./media/logojei.jpg")
        : Buffer.alloc(0);
      thumbnail = { jpegThumbnail: buf };
    }

    // build cards
    const cards = Object.entries(paket).map(([nama, data]) => {
      const harga = data.price;
      const cardBody = `📦 Paket: *${nama}*\n💰 Harga: Rp ${harga.toLocaleString(
        "id-ID"
      )}\n🎟 Credit: ${data.credits}\n⏳ Durasi: ${data.days} hari`;

      // tombol copy format / pilih credit
      const btnCopy = {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
          display_text: `Sewa ${nama}`,
          url:
            "https://wa.me/" +
            global.nomorwa.replace(/[^0-9]/g, "") +
            "?text=Saya mau sewa bot " +
            nama,
        }),
      };

      const btnCredit = {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: `Bayar pakai Credit`,
          id: `${usedPrefix}${command} ${nama} credit`,
          copy_code: `${usedPrefix + command} ${nama} credit`,
        }),
      };

      return {
        header: {
          imageMessage: thumbnail,
          hasMediaAttachment: true,
        },
        body: {
          text: cardBody,
        },
        nativeFlowMessage: {
          buttons: [btnCopy, btnCredit],
        },
      };
    });

    // build interactive carousel message
    const content = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: `📌 Pilih paket sewa bot. Bisa bayar manual atau pakai credit ✨\n\nKlik tombol pilih untuk menyalin format perintah.`,
            },
            carouselMessage: {
              cards,
              messageVersion: 1,
            },
          },
        },
      },
    };

    // generate WA message & kirim
    const msg = generateWAMessageFromContent(m.chat, content, { quoted: m });
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    return;
  }

  // Jika ada argumen -> proses sewa / potong credit / info paket
  const parts = used.split(/\s+/);
  const name = parts[0];
  const payByCredit = parts.includes("credit");

  if (!paket[name])
    return conn.reply(m.chat, `❌ Paket *${name}* tidak ditemukan.`, m);

  const db = readJson(CREDITS_FILE, {});
  const userJid = m.sender;
  const userData = db[userJid] || { credits: 0, history: [] };
  const needCredits = paket[name].credits;

  if (payByCredit) {
    if ((userData.credits || 0) < needCredits) {
      return conn.reply(
        m.chat,
        `⚠️ Credit tidak cukup.\nDibutuhkan: ${needCredits} credit\nSaldo kamu: ${
          userData.credits || 0
        } credit`,
        m
      );
    }

    // Potong credit & update DB
    userData.credits -= needCredits;
    userData.history.push({
      at: new Date().toISOString(),
      action: "deduct_sewa",
      paket: name,
      credits: needCredits,
    });
    db[userJid] = userData;
    writeJson(CREDITS_FILE, db);

    if (m.isGroup) {
      const chat = global.db.data.chats[m.chat] || {};
      const days = paket[name].days;
      const now = Date.now();
      const currentExpired = chat.expired || 0;
      const newExpired =
        Math.max(currentExpired, now) + days * 24 * 3600 * 1000;
      chat.expired = newExpired;
      global.db.data.chats[m.chat] = chat;
      if (typeof global.saveDatabase === "function") global.saveDatabase();

      return conn.reply(
        m.chat,
        `✅ Sewa bot berhasil!\n\n📦 Paket: *${name}*\n⏳ Durasi: ${days} hari\n💳 Credit terpakai: ${needCredits}\n📆 Expired: ${new Date(
          newExpired
        ).toLocaleString("id-ID")}`,
        m
      );
    } else {
      return conn.reply(
        m.chat,
        `✅ Credit berhasil dipotong (${needCredits}).\nHubungi admin untuk aktivasi sewa.`,
        m
      );
    }
  } else {
    return conn.reply(
      m.chat,
      `📦 Paket: *${name}*\n💰 Harga: Rp ${paket[name].price.toLocaleString(
        "id-ID"
      )}\n🎟 Credit: ${
        paket[name].credits
      }\n\n👉Chat *owner bot* untuk sewa bot *[Ketik .owner]*\n👉 Atau ketik *${usedPrefix}${command} ${name} credit* untuk bayar pakai credit.`,
      m
    );
  }
};

handler.help = ["sewabot"];
handler.tags = ["main"];
handler.command = ["sewabot"];

export default handler;
