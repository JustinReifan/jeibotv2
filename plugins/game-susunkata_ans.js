import similarity from 'similarity'

const threshold = 0.72

export async function before(m) {
    let id = 'susunkata-' + m.chat

    if (/^[./!#]?suska/i.test(m.text)) return true
    if (!this.game || !(id in this.game)) return true
    if (!m.quoted || !m.text) return true

    // ⛔ Pastikan semua elemen tersedia
    let session = this.game[id]
    if (!Array.isArray(session) || session.length < 4) return true
    if (m.quoted.id !== session[0]?.id) return true

    let json = session[1]
    let reward = session[2]
    let jawabanBenar = json.jawaban.toLowerCase().trim()
    let userJawab = m.text.toLowerCase().trim()

    if (/^((me)?nyerah|surr?ender)$/i.test(userJawab)) {
        clearTimeout(session[3])
        delete this.game[id]
        return m.reply('*Yah, menyerah ya... 😢*')
    }

    if (userJawab === jawabanBenar) {
        global.db.data.users[m.sender].koin += reward
        clearTimeout(session[3])
        delete this.game[id]
        return m.reply(`*✓ Benar!* 🎉\n+${reward} Koin`)
    }

    if (similarity(userJawab, jawabanBenar) >= threshold) {
        return m.reply('*Dikit lagi!* 😬')
    }

    return m.reply('*Kurang tepat!* ❌')
}

export const exp = 0