import {
  generateWAMessageContent,
  generateWAMessageFromContent,
} from "@adiwajshing/baileys";

import suntikController from "../controllers/suntikController.js";

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    const data = await suntikController.pricelist(
      global.tinped_id,
      global.tinped_key
    );

    if (args.length === 0) {
      // ➤ LANGKAH 1: Menampilkan pilihan kategori
      const groupedByMainCategory = data.reduce((acc, service) => {
        const mainCategory = service.kategori_rekomendasi.split(" ")[0];
        if (!acc[mainCategory]) acc[mainCategory] = [];
        acc[mainCategory].push(service);
        return acc;
      }, {});

      const sections = Object.keys(groupedByMainCategory).map(
        (mainCategory) => {
          const subCategories = [
            ...new Set(
              groupedByMainCategory[mainCategory].map(
                (s) => s.kategori_rekomendasi
              )
            ),
          ];

          const rows = subCategories.map((subCat) => ({
            title: subCat,
            description: `Lihat layanan untuk ${subCat}`,
            id: `${usedPrefix}pricelist ${subCat}`,
          }));

          return {
            title: mainCategory,
            rows,
          };
        }
      );

      await conn.sendMessage(
        m.chat,
        {
          text: "📋 Berikut adalah daftar kategori layanan. Silakan pilih:",
          buttons: [
            {
              buttonId: "action",
              buttonText: { displayText: "Lihat Daftar Layanan" },
              type: 4,
              nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify({
                  title: "📋 Pricelist Lengkap",
                  sections,
                }),
              },
            },
          ],
          react: { text: "✅", key: m.key },
        },
        { quoted: m }
      );
    } else {
      // ➤ LANGKAH 2: Menampilkan layanan detail dalam bentuk carousel
      const subKategoriPilihan = args.join(" ");
      const layananFinal = data.filter(
        (s) =>
          s.kategori_rekomendasi.toLowerCase() ===
          subKategoriPilihan.toLowerCase()
      );

      if (layananFinal.length === 0) {
        return m.reply(`❌ Layanan *${subKategoriPilihan}* tidak ditemukan.`);
      }

      const image = async (url) => {
        const { imageMessage } = await generateWAMessageContent(
          { image: { url } },
          { upload: conn.waUploadToServer }
        );
        return imageMessage;
      };

      const thumbnail = await image("./media/logojei.jpg");

      const cards = layananFinal.map((s) => {
        let cardBody = `⚡ *${s.name}*\n\n`;
        cardBody += `💰 Harga: Rp${Number(s.price).toLocaleString("id-ID")}\n`;
        cardBody += `🔢 Minimal: ${s.min}\n`;
        cardBody += `🔢 Maximal: ${s.max}`;

        const formatOrder = `.ordersuntik ${s.service} | JUMLAH | TARGET`;

        return {
          header: {
            imageMessage: thumbnail,
            hasMediaAttachment: true,
          },
          body: { text: cardBody },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                  display_text: "SALIN FORMAT ORDER",
                  id: `copy_${s.service}`,
                  copy_code: formatOrder,
                }),
              },
            ],
          },
        };
      });

      let msg = generateWAMessageFromContent(
        m.chat,
        {
          viewOnceMessage: {
            message: {
              interactiveMessage: {
                body: {
                  text: `📃 *${subKategoriPilihan}*\n\n*Cara Order:*\n1️⃣ Klik tombol untuk menyalin format pesanan.\n2️⃣ Ganti JUMLAH sesuai kebutuhan.\n3️⃣ Ganti TARGET dengan username/link tujuan.\n\nContoh:\n.ordersuntik 123 | 1000 | https://instagram.com/tinped.id/`,
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
  } catch (e) {
    console.log(e);
    m.reply(
      "❌ Gagal ambil pricelist: " + (e.response?.data?.message || e.message)
    );
  }
};

handler.help = ["pricelist"];
handler.tags = ["suntik"];
handler.command = /^pricelist$/i;

export default handler;
