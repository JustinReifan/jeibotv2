function formatTime(ms) {
    let s = Math.floor(ms / 1000) % 60
    let m = Math.floor(ms / (1000 * 60)) % 60
    let h = Math.floor(ms / (1000 * 60 * 60)) % 24
    let d = Math.floor(ms / (1000 * 60 * 60 * 24))

    return [
        d ? `${d} hari` : '',
        h ? `${h} jam` : '',
        m ? `${m} menit` : '',
        s ? `${s} detik` : ''
    ].filter(Boolean).join(' ')
}

let handler = async (m, { conn }) => {
    const users = Object.entries(global.db.data.users)
        .filter(([_, u]) => u.afk && u.afk > -1)

    if (users.length === 0) {
        return conn.reply(m.chat, '❌ Tidak ada pengguna yang sedang AFK.', m)
    }

    let list = await Promise.all(users.map(async ([jid, user]) => {
        const name = user.nama || await conn.getName(jid)
        const reason = user.afkReason || 'Tanpa Alasan'
        const duration = formatTime(new Date() - user.afk)
        return `• ${name}\n  ➠ Alasan: ${reason}\n  ➠ Durasi: ${duration}`
    }))

    // Buat fkon (fake quoted contact)
    const fkon = {
        key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`,
            remoteJid: 'status@broadcast',
        },
        message: {
            contactMessage: {
                displayName: 'AFK List',
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;AFK;;;\nFN:AFK\nitem1.TEL;waid=0:0\nitem1.X-ABLabel:AFK\nEND:VCARD`,
            },
        },
    }

    conn.sendMessage(m.chat, {
        text: `📋 *Daftar Pengguna AFK:*\n\n${list.join('\n\n')}`,
        mentions: users.map(([jid]) => jid)
    }, { quoted: fkon })
}

handler.help = ['listafk']
handler.tags = ['main']
handler.command = /^listafk$/i

export default handler