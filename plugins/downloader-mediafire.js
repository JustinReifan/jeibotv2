/*
Plugin ini dibuat oleh © ItsMeMatt ✘ ChatGPT
Menggunakan API dari: https://api.neoxr.eu
Fitur: downloader-mediafire

🤝 Mohon untuk tidak menghapus watermark ini.  
Meski ada bantuan ChatGPT, ide tetap butuh effort — dan itu mahal wkwkwk.  
Terima kasih atas apresiasinya!

📢 Channel WhatsApp: https://whatsapp.com/channel/0029Vb62vNgFsn0h0TEx6q1b  
📩 Kontak WA: wa.me/6282191987064
*/


import fetch from 'node-fetch'

const handler = async (m, { conn, args, command }) => {
  const url = args[0]
  if (!url || !url.includes('mediafire.com')) {
    return m.reply(`Contoh:\n${command} https://www.mediafire.com/file/a8cermi1xtwwnk7/GBWA_MiNi_v2.0_SamMods.apk/file`)
  }

  try {
    await m.reply('Sedang memproses file dari MediaFire...')

    const res = await fetch(`https://api.neoxr.eu/api/mediafire?url=${encodeURIComponent(url)}&apikey=${global.neoxr}`)
    const json = await res.json()

    if (!json.status || !json.data?.url) {
      return m.reply('Gagal mengambil data MediaFire. Pastikan link valid dan coba lagi.')
    }

    const { title, size, extension, mime, url: downloadUrl } = json.data

    const caption = `
*MediaFire Downloader*

⭔ Nama File : *${title}*
⭔ Ukuran    : *${size}*
⭔ Ekstensi  : *${extension}*
⭔ Tipe MIME : *${mime}*

File dikirim sebagai dokumen.
`.trim()

    await conn.sendMessage(m.chat, {
      document: { url: downloadUrl },
      fileName: title,
      mimetype: mime,
      caption
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('Terjadi kesalahan saat mengunduh file. Coba lagi nanti.')
  }
}

handler.help = ['mediafire <url>']
handler.tags = ['downloader']
handler.command = /^(mediafire|mf(dl)?)$/i
handler.limit = true
handler.daftar = true

export default handler