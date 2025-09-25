// plugins/addTrial.js
let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;

let handler = async (m, { conn, args, isOwner }) => {
  const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 hari dalam ms
  const now = new Date() * 1;

  if (m.isGroup) {
    // mode 1: dijalankan langsung di grup
    let who = m.chat;

    if (!global.db.data.chats[who]) {
      global.db.data.chats[who] = { expired: 0 };
    }

    if (now < (global.db.data.chats[who].expired || 0)) {
      global.db.data.chats[who].expired += sevenDays;
    } else {
      global.db.data.chats[who].expired = now + sevenDays;
    }

    conn.reply(
      m.chat,
      `✅ Trial bot berhasil ditambahkan selama 7 hari.\n\nHitung Mundur: ${msToDate(
        global.db.data.chats[who].expired - now
      )}`,
      m
    );
  } else {
    // mode 2: owner kirim link grup di private chat
    if (!isOwner)
      throw "❌ Hanya owner yang bisa menambahkan trial lewat private chat.";
    if (!args[0])
      throw "❌ Kirim link grup WA.\n\nContoh: .addtrial https://chat.whatsapp.com/xxxx";

    let [_, code] = args[0].match(linkRegex) || [];
    if (!code) throw "❌ Link grup tidak valid.";

    let res = await conn.groupAcceptInvite(code); // bot join grup
    m.reply(`✅ Bot berhasil join grup ${res} dan menambahkan trial 7 hari.`);

    // update expired
    let chats = global.db.data.chats[res];
    if (!chats) chats = global.db.data.chats[res] = {};

    if (now < (chats.expired || 0)) {
      chats.expired += sevenDays;
    } else {
      chats.expired = now + sevenDays;
    }
  }
};

handler.help = ["addtrial (linkgrup)"];
handler.tags = ["owner"];
handler.command = /^addtrial$/i;
handler.rowner = true;

export default handler;

function msToDate(ms) {
  let days = Math.floor(ms / (24 * 60 * 60 * 1000));
  let daysms = ms % (24 * 60 * 60 * 1000);
  let hours = Math.floor(daysms / (60 * 60 * 1000));
  let hoursms = ms % (60 * 60 * 1000);
  let minutes = Math.floor(hoursms / (60 * 1000));
  return `${days} Hari ${hours} Jam ${minutes} Menit`;
}
