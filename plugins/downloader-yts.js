import yts from 'yt-search';

let handler = async (m, { conn, text }) => {
  try {
    if (!text) throw 'Oops! Kamu belum memasukkan kata kunci. Coba ketik sesuatu yang ingin kamu cari!';
  
    await conn.reply(m.chat, global.wait, m);

    let results = await yts(text);
    let videos = results.all.filter(v => v.type === 'video').slice(0, 15);

    if (videos.length === 0) throw 'Yah, nggak ada hasil untuk kata kunci tersebut. Coba dengan kata kunci lain ya!';

    let teks = videos.map((v, index) => `
*${index + 1}. ${v.title}*
- Link: ${v.url}
- Durasi: ${v.timestamp}
- Diunggah: ${v.ago}
- Dilihat: ${v.views} kali
`).join('\n\n');

    let thumbnail = videos[0].thumbnail || '';
    await conn.sendFile(m.chat, thumbnail, 'yts.jpeg', teks, m);
  } catch (err) {
    await conn.reply(m.chat, `Ups! Terjadi kesalahan 😔: ${err}`, m);
  }
};

handler.help = ['yts'];
handler.tags = ['downloader'];
handler.command = /^yts(earch)?$/i;
handler.limit = true;

handler.daftar = true

export default handler;
