import axios from 'axios'
import uploadImage from '../lib/uploadImage.js'

const handler = async (m, { command, usedPrefix, conn, text, args }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!mime) {
    return conn.reply(m.chat, 'Kirim atau balas gambar dengan caption *.gemini-vision*', m)
  }

  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

  const media = await q.download()
  const url = await uploadImage(media)

  try {
    const res = await axios.get(`https://api.neoxr.eu/api/gemini-vision?image=${url}&lang=id&apikey=${neoxr}`)
    const { data } = res.data
    await conn.sendFile(m.chat, data.image, '', data.description, m)
  } catch (e) {
    conn.reply(m.chat, `Haii @${m.sender.replace(/@.+/g, '')}, saat ini fitur *${usedPrefix}${command}* sedang cooldown. Silakan coba lagi nanti.`, m)
  }
}

handler.help = ['gemini-vision']
handler.tags = ['ai']
handler.command = /^(gemini-vision|geminivisi)$/i
handler.limit = true
handler.register = true
handler.daftar = true

export default handler