let handler = async (m, { conn, text }) => {
    if (!text) throw 'Format: .addlimit nomor jumlah\nContoh: .addlimit 6281234567890 50'
    
    let [nomor, jumlah] = text.split(' ')
    if (!nomor || !jumlah) throw 'Masukkan nomor dan jumlah\nContoh: .addlimit 6281234567890 50'

    // pastikan nomor valid
    if (!/^\d+$/.test(nomor)) throw 'Nomor tidak valid, hanya angka'
    
    let jid = nomor.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    let poin = parseInt(jumlah)

    if (isNaN(poin)) throw 'Jumlah harus angka'
    if (poin < 1) throw 'Minimal 1'
    if (poin > 100000) return m.reply('Ngotak dikit lah, kebanyakan!\nSystem bisa error kalau kebanyakan.')

    let user = global.db.data.users
    if (!user[jid]) throw 'User belum terdaftar di database'

    user[jid].limit += poin

    conn.reply(m.chat, `✅ Nomor ${nomor} berhasil mendapat +${poin} limit!`, m)
}

handler.help = ['addlimit']
handler.tags = ['owner']
handler.command = /^(addlimit)$/i
handler.owner = true

export default handler