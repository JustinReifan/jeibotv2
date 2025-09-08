import fetch from 'node-fetch'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime.startsWith('image/')) throw `📸 Balas atau kirim gambar dengan caption *${usedPrefix + command}*`

    let media = await q.download()
    let url = await uploadImage(media)

    let api = `https://api.neoxr.eu/api/age?image=${encodeURIComponent(url)}&apikey=${global.neoxr}`
    let res = await fetch(api)
    let json = await res.json()

    if (!json.status || !json.data) throw '❌ Gagal mendeteksi wajah. Coba foto lain.'

    let { age, gender } = json.data

    await m.reply(
`📷 *Hasil Deteksi Wajah:*
👤 Umur: *${age} tahun*
⚧️ Gender: *${gender === 'male' ? 'Laki-laki' : 'Perempuan'}*`
    )
  } catch (e) {
    console.error(e)
    m.reply('❌ Gagal memproses gambar. Pastikan gambar valid dan mengandung wajah.')
  }
}

handler.help = ['cekumur']
handler.tags = ['ai']
handler.command = /^cekumur$/i
handler.limit = true
handler.daftar = true

export default handler