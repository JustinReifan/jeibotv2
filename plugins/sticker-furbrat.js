import { sticker } from '../lib/sticker.js';

const cooldown = new Map();

const handler = async (m, { conn, args }) => {
    const user = m.sender;
    const quo = args.length >= 1 ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;

    if (!quo) return m.reply("[❗] Masukkan atau balas teks.");

    // Menampilkan pesan "Stiker sedang diproses"
    m.reply("Stiker sedang diproses...");

    // Menetapkan cooldown untuk pengguna
    cooldown.set(user, Date.now());

    try {
        const url = await sticker(null, `https://furrbrats.vercel.app/generate?text=${quo}&chara=1&aligwn=center pending`, global.packname, global.author);
        conn.sendFile(m.chat, url, 'sticker.webp', quo, m);
    } catch (error) {
        console.error(error);
        m.reply("[❗] Terjadi kesalahan saat membuat stiker.");
    }
};

handler.help = ['furbrat'];
handler.tags = ['sticker'];
handler.command = /^(furbrat)$/i;

handler.limit = true;
handler.daftar = true
export default handler;