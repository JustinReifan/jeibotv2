import { sticker } from '../lib/sticker.js'
import axios from 'axios'

let handler = async (m, { text }) => {
  if (!text) return m.reply('⚠️ Tulis teks untuk dijadikan stiker.\n\nContoh: *.ttp* neoxr api')
  if (text.length > 40) return m.reply('⚠️ Maksimal 40 karakter.')

  m.reply('⏳ Membuat stiker dari teks...')

  try {
    const query = encodeURIComponent(text)
    const url = `https://api.neoxr.eu/api/ttp?text=${query}&size=60&color=white&apikey=${global.neoxr}`

    const { data: json } = await axios.get(url)

    if (!json.status || !json.data?.url) {
      throw '❌ Gagal mengambil gambar dari API.'
    }

    const stiker = await sticker(null, json.data.url, global.packname, global.author)
    if (!stiker) throw '❌ Gagal mengubah gambar menjadi stiker.'

    await conn.sendFile(m.chat, stiker, 'ttp.webp', '', m)
  } catch (err) {
    console.error(err)
    m.reply(typeof err === 'string' ? err : '❌ Terjadi kesalahan saat memproses permintaan.')
  }
}

handler.command = /^ttp$/i
handler.tags = ['sticker']
handler.help = ['ttp']
handler.daftar = true
handler.limit = true

export default handler