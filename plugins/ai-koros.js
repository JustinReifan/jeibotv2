import uploadImage from '../lib/uploadFile.js'
import fetch from 'node-fetch'

const handler = async (m, { conn, text }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''
    const isImage = /image\/(jpe?g|png)/.test(mime)

    if (!isImage) {
      return m.reply('*Kirim atau reply gambar dengan caption atau pertanyaan.*')
    }

    const img = await q.download()
    if (!img) return m.reply('Gagal mengunduh gambar.')

    await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

    const imageUrl = await uploadImage(img)
    const prompt = text || (m.quoted && m.quoted.text) || 'deskripsikan tentang foto ini'

    const res = await fetch(`https://api.neoxr.eu/api/koros?image=${encodeURIComponent(imageUrl)}&q=${encodeURIComponent(prompt)}&apikey=${global.neoxr}`)
    const json = await res.json()

    if (!json.status) return m.reply(JSON.stringify(json, null, 2))

    const { question, description, image } = json.data
    let caption = `*Prompt:* ${question}\n\n—\n${description}`
    await conn.sendFile(m.chat, image, 'koros.jpg', caption, m)

  } catch (err) {
    console.error(err)
    m.reply(`Terjadi kesalahan:\n${err.message}`)
  }
}

handler.help = ['koros']
handler.tags = ['ai']
handler.command = /^koros$/i
handler.limit = 3
handler.daftar = true

export default handler