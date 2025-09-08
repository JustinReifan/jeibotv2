let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Format Salah!\n\nContoh:\n${usedPrefix + command} 6281234567890 7`

    let [number, days] = text.split(" ")
    if (!number || !days) throw `Gunakan format yang benar!\n\nContoh:\n${usedPrefix + command} 6281234567890 7`

    if (isNaN(number) || number.length < 9) return m.reply("Masukkan nomor yang valid!")
    if (isNaN(days)) return m.reply("Jumlah hari harus berupa angka!")

    let target = number.includes("@s.whatsapp.net") ? number : number + "@s.whatsapp.net"
    let user = global.db.data.users[target] || {}

    let jumlahHari = 86400000 * parseInt(days)
    let now = Date.now()

    user.premium = true
    user.premiumTime = now < (user.premiumTime || 0)
        ? user.premiumTime + jumlahHari
        : now + jumlahHari

    global.db.data.users[target] = user

    let nama
    try {
        nama = await conn.getName(target)
    } catch {
        nama = 'User'
    }

    let expiredDate = new Date(user.premiumTime).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })

    m.reply(`✅ Berhasil! ${nama} sekarang Premium selama ${days} hari.\n📆 Expired: ${expiredDate}`)

    conn.sendMessage(target, {
        text: `🎉 Hai Kak ${nama}!\nMasa Premium Kamu Sudah Aktif\n📅 Berlaku selama ${days} hari\n📆 Expired: ${expiredDate}`
    })
}

handler.help = ['addprem <nomor> <hari>']
handler.tags = ['owner']
handler.command = /^(add|tambah|\+)p(rem)?$/i
handler.rowner = true
handler.daftar = true

export default handler