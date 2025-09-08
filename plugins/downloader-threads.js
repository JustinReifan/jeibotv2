import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Contoh:* ${usedPrefix + command} https://www.threads.net/@diiemofc/post/Cujx6ryoYx6`;

    conn.sendMessage(m.chat, {
        react: {
            text: '⏱️',
            key: m.key,
        }
    });

    try {
        const { data, status } = await (await fetch(`https://api.neoxr.eu/api/threads?url=${encodeURIComponent(text)}&apikey=${global.neoxr}`)).json();

        if (!status || !Array.isArray(data) || data.length === 0) {
            throw 'Tidak ada media yang bisa diunduh dari tautan tersebut.';
        }

        for (let media of data) {
            await conn.sendFile(
                m.chat,
                media.url,
                media.type === 'mp4' ? 'threads.mp4' : 'threads.jpg',
                `✅ *Berhasil mengunduh konten dari Threads!*`,
                m
            );
        }
    } catch (error) {
        console.error(error);
        conn.sendMessage(m.chat, { text: `Terjadi kesalahan: ${error.message || error}` }, { quoted: m });
    }
};

handler.help = ['threads'];
handler.tags = ['downloader'];
handler.command = /^(threads|thrd|thrdl)$/i;
handler.limit = true;

handler.daftar = true

export default handler;