import axios from 'axios'

const query = [
  'islami', 'lucu', 'sepak%20bola', 'qoutes%20islami', 'ceramah%20singkat', 'anime', 'video%20menarik', 'funny%20video', 'video%20viral', 'humor',
  'video%20sad%20vibes', 'lagu%20galau', 'sad%20story', 'vibes%20galau', 'Moonlight', 'moon',
  'vibes%20bulan%20malam%20hari', 'vibes%20bintang', 'vibes%20hujan', 'vibes%20bulan', 'vibes%20laut', 'vibes%20anime%20sad', 'vibes%20melancholy', 'vibes%20sunset', 'vibes%20nostalgia'
]

let handler = async (m, {
    conn,
    args,
    text,
    usedPrefix,
    command
}) => {
  m.reply('Tunggu sebentar...'); // Menampilkan pesan tunggu
  tiktoks(`${query[Math.floor(Math.random() * query.length)]}`).then(a => {
    let cap = a.title
    conn.sendMessage(m.chat, {video: {url: a.no_watermark}, caption: cap}, {quoted: m})
  }).catch(err => {
    m.reply('Error: Tidak dapat mengambil video.'); // Pesan error
  });
}
handler.help = ['tiktokrandom']
handler.tags = ['downloader']
handler.command = /^(tiktokrandom|ttrandom)$/i
handler.limit = true 
handler.register = true

handler.daftar = true

export default handler

async function tiktoks(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: {
          keywords: query,
          count: 10,
          cursor: 0,
          HD: 1
        }
      });
      const videos = response.data.data.videos;
      if (videos.length === 0) {
        reject("Tidak ada video ditemukan.");
      } else {
        const gywee = Math.floor(Math.random() * videos.length);
        const videorndm = videos[gywee]; 

        const result = {
          title: videorndm.title,
          cover: videorndm.cover,
          origin_cover: videorndm.origin_cover,
          no_watermark: videorndm.play,
          watermark: videorndm.wmplay,
          music: videorndm.music
        };
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
}