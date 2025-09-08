import fetch from 'node-fetch'

const handler = async (m, { conn, args, command }) => {
  const url = args[0]
  if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
    return m.reply(`Contoh:\n${command} https://youtu.be/fKRtnMYMW08`)
  }

  try {
    await m.reply('Sedang mengambil video, mohon tunggu...')

    const res = await fetch(`https://api.neoxr.eu/api/youtube?url=${encodeURIComponent(url)}&type=video&quality=360p&apikey=${global.neoxr}`)
    const json = await res.json()

    if (!json.status || !json.data?.url) {
      return m.reply('Gagal mengambil video. Silakan coba beberapa saat lagi.')
    }

    const { title, channel, fduration, views, publish, data } = json

    const caption = `
*YT Video Downloader*

⭔ Title    : *${title}*
⭔ Channel  : *${channel}*
⭔ Duration : *${fduration}*
⭔ Views    : *${views}*
⭔ Publish  : *${publish}*
⭔ Quality  : *${data.quality}*
⭔ Size     : *${data.size}*

File dikirim sebagai video.
`.trim()

    await conn.sendMessage(m.chat, {
      video : { url: data.url },
      mimetype: 'video/mp4',
      fileName: data.filename,
      caption
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('Terjadi kesalahan saat memproses video.')
  }
}

handler.help = ['ytmp4 <url>']
handler.tags = ['downloader']
handler.command = /^(ytmp4|ytvideo|ytv)$/i
handler.limit = true
handler.daftar = true

export default handler