import uploadImage from '../lib/uploadFile.js';
import fetch from 'node-fetch';

async function handler(m, { conn, usedPrefix, command }) {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/^image/.test(mime) && !/webp/.test(mime)) {
      m.reply('⏳ Sedang memproses gambar ke HD, tunggu sebentar...');
      const img = await q.download();
      const uploadedImageUrl = await uploadImage(img);
      const apiUrl = `https://api.siputzx.my.id/api/iloveimg/upscale?image=${encodeURIComponent(uploadedImageUrl)}&scale=2`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Gagal memproses gambar: ${res.statusText}`);
      const buffer = await res.buffer();
      await conn.sendMessage(m.chat, { image: buffer, caption: '✅ Gambar berhasil dijernihkan dan di-HD-kan!' }, { quoted: m });
    } else {
      m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau balas gambar yang sudah dikirim.`);
    }
  } catch (e) {
    console.error(e);
    m.reply(`❌ Terjadi kesalahan saat memproses gambar. Pastikan format gambar benar dan coba lagi nanti.`);
  }
}

handler.command = /^(hd|jernih)$/i;
handler.help = ['hd', 'jernih'];
handler.tags = ['ai'];
handler.limit = true;
handler.daftar = true;

export default handler;