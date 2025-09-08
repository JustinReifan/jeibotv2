import fetch from 'node-fetch';
import fs from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} https://pixeldrain.com/u/zTFqF1Ww`;

    m.reply('⏳ Sedang mendownload file dari Pixeldrain...');

    try {
        const url = encodeURIComponent(text);
        const res = await fetch(`https://api.neoxr.eu/api/pixeldrain?url=${url}&apikey=${neoxr}`);
        const json = await res.json();

        if (!json.status || !json.data?.url) throw 'Gagal mengambil data dari Pixeldrain.';

        const { filename, url: downloadUrl } = json.data;
        const tmpPath = path.join(tmpdir(), filename);

        const fileRes = await fetch(downloadUrl);
        if (!fileRes.ok) throw 'Gagal mengunduh file dari server Pixeldrain.';
        const buffer = await fileRes.buffer();
        await fs.writeFile(tmpPath, buffer);

        await conn.sendFile(m.chat, tmpPath, filename, null, m);
        await fs.unlink(tmpPath);
    } catch (e) {
        console.error(e);
        m.reply(`❌ Terjadi kesalahan:\n${e.message || e}`);
    }
};

handler.help = ['pixeldrain'];
handler.tags = ['downloader'];
handler.command = /^(pixeldrain|pxdl)$/i;
handler.premium = false;
handler.limit = true

handler.daftar = true

export default handler;