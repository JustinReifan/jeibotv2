import fetch from 'node-fetch'

let handler = async (m, { args, usedPrefix, command }) => {
  if (!args[0] || !args[0].includes('youtube.com') && !args[0].includes('youtu.be'))
    return m.reply(`📌 Contoh: ${usedPrefix + command} https://youtube.com/watch?v=xxxxx`)

  try {
    const url = encodeURIComponent(args[0])
    const res = await fetch(`https://api.neoxr.eu/api/transcript?url=${url}&apikey=${global.neoxr}`)
    const json = await res.json()

    if (!json.status || !json.data?.text) throw '❌ Gagal mengambil transkrip video.'

    await m.reply(
`*🧠 Ringkasan Video:*

${json.data.text}`
    )
  } catch (e) {
    console.error(e)
    m.reply('❌ Gagal memproses video. Pastikan URL valid dan video mengandung subtitle.')
  }
}

handler.help = ['ytrecap <url youtube>']
handler.tags = ['ai']
handler.command = /^ytrecap$/i
handler.limit = true
handler.daftar = true

export default handler