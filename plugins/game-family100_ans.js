import similarity from 'similarity'

const threshold = 0.72

export async function before(m) {
    this.game = this.game || {}
    let id = 'family100_' + m.chat
    if (!(id in this.game)) return true

    let room = this.game[id]
    let text = m.text.toLowerCase().replace(/[^\w\s\-]+/, '')
    let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)

    if (!isSurrender) {
        let index = room.jawaban.indexOf(text)
        if (index < 0) {
            if (Math.max(...room.jawaban
                .filter((_, idx) => !room.terjawab[idx])
                .map(j => similarity(j, text))) >= threshold) {
                m.reply('Dikit lagi!')
            }
            return true
        }

        if (room.terjawab[index]) return true

        let user = global.db.data.users[m.sender]
        room.terjawab[index] = m.sender
        user.koin += room.winScore
    }

    let isWin = room.terjawab.every(v => v)
    let caption = `
*Soal:* ${room.soal}
Terdapat *${room.jawaban.length}* jawaban${room.jawaban.some(v => v.includes(' ')) ? ` (terdapat jawaban dengan spasi)` : ''}

${isWin ? '*SEMUA JAWABAN TERJAWAB*' : isSurrender ? '*MENYERAH!*' : ''}

${room.jawaban.map((jawaban, i) => (
    isSurrender || room.terjawab[i]
        ? `(${i + 1}) ${jawaban} ${room.terjawab[i] ? '@' + room.terjawab[i].split('@')[0] : ''}`
        : false
)).filter(Boolean).join('\n')}

${isSurrender ? '' : `+${room.winScore} Koin tiap jawaban benar`}
`.trim()

    const msg = await this.reply(m.chat, caption, null, {
        mentions: this.parseMention(caption)
    })

    room.msg = msg
    if (isWin || isSurrender) delete this.game[id]

    return true
}