import similarity from 'similarity'

const threshold = 0.72

export async function before(m) {
    let id = 'tebaklogo-' + m.chat
    if (/^[./!#]?hlogo/i.test(m.text)) return true
    if (!this.game || !(id in this.game)) return true
    if (!m.quoted || !m.text) return true
    if (m.quoted.id !== this.game[id][0]?.id) return true

    let json = this.game[id][1]
    let jawabanBenar = json.jawaban.toLowerCase().trim()
    let userJawab = m.text.toLowerCase().trim()

    if (/^((me)?nyerah|surr?ender)$/i.test(userJawab)) {
        clearTimeout(this.game[id][3])
        delete this.game[id]
        return m.reply('*Yah, menyerah ya... 😢*')
    }

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

export const exp = 0