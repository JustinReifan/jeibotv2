import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (m, { conn }) => {
    m.reply("[❗] Mengambil berita terkini...");

    try {
        // URL yang akan di-scrape (Contoh dari Detik.com)
        const url = 'https://www.detik.com/';  // Ganti dengan URL situs berita lainnya jika perlu
        
        // Ambil HTML dari halaman utama situs berita
        const { data } = await axios.get(url);
        
        // Menggunakan cheerio untuk memparsing HTML dan mencari berita
        const $ = cheerio.load(data);

        // Mengambil berita utama (Misalnya, mengambil artikel dengan kelas tertentu)
        const headlines = [];
        
        $('article h3 a').each((i, element) => {
            const title = $(element).text();
            const link = $(element).attr('href');
            headlines.push({ title, link });
        });

        // Menyusun pesan dengan berita terkini
        let newsText = "🔹 *Berita Terkini* 🔹\n\n";
        
        headlines.slice(0, 5).forEach((headline, index) => {
            newsText += `${index + 1}. ${headline.title}\n${headline.link}\n\n`;
        });

        // Kirim pesan dengan berita terkini
        await conn.sendMessage(m.chat, { text: newsText }, { quoted: m });
    } catch (error) {
        console.error(error);
        m.reply("[❗] Terjadi kesalahan saat mengambil berita.");
    }
};

handler.help = ['berita'];
handler.tags = ['info'];
handler.command = /^(berita|news)$/i;
handler.daftar = true

export default handler;