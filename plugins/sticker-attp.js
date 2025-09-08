let handler = async (m, { conn, text }) => {
  if (!text) throw '⚠️ Tulis teks untuk dijadikan stiker.\n\nContoh: *.attp* scroll dulu bos'

  await conn.sendMessage(m.chat, {
    react: {
      text: '🕒',
      key: m.key,
    }
  })

  try {
    const teks = encodeURIComponent(text)
    const url = `https://api.betabotz.eu.org/api/maker/attp?text=${teks}&apikey=${global.lann}`

    await conn.sendFile(m.chat, url, 'attp.webp', '', m, { asSticker: true })
  } catch (e) {
    console.error('[ATT] ERROR:', e)
    await conn.reply(m.chat, '❌ Gagal membuat stiker ATTp.', m)
  }
}

handler.help = ['attp']
handler.tags = ['sticker']
handler.command = /^attp$/i
handler.limit = true
handler.daftar = true

export default handler