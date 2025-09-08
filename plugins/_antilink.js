let handler = m => m

let groupLinkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i
let channelLinkRegex = /whatsapp\.com\/channel\/([0-9A-Za-z-_]{20,})/i

handler.before = async function (m, { conn, isBotAdmin, isAdmin }) {
    if ((m.isBaileys && m.fromMe) || m.fromMe || !m.isGroup) return true

    let chat = global.db.data.chats[m.chat]
    let isGroupLink = groupLinkRegex.exec(m.text)
    let isChannelLink = channelLinkRegex.exec(m.text)

    if (chat.antiLink && (isGroupLink || isChannelLink)) {
        if (isAdmin) return true // Admin tidak diproses

        const tagSender = await conn.getName(m.sender)

        if (!isBotAdmin) return m.reply('*Bot bukan admin, tidak bisa hapus pesan atau kick member.*')

        // Cek apakah link adalah milik grup sendiri
        if (isGroupLink) {
            let linkGC = 'https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat)
            let isOwnGroupLink = new RegExp(linkGC, 'i').test(m.text)
            if (isOwnGroupLink) return m.reply('*「 ANTI LINK 」*\n\nLink yang dikirim adalah link grup ini sendiri. Aman.*')
        }

        // Hapus pesan
        await conn.sendMessage(m.chat, { delete: m.key })

        // Info ke grup
        await m.reply(`*「 ANTI LINK 」*\n\nTautan terdeteksi dari *${tagSender}*\nPesan dihapus & member dikeluarkan karena melanggar aturan.`)

        // Kick member
        try {
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        } catch (err) {
            m.reply('❌ Gagal mengeluarkan member, mungkin karena bot bukan admin atau tidak memiliki izin.')
        }
    }

    return true
}

export default handler