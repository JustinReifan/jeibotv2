const jlimit = 50
const blimit = 100
const expPerCoin = 50  // Setiap 1 koin = 50 EXP
let handler = async (m, { conn, command, args, usedPrefix }) => {
    let type = (args[0] || '').toLowerCase()
    let _type = (args[1] || '').toLowerCase()
    let jualbeli = (args[0] || '').toLowerCase()
    const chatnya = `
*Contoh :*
.jual limit (Untuk Menjual)
.beli limit (Untuk Membeli)
.beli koin (Untuk Membeli Koin dengan EXP)
`.trim()

    try {
        if (/jual|sell/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
            switch (type) {
                case 'limit':
                    if (global.db.data.users[m.sender].limit >= count * 1) {
                        global.db.data.users[m.sender].koin += jlimit * count
                        global.db.data.users[m.sender].limit -= count * 1
                        conn.reply(m.chat, `Sukses Menjual ${count} Limit Dengan Harga ${jlimit * count} Koin `.trim(), m)
                    } else conn.reply(m.chat, `Limit Kamu Tidak Cukup`.trim(), m)
                    break
                default:
                    return conn.reply(m.chat, chatnya, m)
            }
        } else if (/beli|buy/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
            switch (type) {
                case 'limit':
                    if (global.db.data.users[m.sender].koin >= blimit * count) {
                        global.db.data.users[m.sender].koin -= blimit * count
                        global.db.data.users[m.sender].limit += count * 1
                        conn.reply(m.chat, `Sukses Membeli ${count} Limit Dengan Harga ${blimit * count} Koin `.trim(), m)
                    } else conn.reply(m.chat, `Koin Kamu Tidak Cukup`.trim(), m)
                    break
                case 'koin':
                    const expRequired = expPerCoin * count  // Menghitung EXP yang diperlukan untuk beli koin
                    if (global.db.data.users[m.sender].exp >= expRequired) {
                        global.db.data.users[m.sender].exp -= expRequired
                        global.db.data.users[m.sender].koin += count
                        conn.reply(m.chat, `Sukses Membeli ${count} Koin Dengan ${expRequired} EXP `.trim(), m)
                    } else {
                        conn.reply(m.chat, `EXP Kamu Tidak Cukup Untuk Membeli ${count} Koin`.trim(), m)
                    }
                    break
                default:
                    return conn.reply(m.chat, chatnya, m)
            }
        }
    } catch (e) {
        conn.reply(m.chat, chatnya, m)
        console.log(e)
    }
}

handler.help = ['jual', 'beli']
handler.tags = ['user']
handler.command = /^(jual|beli)$/i
handler.group = false
handler.daftar = true
export default handler