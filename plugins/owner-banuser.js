let handler = async (m, { conn, text }) => {
    let users = global.db.data.users
    let who

    if (m.isGroup && m.mentionedJid.length > 0) {
        who = m.mentionedJid[0]
    } else if (text) {
        let number = text.replace(/[^0-9]/g, '')
        who = number + '@s.whatsapp.net'
    } else {
        throw 'Siapa yang mau di-ban? Tag atau masukkan nomornya.'
    }

    if (!users[who]) throw 'Nomor tersebut belum terdaftar di database!'

    users[who].banned = true
    conn.reply(m.chat, `Berhasil ban ${who}`, m)
}

handler.help = ['ban']
handler.tags = ['owner']
handler.command = /^ban(user)?$/i
handler.rowner = true
handler.daftar = true

export default handler