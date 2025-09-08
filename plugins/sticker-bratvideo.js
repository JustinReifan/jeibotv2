import axios from 'axios'
import { createSticker, StickerTypes } from 'wa-sticker-formatter'

let handler = async (m, { conn, command, usedPrefix, text }) => {
  text = m.quoted && !text ? m.quoted.text : text
  if (!text) return m.reply(`Masukkan teks contoh : ${usedPrefix + command} hello world`)

  await m.reply('Tunggu sebentar...')

  try {
    let url = `https://brat.siputzx.my.id/gif?text=${encodeURIComponent(text)}`
    let buffer = (await axios.get(url, { responseType: 'arraybuffer' })).data

    let stickerBuffer = await createSticker(buffer, {
      type: StickerTypes.FULL,
      pack: global.stickpack,
      author: global.stickauth,
      categories: ['😂'],
      id: '.',
      quality: 80,
      background: null
    })

    await conn.sendFile(m.chat, stickerBuffer, '', '', m)
  } catch (e) {
    m.reply('Terjadi error saat membuat stiker.')
  }
}

handler.command = /^(brat(video|v))$/i
handler.tags = ['sticker']
handler.help = ['bratvideo <teks>']
handler.limit = true
handler.daftar = true

export default handler