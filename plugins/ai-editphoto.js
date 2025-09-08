import fetch from 'node-fetch';
import uploadImage from '../lib/uploadFile.js';

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/^image/.test(mime) && !/webp/.test(mime)) {
      m.reply('⏳ Sedang memproses gambar, harap tunggu...');

      const img = await q.download();
      const out = await uploadImage(img);

      const prompt = m.text.split(' ').slice(1).join(' ');

      if (!prompt) {
        return m.reply('❌ Mohon masukkan permintaan pengeditan, contoh: *ubah warna hijab menjadi biru*');
      }

      const api = await fetch(`https://api.neoxr.eu/api/photo-editor?image=${encodeURIComponent(out)}&q=${encodeURIComponent(prompt)}&apikey=${neoxr}`);
      const result = await api.json();

      if (!result.status) throw '❌ Gagal memproses gambar.';

      const { data } = result;
      conn.sendFile(m.chat, data.url, null, `✅ Gambar berhasil diedit: ${data.prompt}`, m);
    } else {
      m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
  } catch (e) {
    console.error(e);
    m.reply(`❌ Terjadi kesalahan saat memproses gambar. Silakan coba lagi.`);
  }
};

handler.help = ['editphoto'];
handler.tags = ['ai'];
handler.command = ['editphoto'];
handler.limit = true
handler.daftar = true

export default handler;