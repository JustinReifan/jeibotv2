import { toAudio } from '../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat]
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!/video|audio/.test(mime)) throw `Reply Video/Vn Nya`
    let media = await q.download?.()
    if (!media) throw 'Can\'t download media'
    let audio = await toAudio(media, 'mp4')
    if (!audio.data) throw 'Can\'t convert media to audio'

    // Kirim sebagai VN (voice note)
    conn.sendFile(m.chat, audio.data, 'audio.opus', '', m, null, {
        mimetype: 'audio/ogg; codecs=opus',
        ptt: true
    })
}
handler.help = ['tomp3']
handler.tags = ['tools']
handler.limit = true
handler.command = /^to(mp3|a(udio)?)$/i
handler.daftar = true

export default handler