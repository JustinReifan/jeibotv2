import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} Hi`;
  m.reply('*⏳ Sedang mencari jawaban dari Bard...*');
  try {
    const apiUrl = `https://api.neoxr.eu/api/bard?q=${encodeURIComponent(text)}&apikey=${neoxr}`;
    const res = await fetch(apiUrl);
    const json = await res.json();
    if (!json.status) throw json.message || 'Error API';
    const message = json.data.message;
    await conn.sendMessage(m.chat, { text: message }, { quoted: m });
  } catch (error) {
    console.error(error);
    throw 'Terjadi kesalahan saat memproses permintaan Bard';
  }
};

handler.help = ['bard'];
handler.tags = ['ai'];
handler.command = /^(bard)$/i;
handler.limit = true;
handler.daftar = true

export default handler;