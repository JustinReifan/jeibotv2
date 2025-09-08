import { sticker } from '../lib/sticker.js'
import axios from 'axios'

let handler = async (m, { conn, args }) => {
    let who
    if (m.isGroup) {
        who = m.quoted ? m.quoted.sender : m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    } else {
        who = m.quoted ? m.quoted.sender : m.chat
    }

    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else throw "Input teks atau reply teks yang ingin dijadikan quote!"
    
    if (!text) return m.reply('Masukkan teks')
    if (text.length > 100) return m.reply('Maksimal 100 karakter teks!')

    // Ambil nama pengguna asli (push name jika dari pengirim)
    let username = (who === m.sender && m.pushName) || conn.getName(who)
    
    // Ambil foto profil
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png')

    const obj = {
        "type": "quote",
        "format": "png",
        "backgroundColor": "#FFFFFF",
        "width": 512,
        "height": 768,
        "scale": 2,
        "messages": [{
            "entities": [],
            "avatar": true,
            "from": {
                "id": 1,
                "name": username,
                "photo": {
                    "url": pp
                }
            },
            "text": text,
            "replyMessage": {}
        }]
    }

    try {
        const json = await axios.post('https://bot.lyo.su/quote/generate', obj, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (json.data && json.data.result && json.data.result.image) {
            const buffer = Buffer.from(json.data.result.image, 'base64')
            let stiker = await sticker(buffer, false, global.packname, global.author)
            if (stiker) return conn.sendFile(m.chat, stiker, 'Quotly.webp', '', m)
        } else {
            return m.reply('Gagal menghasilkan gambar quote. Coba lagi nanti.')
        }
    } catch (error) {
        console.error(error)
        return m.reply('Terjadi kesalahan saat mencoba membuat sticker quote. Coba lagi nanti.')
    }
}

handler.help = ['qc'].map(v => v + ' <text & reply>')
handler.tags = ['sticker']
handler.command = /^(qc|quotely)$/i
handler.premium = false
handler.limit = true
handler.daftar = true

export default handler