/*
*<>SFILEDL<>*
SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
DON'T DELETE THIS WM!
HAPUS WM MANDUL 7 TURUNAN 
*BEBAS RECODE,ASAL INI WM JANGAN DIHAPUS ASU*
"aku janji tidak akan hapus wm ini"
SENIN, 15 OKTOBER 2024 19:46
*/
import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`Gunakan format: ${usedPrefix + command} <url>`);

    try {
        const res = await sfile.download(text);
        if (res.status !== 'success') throw res.message;

        const { filename, filesize, mimeType, result } = res.data;

        await conn.sendMessage(m.chat, {
            document: result.buffer,
            mimetype: 'application/zip', // Sesuaikan untuk file ZIP
            fileName: filename.replace(/\.[^/.]+$/, "") + '.zip', // Mengganti ekstensi file menjadi .zip
            caption: `Nama: ${filename}\nUkuran: ${filesize}`
        }, { quoted: m });
    } catch (err) {
        m.reply(`Terjadi kesalahan: ${err}`);
    }
};

handler.help = ["sfiledl"];
handler.tags = ["downloader"];
handler.command = /^sfiledl|sfile$/i;

handler.daftar = true

export default handler;

/* 
SCRAPE BY DAFFA: https://whatsapp.com/channel/0029VaiVeWA8vd1HMUcb6k2S/195
*/
const sfile = {
    download: async function(url) {
        const headers = {
            'referer': url,
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-language': 'en-US,en;q=0.9',
            'user-Agent': 'Postify/1.0.0',
        };

        try {
            const response = await axios.get(url, { headers });
            headers.Cookie = response.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ');

            const [filename, mimetype, downloadLink] = [
                response.data.match(/<h1 class="intro">(.*?)<\/h1>/s)?.[1] || '',
                response.data.match(/<div class="list">.*? - (.*?)<\/div>/)?.[1] || '',
                response.data.match(/<a class="w3-button w3-blue w3-round" id="download" href="([^"]+)"/)?.[1]
            ];
            
            if (!downloadLink) return { creator: 'Daffa ~', status: 'error', code: 500, data: [], message: 'Download link tidak ditemukan!' };

            headers.Referer = downloadLink;
            const final = await axios.get(downloadLink, { headers });

            const [directLink, key, filesize] = [
                final.data.match(/<a class="w3-button w3-blue w3-round" id="download" href="([^"]+)"/)?.[1],
                final.data.match(/&k='\+(.*?)';/)?.[1].replace(`'`, ''),
                final.data.match(/Download File \((.*?)\)/)?.[1]
            ];

            const result = directLink + (key ? `&k=${key}` : '');
            if (!result) return { creator: 'Daffa ~', status: 'error', code: 500, data: [], message: 'Direct Link Download tidak ditemukan!' };

            const data = await this.convert(result, url);

            return { creator: 'Daffa ~', status: 'success', code: 200, data: { filename, filesize, mimetype, result: data } };
        } catch (error) {
            return { creator: 'Daffa ~', status: 'error', code: 500, data: [], message: error.message };
        }
    },

    convert: async function(url, directLink) {
        try {
            const init = await axios.get(url, {
                maxRedirects: 0,
                validateStatus: status => status >= 200 && status < 303,
                headers: {
                    'Referer': directLink,
                    'User-Agent': 'Postify/1.0.0'
                },
            });

            const cookies = init.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
            const redirect = init.headers.location;

            const final_result = await axios.get(redirect, {
                responseType: 'arraybuffer',
                headers: {
                    'referer': directLink,
                    'user-agent': 'Postify/1.0.0',
                    'cookie': cookies,
                },
            });

            const filename = final_result.headers['content-disposition']?.match(/filename=["']?([^"';]+)["']?/)?.[1] || 'Tidak diketahui';
            return {
                filename,
                mimeType: 'application/zip', // Set mimetype sebagai ZIP
                buffer: Buffer.from(final_result.data)
            };
        } catch (error) {
            throw error;
        }
    }
};
/*
*<>SFILEDL<>*
SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
DON'T DELETE THIS WM!
HAPUS WM MANDUL 7 TURUNAN 
*BEBAS RECODE,ASAL INI WM JANGAN DIHAPUS ASU*
"aku janji tidak akan hapus wm ini"
SENIN, 15 OKTOBER 2024 19:46
*/