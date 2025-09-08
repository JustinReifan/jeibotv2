let handler = async (m, { command, isAdmin, isBotAdmin, isGroup }) => {
    if (!isGroup) throw "❌ *Fitur ini hanya untuk grup.*"
    if (!isAdmin) throw "❌ *Hanya admin grup yang bisa menggunakan perintah ini.*"

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    switch (command) {
        case 'resetwelcome':
            chat.sWelcome = ''
            m.reply('✅ *Pesan welcome berhasil dikembalikan ke default.*')
            break
        case 'resetbye':
            chat.sBye = ''
            m.reply('✅ *Pesan bye berhasil dikembalikan ke default.*')
            break
        default:
            throw '❌ Perintah tidak dikenal.'
    }
}

handler.help = ['resetwelcome', 'resetbye']
handler.tags = ['group']
handler.command = /^(resetwelcome|resetbye)$/i
handler.group = true
handler.admin = true
handler.daftar = true

export default handler