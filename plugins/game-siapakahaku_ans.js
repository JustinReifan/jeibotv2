import similarity from 'similarity'

const threshold = 0.72
let handler = m => m

handler.before = async function (m) {
    let id = 'siapakahaku-' + m.chat
    if (/^[./!#]?(who|hint)/i.test(m.text)) return true
    if (!this.game || !(id in this.game)) return true
    if (!m.quoted || !m.text) return true
    if (m.quoted.id !== this.game[id][0]?.id) return true

    let json = this.game[id][1]
    let jawabanBenar = json.jawaban.toLowerCase().trim()
    let userJawab = m.text.toLowerCase().trim()

    if (userJawab === jawabanBenar) {
        global.db.data.users[m.sender].koin += this.game[id][2]
        clearTimeout(this.game[id][3])
        delete this.game[id]
        return m.reply(`*✓ Benar!* 🎉\n+${this.game[id][2]} Koin`)
    }

    if (similarity(userJawab, jawabanBenar) >= threshold) {
        return m.reply('*Dikit lagi!* 😬')
    }

    return m.reply('*Salah!* ❌')
}

handler.exp = 0
handler.daftar = true
export default handler