import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/^image/.test(mime) && !/webp/.test(mime)) {
      m.reply('⏳ Sedang memproses gambar, harap tunggu...');

      const img = await q.download();
      const out = await uploadImage(img);

      const api = await fetch(`https://api.neoxr.eu/api/nowm?image=${encodeURIComponent(out)}&apikey=${neoxr}`);
      const response = await api.json();

      if (!response.status) throw '❌ Gagal menghapus watermark dari gambar.';

      const { data } = response;
      conn.sendFile(m.chat, data.url, null, `✅ Watermark berhasil dihapus!`, m);
    } else {
      m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
  } catch (e) {
    console.error(e);
    m.reply(`❌ Terjadi kesalahan saat memproses gambar. Silakan coba lagi.`);
  }
};

handler.help = ['removewm'];
handler.tags = ['ai'];
handler.command = ['removewm','nowm'];
handler.premium = false;
handler.limit = true;
handler.daftar = true

export default handler;