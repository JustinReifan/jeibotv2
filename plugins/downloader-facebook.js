import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Silakan masukkan URL Facebook.');

  const apiUrl = `https://api.neoxr.eu/api/fb?url=${encodeURIComponent(text)}&apikey=${global.neoxr}`;

  try {
    await m.reply('🔄 Sedang memproses video, mohon tunggu sebentar...');

    const response = await fetch(apiUrl);
    const result = await response.json();

    if (!result.status) return m.reply('Gagal mengambil data. Pastikan URL benar atau coba lagi nanti.');

    const videoData = result.data.find(v => v.quality === 'HD') || result.data[0];

    if (!videoData || !videoData.url) return m.reply('Gagal mendapatkan video.');

    const videoResponse = await fetch(videoData.url);
    const videoBuffer = await videoResponse.buffer();

    let caption = `✅ *Video Facebook berhasil diunduh!*\n\n📽️ Nikmati videonya langsung dari bot ini.\n❤️ Dukung terus bot ini dengan donasi agar tetap aktif dan berkembang!`;

    await conn.sendMessage(m.chat, { video: videoBuffer, caption }, { quoted: m });
  } catch (error) {
    console.error(error);
    m.reply('Terjadi kesalahan saat mengambil atau mengunduh video.');
  }
};

handler.help = ['facebook'];
handler.tags = ['downloader'];
handler.command = /^(facebook|fb|fbdl)$/i;
handler.limit = true;

handler.daftar = true

export default handler;