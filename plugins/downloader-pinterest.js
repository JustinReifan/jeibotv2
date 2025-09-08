import fetch from 'node-fetch';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default;

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`🚩 Contoh: ${usedPrefix + command} kucing lucu`);

  await m.reply('*_🔍 Tunggu, sedang mencari gambar..._*');

  const query = encodeURIComponent(args.join(' '));
  const response = await fetch(`https://api.betabotz.eu.org/api/search/pinterest?text1=${query}&apikey=${lann}`);
  const data = await response.json();

  if (!data.result || data.result.length === 0) return m.reply('❌ Gambar tidak ditemukan.');

  const images = data.result.sort(() => Math.random() - 0.5).slice(0, 5);

  async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent({
      image: { url }
    }, {
      upload: conn.waUploadToServer
    });
    return imageMessage;
  }

  let cards = [];
  let i = 1;
  for (const img of images) {
    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `Gambar ke - ${i++}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: '乂 P I N T E R E S T'
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: '',
        hasMediaAttachment: true,
        imageMessage: await createImage(img)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [
          {
            name: 'cta_url',
            buttonParamsJson: `{"display_text":"🌐 Lihat di Pinterest","url":"https://www.pinterest.com/search/pins/?q=${query}"}`
          }
        ]
      })
    });
  }

  const carousel = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `✨ Hasil pencarian: *${args.join(' ')}*\nGeser untuk melihat gambar.`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: '© MatsToree AI'
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards
          })
        })
      }
    }
  }, {});

  await conn.relayMessage(m.chat, carousel.message, { messageId: carousel.key.id });
};

handler.help = ['pinterest <teks>'];
handler.tags = ['downloader'];
handler.command = /^(pinterest|pin)$/i;
handler.limit = true;

handler.daftar = true

export default handler;