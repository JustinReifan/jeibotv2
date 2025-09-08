import axios from "axios";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan URL!\n\nContoh:\n${usedPrefix + command} https://videy.co/v?id=QtZ8jT1X1`;
    
    try {
        if (!text.match(/videy/gi)) throw `URL tidak valid!`;
        
        m.reply("Tunggu sebentar, sedang diproses...");
        
        let res = await axios.get(`https://api.neoxr.eu/api/videy?url=${encodeURIComponent(text)}&apikey=${global.neoxr}`);
        let data = res.data.data.url;

        if (!data) throw `Gagal mengambil data.`;

        await conn.sendFile(m.chat, data, 'videy.mp4', "*DONE*", m);
    } catch (e) {
        console.error(e);
        throw "Terjadi kesalahan saat memproses permintaan.";
    }
};

handler.help = ['videy'];
handler.command = /^(videy|videydl)$/i;
handler.tags = ['downloader'];
handler.limit = 5
handler.private = true;

handler.daftar = true

export default handler;