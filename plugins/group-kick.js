import { areJidsSameUser } from '@adiwajshing/baileys'

let handler = async (m, { conn, participants }) => {
  const self = (conn.user && (conn.user.jid || conn.user.id)) || ''
  const raw = m.quoted ? [m.quoted.sender] : (m.mentionedJid || [])

  const targets = raw.map(u => {
    const p = participants.find(v =>
      areJidsSameUser(v.id, u) ||
      areJidsSameUser(v.jid, u) ||
      areJidsSameUser(v.lid, u)
    )
    return p?.jid
  }).filter(j => typeof j === 'string' && j.endsWith('@s.whatsapp.net') && !areJidsSameUser(j, self))

  const adminSet = new Set(participants.filter(v => v.admin).map(v => v.jid))
  const kicked = []
  for (const jid of targets) {
    if (adminSet.has(jid)) continue
    try { await conn.groupParticipantsUpdate(m.chat, [jid], 'remove') } catch {}
    kicked.push(jid)
    await delay(1000)
  }

  if (!kicked.length) return m.reply('Tidak ada user valid untuk dikeluarkan.')

  const tags = kicked.map(j => '@' + j.split('@')[0])
  m.reply(`*Sukses Mengeluarkan* ${tags.join(' ')}`, null, { mentions: kicked })
}

handler.help = ['kick']
handler.tags = ['group']
handler.command = /^(kick)$/i
handler.admin = true
handler.group = true
handler.botAdmin = true
handler.daftar = true

export default handler

const delay = ms => new Promise(r => setTimeout(r, ms))