import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  if (!args[0]) throw '⚠️ Masukkan URL YouTube!';
  if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(args[0])) throw '❌ URL Tidak valid!';

  m.reply('⏳ Sedang memproses...');

  try {
    const apiUrl = `https://api.ammaricano.my.id/api/download/youtube?url=${encodeURIComponent(args[0])}&format=mp3`;
    const res = await fetch(apiUrl);

    if (!res.ok) throw `❌ API Error: ${res.status} ${res.statusText}`;
    const json = await res.json();

    if (!json?.success || json.code !== 200 || !json.result?.download) {
      throw '❌ Gagal mengambil audio.';
    }

    const { title, thumbnail, download: downloadUrl } = json.result;

    const audioRes = await fetch(downloadUrl);
    if (!audioRes.ok) throw `❌ Gagal unduh audio: ${audioRes.status} ${audioRes.statusText}`;
    const audioBuffer = await audioRes.buffer();

    await conn.sendMessage(
      m.chat,
      {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        fileName: `${title || 'youtube'}.mp3`,
        ptt: false,
        contextInfo: thumbnail
          ? {
              externalAdReply: {
                title: title,
                body: 'YouTube MP3',
                thumbnailUrl: thumbnail,
                mediaType: 1,
                renderLargerThumbnail: false,
                sourceUrl: args[0],
              },
            }
          : {},
      },
      { quoted: m }
    );
  } catch (error) {
    console.error(error);
    throw '❌ Terjadi kesalahan saat memproses permintaan!';
  }
};

handler.tags = ['downloader'];
handler.help = ['ytmp3'];
handler.command = /^(ytmp3|yta)$/i;
handler.limit = true;

export default handler;