import { areJidsSameUser } from '@adiwajshing/baileys'

let handler = async (m, { conn, participants }) => {
  const domainRe = /@s\.whatsapp\.net$|@lid$/
  const targets = participants
    .filter(u => domainRe.test(u.id))
    .filter(u => !u.admin)
    .filter(u => !areJidsSameUser(u.id, conn.user.id))
    .map(u => u.id)

  if (targets.length < 1) {
    return m.reply('Di grup ini tidak ada member yang bisa dikeluarkan (hanya kamu dan aku, atau semuanya admin).')
  }

  const batchSize = 10
  const kickedUser = []

  for (let i = 0; i < targets.length; i += batchSize) {
    const batch = targets.slice(i, i + batchSize)
    try {
      await conn.groupParticipantsUpdate(m.chat, batch, 'remove')
      kickedUser.push(...batch)
      await delay(1000)
    } catch (e) {
      console.error('Kick batch error:', e)
      await delay(1000)
    }
  }

  if (kickedUser.length === 0) {
    return m.reply('Tidak ada member yang berhasil dikeluarkan.')
  }

  await m.reply(
    `Sukses mengeluarkan ${kickedUser.length} member:\n` +
    kickedUser.map(v => '@' + v.split('@')[0]).join('\n'),
    null,
    { mentions: kickedUser }
  )
}

handler.tags = ['group']
handler.help = ['kickall']
handler.command = /^(kickall)$/i

handler.admin = true
handler.group = true
handler.botAdmin = true
handler.daftar = true

export default handler

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))