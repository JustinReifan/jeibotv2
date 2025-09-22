import fs from "fs";

let handler = async (m, { conn, usedPrefix: _p, args }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    let userData = global.db?.data?.users?.[m.sender] || {};
    let nama = userData.nama || m.pushName || "PENGGUNA";
    let exp = userData.exp || 0;
    let koin = userData.koin || 0;
    let limit = userData.limit || 0;

    if (userData.premium && Number(userData.premiumTime || 0) <= Date.now()) {
      userData.premium = false;
      userData.premiumTime = 0;
    }

    let senderNum = m.sender.split("@")[0];
    let isOwner = Array.isArray(global.owner)
      ? global.owner.some(([id]) => String(id) === senderNum)
      : false;

    let isPremium =
      userData.premium === true &&
      Number(userData.premiumTime || 0) > Date.now();
    let status = isOwner ? "Pemilik" : isPremium ? "Premium" : "Free User";
    let sisaPremium = isOwner
      ? "Permanen"
      : isPremium
      ? getRemainingTime(userData.premiumTime - Date.now())
      : "-";

    const { tanggal, waktu } = waktuJakarta();

    let menuUser = `
┏━━ ⪩  *INFO PENGGUNA*  ⪨
┃ ⬡ Nama    : ${nama}
┃ ⬡ Status  : ${status}
┃ ⬡ Koin    : ${koin}
┃ ⬡ Limit   : ${limit}
┃ ⬡ Premium : ${sisaPremium}
┗━━━━━━━━━━━━━━━⟢
`.trim();

    let help = Object.values(global.plugins)
      .filter((p) => !p.disabled)
      .map((p) => ({
        help: Array.isArray(p.help)
          ? p.help.filter(Boolean)
          : [p.help].filter(Boolean),
        tags: Array.isArray(p.tags)
          ? p.tags.filter(Boolean)
          : [p.tags].filter(Boolean),
        prefix: "customPrefix" in p,
        limit: p.limit,
        premium: p.premium,
        owner: p.owner,
        rowner: p.rowner,
      }));

    let categories = {};
    help.forEach((plugin) => {
      plugin.tags.forEach((tag) => {
        if (tag && !(tag in categories)) categories[tag] = tag;
      });
    });

    if (args[0]) {
      let category = args[0].toLowerCase();
      if (category in categories) {
        let commands = help
          .filter(
            (menu) =>
              menu.tags
                .map((t) => String(t).toLowerCase())
                .includes(category) && menu.help?.length
          )
          .map((menu) =>
            menu.help
              .map((cmd) => {
                let marks = "";
                if (menu.limit) marks += "Ⓛ ";
                if (menu.premium) marks += "Ⓟ ";
                if (menu.owner || menu.rowner) marks += "Ⓞ ";
                return `• ${menu.prefix ? cmd : `${_p}${cmd}`} ${marks}`.trim();
              })
              .join("\n")
          )
          .join("\n");

        let menuContent = `
乂  *MENU ${category.toUpperCase()}*
┏━━━━━━━━━━⟢
${commands || "Belum ada perintah."}
┗━━━━━━━━━━⟢
`.trim();

        await conn.sendMessage(
          m.chat,
          {
            text: `${ucapan()} @${senderNum}

${menuContent}`,
            mentions: [m.sender],
          },
          { quoted: m }
        );
        return;
      } else {
        await conn.reply(
          m.chat,
          `⚠️ Kategori *${args[0]}* tidak ditemukan.\nKetik *${_p}menu* untuk melihat kategori.`,
          m
        );
        return;
      }
    }

    let mainMenu = `
${ucapan()} @${senderNum}

${menuUser}

🧭 *Navigasi Menu*
Tekan tombol *Pilih Kategori* di bawah ini.

_${global.namebot} V2.0_
`.trim();

    const categoryKeys = Object.keys(categories)
      .map((v) => String(v).toLowerCase())
      .sort();
    const rows = categoryKeys.map((key) => {
      const cmds = help
        .filter((p) => p.tags.map((t) => String(t).toLowerCase()).includes(key))
        .flatMap((p) => p.help)
        .filter(Boolean);
      return {
        title: `Menu ${categories[key]}`,
        description: `Tersedia ${cmds.length} perintah`,
        id: `${_p}menu ${key}`,
      };
    });

    const suntikRow = [
      {
        title: "Daftar Harga",
        description: "Cek daftar harga layanan suntik",
        id: `${_p}pricelist`,
      },
      {
        title: "Cek Transaksi",
        description: "Cek status pesanan suntik anda",
        id: `${_p}ceksuntik`,
      },
    ];

    const sewaRow = [
      {
        title: "Coba gratis 7 hari",
        description: "Coba Jei bot gratis selama 7 hari di grup anda",
        id: `${_p}cobagratis`,
      },
      {
        title: "Apa itu credit?",
        description: "Info tentang sistem credit",
        id: `${_p}info-credit`,
      },
      {
        title: "Sewa bot",
        description: "Info paket sewa bot",
        id: `${_p}sewabot`,
      },
    ];

    const sections = [
      { title: "Flashsale Suntik Followers", rows: suntikRow },
      { title: "Fitur Bot", rows },
      { title: "Info Jei Bot", rows: sewaRow },
    ];

    await conn.sendMessage(
      m.chat,
      {
        text: mainMenu,
        mentions: [m.sender],
        buttons: [
          {
            buttonId: "action",
            buttonText: { displayText: "Pilih Kategori" },
            type: 4,
            nativeFlowInfo: {
              name: "single_select",
              paramsJson: JSON.stringify({
                title: "Pilih Kategori Menu",
                sections,
              }),
            },
          },
        ],
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("Error ini bos: ", e);
    await conn.reply(m.chat, "⚠️ Terjadi kesalahan saat menampilkan menu.", m);
  }
};

handler.help = ["menu"];
handler.tags = ["main"];
handler.command = /^(menu|help|bot)$/i;
handler.daftar = true;
export default handler;

function getRemainingTime(ms) {
  if (ms <= 0) return "0 detik";
  let d = Math.floor(ms / 86400000);
  let h = Math.floor(ms / 3600000) % 24;
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  const parts = [];
  if (d) parts.push(`${d} hari`);
  if (h) parts.push(`${h} jam`);
  // if (m) parts.push(`${m} menit`);
  // if (s || parts.length === 0) parts.push(`${s} detik`);
  return parts.join(" ");
}

function waktuJakarta() {
  const now = new Date();
  const tanggal = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);
  const waktu = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
  return { tanggal, waktu };
}

function ucapan() {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      hour12: false,
    }).format(new Date())
  );
  if (hour >= 4 && hour < 10) return "Pagi";
  if (hour >= 10 && hour < 15) return "Siang";
  if (hour >= 15 && hour < 18) return "Sore";
  return "Selamat malam 🌙";
}
