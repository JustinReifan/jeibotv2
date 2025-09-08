async function getLidFromJid(jid, conn) {
    if (jid.endsWith('@lid')) return jid
    const res = await conn.onWhatsApp(jid).catch(() => [])
    return res?.[0]?.lid || jid
}

let handler = async (m, { conn }) => {
    conn.tekateki = conn.tekateki ? conn.tekateki : {}
    const id = await getLidFromJid(m.chat, conn)

    if (!(id in conn.tekateki)) throw false

    let json = conn.tekateki[id][1]
    conn.reply(m.chat, '```' + json.jawaban.replace(/[AIUEOaiueo]/ig, '_') + '```', m)
}

handler.command = /^htek$/i
handler.group = true
handler.limit = true
handler.daftar = true

export default handler