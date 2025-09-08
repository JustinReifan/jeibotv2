import fetch from 'node-fetch'

async function getLidFromJid(jid, conn) {
    if (jid.endsWith('@lid')) return jid
    const res = await conn.onWhatsApp(jid).catch(() => [])
    return res?.[0]?.lid || jid
}

let timeout = 120000
let poin = 4999

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {}

    const id = await getLidFromJid(m.chat, conn)
    if (id in conn.tekateki) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tekateki[id][0])
        throw false
    }

    let src = await (await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/tekateki.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]

    let caption = `*${command.toUpperCase()}*
${json.soal}

Waktu *${(timeout / 1000).toFixed(2)} Detik*
Ketik ${usedPrefix}htek Untuk Bantuan
Hadiah: 
500 Exp
200 Koin
1 Limit
    `.trim()

    conn.tekateki[id] = [
        await conn.reply(m.chat, caption, m),
        json, poin,
        setTimeout(() => {
            if (conn.tekateki[id]) {
                conn.reply(m.chat, `Waktu Habis!\nJawabannya Adalah *${json.jawaban}*`, conn.tekateki[id][0])
                delete conn.tekateki[id]
            }
        }, timeout)
    ]
}
handler.help = ['tekateki']
handler.tags = ['game']
handler.group = true
handler.command = /^tekateki/i
handler.daftar = true

export default handler