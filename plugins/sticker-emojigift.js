import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Masukkan emoji yang ingin diubah menjadi gift!');
  m.reply('*⏳ Mengubah emoji ke gift...*');

  try {
    const res = await fetch(`https://api.neoxr.eu/api/emojito?q=${encodeURIComponent(text)}&apikey=${neoxr}`);
    const json = await res.json();
    if (!json.status) return m.reply('Gagal mengubah emoji menjadi gift!');

    const giftUrl = json.data.url;
    await conn.sendMessage(m.chat, { sticker: { url: giftUrl } });
  } catch (error) {
    m.reply('Terjadi kesalahan.');
  }
};

handler.help = ['emojigift <emoji>'];
handler.tags = ['sticker'];
handler.command = /^(emojigift)$/i;
handler.limit = true
handler.daftar = true
export default handler;