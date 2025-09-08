let handler = async (m, { conn, command }) => {
    let isClose = command === 'tutup' ? 'announcement' :
                  command === 'buka' ? 'not_announcement' : ''

    if (!isClose) throw `*Format salah!*\nKetik *buka* untuk membuka grup.\nKetik *tutup* untuk menutup grup.`

    await conn.groupSettingUpdate(m.chat, isClose)
    await delay(2000) // delay 2 detik
    m.reply(`Grup sekarang sudah *${command === 'tutup' ? 'tertutup' : 'terbuka'}*`)
}

handler.help = ['buka', 'tutup']
handler.tags = ['group']
handler.command = /^(buka|tutup)$/i

handler.admin = true
handler.botAdmin = true
handler.daftar = true

export default handler

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}