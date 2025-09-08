let handler = async (m, { conn, text }) => {
    const user = global.db.data.users[m.sender]
    user.afk = +new Date()
    user.afkReason = text || 'Tanpa Alasan'

    let name = user.nama || await conn.getName(m.sender)

    conn.sendMessage(m.chat, {
        text: `💤 *${name} sedang AFK*\n\n📌 Alasan: ${user.afkReason}`,
        mentions: [m.sender]
    })
}

handler.help = ['afk']
handler.tags = ['main']
handler.command = /^afk$/i
handler.group = true
handler.daftar = true

export default handler