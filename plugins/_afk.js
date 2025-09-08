export async function before(m, { conn }) {
    if (m.isBaileys || !m.text) return

    let user = global.db.data.users[m.sender]
    if (user && user.afk > -1) {
        let time = formatTime(new Date() - user.afk)
        let reason = user.afkReason ? ` karena ${user.afkReason}` : ''
        m.reply(`✅ Kamu kembali online dari AFK${reason}\n🕒 Selama ${time}`)
        user.afk = -1
        user.afkReason = ''
    }

    let mentioned = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
    for (let jid of mentioned) {
        let target = global.db.data.users[jid]
        if (!target || target.afk < 0) continue

        let name = target.nama || await conn.getName(jid)
        let time = formatTime(new Date() - target.afk)
        let reason = target.afkReason ? ` dengan alasan: ${target.afkReason}` : ''
        m.reply(`📵 *${name} sedang AFK*${reason}\n🕒 Selama ${time}`)
    }
}

function formatTime(ms) {
    let seconds = Math.floor(ms / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)

    seconds %= 60
    minutes %= 60
    hours %= 24

    return [
        days ? `${days} hari` : '',
        hours ? `${hours} jam` : '',
        minutes ? `${minutes} menit` : '',
        seconds ? `${seconds} detik` : ''
    ].filter(Boolean).join(' ')
}