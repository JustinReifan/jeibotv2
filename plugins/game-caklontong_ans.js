import similarity from 'similarity'

const threshold = 0.72

export async function before(m) {
    let id = m.chat
    if (/^[./!#]?(calo|bantuan)/i.test(m.text)) return true
    if (!this.caklontong || !(id in this.caklontong)) return true
    if (!m.quoted || !m.text) return true
    if (m.quoted.id !== this.caklontong[id][0]?.id) return true

    let json = this.caklontong[id][1]
    let jawabanBenar = json.jawaban.toLowerCase().trim()
    let userJawab = m.text.toLowerCase().trim()

    if (userJawab === jawabanBenar) {
        global.db.data.users[m.sender].koin += this.caklontong[id][2]
        clearTimeout(this.caklontong[id][3])
        delete this.caklontong[id]
        return this.reply(m.chat, `*✓ Benar!* 🎉 +${this.caklontong[id][2]} Koin\n${json.deskripsi}`, m)
    }

    if (similarity(userJawab, jawabanBenar) >= threshold) {
        return m.reply('*Dikit lagi!* 😬')
    }

    return m.reply('*Salah!* ❌')
}

export const exp = 0