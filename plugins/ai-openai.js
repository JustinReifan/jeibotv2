import fetch from 'node-fetch';

const handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`Masukkan pertanyaan!\n\nContoh: ${usedPrefix + command} Siapa presiden Indonesia?`);
  }

  try {
    await m.reply('Tunggu sebentar...');

    let res = await fetch(`https://api.neoxr.eu/api/o3?q=${encodeURIComponent(text)}&apikey=Kemii`);
    let json = await res.json();

    if (!json.status || !json.data?.message) {
      return m.reply('Gagal mendapatkan jawaban. Coba lagi nanti.');
    }

    await m.reply(json.data.message);
  } catch (err) {
    console.error(err);
    return m.reply('Terjadi kesalahan. Coba lagi nanti.');
  }
};

handler.command = handler.help = ['ai', 'openai', 'chatgpt'];
handler.tags = ['ai'];
handler.limit = true;
handler.daftar = true

export default handler;