import fetch from 'node-fetch'

let handler = async (m, { conn, text, command }) => {
  if (!text) throw `🧠 Masukkan prompt!\n\nContoh:\n.${command} cat and rat are smile`

  try {
    m.reply('⏳ Sedang membuat gambar...')

    const url = `https://api.neoxr.eu/api/ai-real?q=${encodeURIComponent(text)}&apikey=${global.neoxr}`
    const res = await fetch(url)
    const json = await res.json()

    if (!json.status || !json.data?.url) throw '❌ Gagal membuat gambar.'

    const data = json.data
    const caption = `🖼️ ${global.wm || ''}`

    await conn.sendFile(m.chat, data.url, 'ai-real.jpg', caption, m)
  } catch (e) {
    console.error(e)
    throw '⚠️ Terjadi kesalahan.'
  }
}

handler.help = ['ai-real <prompt>']
handler.tags = ['ai']
handler.command = /^(ai-real)$/i
handler.limit = 3
handler.daftar = true

export default handler