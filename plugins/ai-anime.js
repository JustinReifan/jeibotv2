import fetch from 'node-fetch'

let handler = async (m, { conn, text, command }) => {
  if (!text) throw `🌸 Masukkan prompt!\n\nContoh:\n.${command} dog on the fire`

  try {
    m.reply('⏳ Sedang membuat gambar...')

    const url = `https://api.neoxr.eu/api/ai-anime?q=${encodeURIComponent(text)}&apikey=${global.neoxr}`
    const res = await fetch(url)
    const json = await res.json()

    if (!json.status || !json.data?.url) throw '❌ Gagal membuat gambar.'

    const data = json.data
    const caption = `🌸 ${global.wm || ''}`

    await conn.sendFile(m.chat, data.url, 'ai-anime.jpg', caption, m)
  } catch (e) {
    console.error(e)
    throw '⚠️ Terjadi kesalahan.'
  }
}

handler.help = ['ai-anime <prompt>']
handler.tags = ['ai']
handler.command = /^(ai-anime)$/i
handler.limit = 5
handler.daftar = true

export default handler