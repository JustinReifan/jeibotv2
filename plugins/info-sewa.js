const { generateWAMessageContent, generateWAMessageFromContent } = (
  await import("@adiwajshing/baileys")
).default;

let handler = async (m, { conn, text, args, command, usedPrefix }) => {
  const sewaList = {
    "1000 Folls IG": 10000,
    "1000 Folls Tiktok": 15000,
    "1000 Likes Tiktok": 25000,
    "1000 Likes IG": 40000,
  };

  const premiumList = {
    "1 bulan": 10000,
    "1 tahun": 55000,
  };

  const paymentInfo = `💳 *Metode Pembayaran*  
1. Dana: 082191987064  
2. Qris: Ketik .payment 

📌 *Setelah melakukan pembayaran, kirim bukti dengan format:*  
📸 *Kirim foto bukti pembayaran dengan caption:*  
\`\`\`.bukti\`\`\``;

  const image = async (url) => {
    const { imageMessage } = await generateWAMessageContent(
      {
        image: { url },
      },
      { upload: conn.waUploadToServer }
    );
    return imageMessage;
  };

  const thumbnail = await image("./level.jpg");
  const isSewa = command === "sewabot";
  const listData = isSewa ? sewaList : premiumList;
  const title = isSewa ? "Layanan" : "PREMIUM BOT MATS.TOREE";

  let layanan = text.toLowerCase().trim();

  if (listData[layanan]) {
    let price = listData[layanan];
    conn.reply(
      m.chat,
      `✅ *${title} Dipilih*  
🕒 Durasi: *${layanan}*  
💰 Harga: *Rp ${price.toLocaleString()}*  

${paymentInfo}`,
      m
    );
  } else {
    const cards = Object.entries(listData).map(([layanan, harga]) => ({
      header: {
        imageMessage: thumbnail,
        hasMediaAttachment: true,
      },
      body: {
        text: `📦 Layanan: *${layanan}*\n💰 Harga: *Rp ${harga.toLocaleString()}*`,
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: "cta_copy",
            buttonParamsJson: `{"display_text":"SALIN FORMAT","id":"format${layanan.replace(
              /\s/g,
              ""
            )}","copy_code":"${usedPrefix + command} ${layanan}"}`,
          },
        ],
      },
    }));

    let msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: {
                text: `📌 Salin format dan kirim pesan untuk melakukan order!`,
              },
              carouselMessage: {
                cards,
                messageVersion: 1,
              },
            },
          },
        },
      },
      { quoted: m }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  }
};

// Handler untuk ".bukti" dan media dengan caption ".bukti"
handler.before = async (m, { conn }) => {
  const ownerNumber = "6285931018333@s.whatsapp.net";

  const isBukti =
    m.text?.toLowerCase() === ".bukti" || m.caption?.toLowerCase() === ".bukti";

  if (isBukti) {
    await conn.reply(
      m.chat,
      "✅ *Bukti pembayaran telah diterima!*\n📌 *Menunggu konfirmasi dari owner.*\n\n🔗 *Selagi menunggu, kirimkan link grup jika melakukan sewabot.*",
      m
    );

    const notif = `📩 *Notifikasi Bukti Pembayaran*\n\n📌 *Pengguna:* @${
      m.sender.split("@")[0]
    }\n✅ *Telah mengirim bukti pembayaran!*`;
    await conn.sendMessage(ownerNumber, { text: notif, mentions: [m.sender] });
  }
};

handler.help = ["sewabot", "premium"];
handler.tags = ["main"];
handler.command = ["sewabot", "premium"];
handler.daftar = true;

export default handler;
