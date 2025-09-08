import similarity from 'similarity'

const threshold = 0.72

export async function before(m) {
    let id = m.chat
    if (/^[./!#]?hsur/i.test(m.text)) return true
    if (!this.tebaksurah || !(id in this.tebaksurah)) return true
    if (!m.quoted || !m.text) return true
    if (m.quoted.id !== this.tebaksurah[id][0]?.id) return true

    let json = this.tebaksurah[id][1]
    let jawabanBenar = json.surah.englishName.toLowerCase().trim()
    let userJawab = m.text.toLowerCase().trim()

    if (/^((me)?nyerah|surr?ender)$/i.test(userJawab)) {
        clearTimeout(this.tebaksurah[id][3])
        delete this.tebaksurah[id]
        return m.reply('*Yah, menyerah ya... 😢*')
    }

    if (userJawab === jawabanBenar) {
        global.db.data.users[m.sender].koin += 499
        clearTimeout(this.tebaksurah[id][3])
        delete this.tebaksurah[id]
        return m.reply(`*✓ Benar!* 🎉\nSelamat, kamu mendapatkan:\n• 499 Koin`)
    }

    if (similarity(userJawab, jawabanBenar) >= threshold) {
        return m.reply('*Dikit lagi!* 😬')
    }

    return m.reply('*Salah!* ❌')
}

export const exp = 0