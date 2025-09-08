let handler = async (m, { conn, text }) => {
    if (!text) throw 'Format: .addkoin nomor jumlah\nContoh: .addkoin 6281234567890 100'
    
    let [nomor, jumlah] = text.split(' ')
    if (!nomor || !jumlah) throw 'Masukkan nomor dan jumlah\nContoh: .addkoin 6281234567890 100'

    // pastikan nomor valid
    if (!/^\d+$/.test(nomor)) throw 'Nomor tidak valid, hanya angka'
    
    let jid = nomor.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    let poin = parseInt(jumlah)

    if (isNaN(poin)) throw 'Jumlah harus angka'
    if (poin < 1) throw 'Minimal 1'
    if (poin > 99999999) return m.reply('Ngotak dikit lah, kebanyakan!\nSystem bisa error kalau kebanyakan.')

    let user = global.db.data.users
    if (!user[jid]) throw 'User belum terdaftar di database'

    user[jid].koin += poin

    conn.reply(m.chat, `✅ Nomor ${nomor} berhasil mendapat +${poin} koin!`, m)
}

handler.help = ['addkoin']
handler.tags = ['owner']
handler.command = /^(addkoin)$/i
handler.owner = true

export default handler