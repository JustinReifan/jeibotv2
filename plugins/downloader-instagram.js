import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} https://www.instagram.com/p/XXXXXXXXXXX`;
  m.reply('*⏳ Sedang mencari konten Instagram...*');
  try {
    const res = await fetch(`https://api.neoxr.eu/api/ig?url=${encodeURIComponent(text)}&apikey=${neoxr}`);
    const json = await res.json();
    if (!json.status) throw json.message || 'Error API';

    const data = json.data;
    if (!Array.isArray(data) || data.length === 0) throw 'Media tidak ditemukan';

    for (const media of data) {
      let caption = '';
      if (media.type === 'mp4') {
        caption = `✅ *Video Instagram berhasil diunduh!*\n\n🎥 Nikmati videonya langsung dari bot ini.\n❤️ Dukung kami dengan donasi agar bot tetap aktif dan makin keren!`;
        await conn.sendMessage(m.chat, { video: { url: media.url }, caption }, { quoted: m });
      } else {
        caption = `✅ *Foto Instagram berhasil diunduh!*\n\n📸 Simpan dan bagikan ke teman-temanmu.\n❤️ Yuk bantu support bot ini dengan donasi seikhlasnya!`;
        await conn.sendMessage(m.chat, { image: { url: media.url }, caption }, { quoted: m });
      }
    }
  } catch (error) {
    console.error(error);
    throw '*⚠️ Tidak bisa mengunduh media.*';
  }
};

handler.help = ['instagram'];
handler.tags = ['downloader'];
handler.command = /^(ig|instagram|igdl)$/i;
handler.daftar = true;
handler.limit = true;

export default handler;