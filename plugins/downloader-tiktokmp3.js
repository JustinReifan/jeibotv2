import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) throw `Linknya mana?\nContoh: ${usedPrefix + command} https://www.tiktok.com/@username/video/1234567890`

  m.reply(wait)
  
  try {
    const api = `https://api.neoxr.eu/api/tiktok?url=${encodeURIComponent(text)}&apikey=${global.neoxr}`
    const { data } = await axios.get(api)

    if (!(data?.status === 200 || data?.status === true)) throw data?.message || 'Gagal mengambil data dari API.'

    const result = data.data || data.result
    const title = result?.title || result?.desc || 'Tiktok Audio'
    const author = result?.author?.nickname || result?.author || '-'
    const audioUrl = result?.music?.play || result?.audio || result?.music_url
    if (!audioUrl) throw 'URL audio tidak ditemukan.'

    const caption = `乂 *T I K T O K*\n♮ *Username:* ${author}\n♮ *Description:* ${title}\n• _Mengunduh audio..._`
    const msg = await conn.sendMessage(m.chat, { text: caption }, { quoted: m })
    const safeName = title.replace(/[\\/:*?"<>|]+/g, '_').slice(0, 150)

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: `${safeName}.mp3`
    }, { quoted: msg })

  } catch (e) {
    throw e?.message || e
  }
}

handler.help = ['tiktokmp3']
handler.tags = ['downloader']
handler.command = /^(tiktokmp3|ttmp3)$/i
handler.limit = true
handler.daftar = true

export default handler