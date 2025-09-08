import fetch from 'node-fetch'

const handler = async (m, { conn, args, command }) => {
  const url = args[0]

  if (!url) {
    return m.reply(`Contoh:\n${command} https://twitter.com/mosidik/status/1475812845249957889?s=20`)
  }

  if (!/(twitter\.com|x\.com)\/\w+\/status\/\d+/i.test(url)) {
    return m.reply('URL tidak valid. Pastikan itu adalah link status dari Twitter atau X.')
  }
  // React awal
  await conn.sendMessage(m.chat, {
    react: { text: '⏳', key: m.key }
  })

  try {
    const apiUrl = `https://api.neoxr.eu/api/twitter?url=${encodeURIComponent(url)}&apikey=${neoxr}`
    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status) return m.reply('Gagal mengambil media dari Twitter.')

    const caption = `
✨ *Media berhasil diunduh dari Twitter!*
Dukung kami dengan donasi agar bot ini terus berkembang. 

`.trim()

    for (const media of json.data) {
      const fileName = `twitter_media.${media.type}`

      if (media.type === 'gif') {
        await conn.sendMessage(m.chat, {
          video: { url: media.url },
          gifPlayback: true,
          caption
        }, { quoted: m })
      } else if (media.type === 'mp4') {
        await conn.sendMessage(m.chat, {
          video: { url: media.url },
          caption
        }, { quoted: m })
      } else if (/jpe?g|png/.test(media.type)) {
        await conn.sendMessage(m.chat, {
          image: { url: media.url },
          caption
        }, { quoted: m })
      } else {
        await conn.sendFile(m.chat, media.url, fileName, caption, m)
      }
    }
  } catch (err) {
    console.error(err)
    m.reply('Terjadi kesalahan saat mengunduh media dari Twitter.')
  }
}

handler.help = ['twitter']
handler.tags = ['downloader']
handler.command = /^(twitter|tw|twdl)$/i
handler.limit = true

handler.daftar = true

export default handler