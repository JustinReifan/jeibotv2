let handler = async (m, { conn, text }) => {
    let users = global.db.data.users
    let who

    if (m.isGroup && m.mentionedJid.length > 0) {
        who = m.mentionedJid[0]
    } else if (text) {
        let number = text.replace(/[^0-9]/g, '')
        who = number + '@s.whatsapp.net'
    } else {
        throw 'Siapa yang mau di-unban? Tag atau masukkan nomornya.'
    }

    if (!users[who]) throw 'Nomor tersebut belum terdaftar di database!'

    users[who].banned = false
    users[who].warning = 0
    conn.reply(m.chat, `Berhasil unban ${who}`, m)
}

handler.help = ['unban']
handler.tags = ['owner']
handler.command = /^unban(user)?$/i
handler.rowner = true
handler.daftar = true

export default handler