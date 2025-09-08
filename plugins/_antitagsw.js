import fs from 'fs'

const antiTagSWPath = './lib/antitagsw.json'
if (!fs.existsSync(antiTagSWPath)) fs.writeFileSync(antiTagSWPath, '{}', 'utf-8')

const loadAntiTagSW = () => JSON.parse(fs.readFileSync(antiTagSWPath, 'utf-8'))
const saveAntiTagSW = (data) => fs.writeFileSync(antiTagSWPath, JSON.stringify(data, null, 4), 'utf-8')

let antiTagSWGroup = loadAntiTagSW()

let handler = async (m, { conn, args, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply("❌ Maaf, perintah ini hanya bisa digunakan di dalam grup.")
  if (!(isAdmin || isOwner)) return m.reply("🚫 Hanya admin grup yang dapat mengatur fitur ini.")
  if (!args[0]) return m.reply("⚠️ Mohon sertakan argumen:\nContoh: .antitagsw on / off")

  if (args[0] === "on") {
    if (antiTagSWGroup[m.chat]) return m.reply("✅ Fitur Anti Tag SW sudah aktif di grup ini.")
    antiTagSWGroup[m.chat] = true
    saveAntiTagSW(antiTagSWGroup)
    return m.reply("✅ Fitur Anti Tag SW berhasil diaktifkan di grup ini.")
  } else if (args[0] === "off") {
    if (!antiTagSWGroup[m.chat]) return m.reply("⚠️ Fitur Anti Tag SW sudah nonaktif sebelumnya.")
    delete antiTagSWGroup[m.chat]
    saveAntiTagSW(antiTagSWGroup)
    return m.reply("✅ Fitur Anti Tag SW telah dinonaktifkan.")
  } else {
    return m.reply("⚠️ Argumen tidak dikenal. Silakan pilih antara *on* atau *off*.")
  }
}

handler.before = async (m, { conn, isBotAdmin }) => {
  if (!m.isGroup || !antiTagSWGroup[m.chat]) return

  if (m.mtype === 'groupStatusMentionMessage') {
    let tagger = m.sender
    let participants = (await conn.groupMetadata(m.chat)).participants
    let isAdminSender = participants.some(p => p.id === tagger && (p.admin === 'admin' || p.admin === 'superadmin'))

    if (isAdminSender) {
      await conn.sendMessage(m.chat, {
        text: `✅ Tidak masalah @${tagger.split("@")[0]}, Anda adalah admin. Silakan gunakan fitur tag SW sesuai kebutuhan 😎`,
        mentions: [tagger]
      })
      return
    }

    try {
      if (isBotAdmin) {
        await conn.sendMessage(m.chat, { delete: m.key })
        await conn.groupParticipantsUpdate(m.chat, [tagger], 'remove')
        await conn.sendMessage(m.chat, {
          text: `🚫 @${tagger.split("@")[0]} telah melanggar aturan grup dengan menandai grup melalui status.\n\nPengguna telah dikeluarkan.`,
          mentions: [tagger]
        })
      }
    } catch (e) {
      console.error('❗ Terjadi kesalahan saat menghapus atau mengeluarkan anggota:', e)
    }
  }
}

handler.command = ['antitagsw']
handler.group = true
handler.admin = true

export default handler