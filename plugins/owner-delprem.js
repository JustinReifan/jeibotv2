let handler = async (m, { conn, text }) => {
    if (!text) throw 'Siapa Yang Mau Diberhentikan Sebagai User Premium?'

    let users = global.db.data.users
    let target = text.trim()
    let who = Object.keys(users).find(user => user.includes(target))

    if (!who) throw 'Pengguna tidak ditemukan. Pastikan nomor/ID benar.'

    if (!users[who].premium || Number(users[who].premiumTime || 0) <= Date.now()) {
        return m.reply('⚠️ Pengguna tersebut bukan Premium atau masa aktifnya sudah habis.')
    }

    users[who].premium = false
    users[who].premiumTime = 0

    if (global.db?.write) await global.db.write()

    let nama = await conn.getName(who)
    await conn.reply(m.chat, '✅ Premium berhasil dihapus.', m)
    await conn.sendMessage(who, {
        text: `💳 *Status Premium Dihapus*\n\nHalo *${nama}*,\n\n❌ Status Premium Anda telah dihentikan.\n⚠️ Anda tidak bisa lagi menggunakan fitur premium.\n\nTerima kasih telah menggunakan layanan kami.`
    })
}

handler.help = ['delprem']
handler.tags = ['owner']
handler.command = /^delprem(user)?$/i
handler.rowner = true
handler.daftar = true

export default handler