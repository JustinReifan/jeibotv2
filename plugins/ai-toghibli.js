import fetch from 'node-fetch'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime.startsWith('image/')) throw `📸 Kirim/Reply gambar dengan caption *${usedPrefix + command}*`

    m.reply('🧙‍♂️ Mengubah gambarmu menjadi gaya Ghibli... tunggu sebentar ya!')

    let media = await q.download()
    let url = await uploadImage(media)

    let api = `https://api.neoxr.eu/api/toghibli?image=${encodeURIComponent(url)}&apikey=${global.neoxr}`
    let res = await fetch(api)

    if (!res.ok) throw '❌ Gagal mengambil data dari API.'

    let json = await res.json()
    if (!json.status || !json.data?.url) throw '❌ Respons API tidak sesuai.'

    let buffer = await fetch(json.data.url).then(v => v.buffer())

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: '✨ Gambar berhasil diubah ke gaya Ghibli!'
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply(`❌ Terjadi kesalahan:\n${e.message || e}`)
  }
}

handler.help = ['toghibli']
handler.tags = ['ai']
handler.command = /^toghibli$/i
handler.limit = true
handler.daftar = true

export default handler