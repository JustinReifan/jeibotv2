import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
        let args = text.trim().split(/\s+/);
        let style = args[1] || "anime";

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime) throw `Kirim/Reply Gambar dengan caption ${usedPrefix}toanime`;

        // Menambahkan pesan penantian
        m.reply('Mohon tunggu sebentar ya, proses ini membutuhkan waktu yang sedikit lebih lama karena kami sedang mengubah gambar Anda menjadi versi anime yang keren! Hehehe...');

        let media = await q.download();
        let url = await uploadImage(media);

        let apiUrl = `https://api.neoxr.eu/api/toanime?image=${encodeURIComponent(url)}&apikey=${neoxr}`;
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch image from API');
        
        let result = await response.json();
        if (!result.status) throw new Error('API error: ' + result.creator);

        let imageUrl = result.data.url;
        let imageResponse = await fetch(imageUrl);
        let imageBuffer = await imageResponse.buffer();

        await conn.sendFile(m.chat, imageBuffer, 'toanime.jpg', global.wm, m);
    } catch (error) {
        m.reply(`Error: ${error}`);
    }
};

handler.help = ['toanime'];
handler.tags = ['ai'];
handler.command = /^(toanime)$/i;

handler.register = true;
handler.limit = 3;
handler.daftar = true

export default handler;