export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true

  let chat = global.db.data.chats[m.chat]
  let isVideo = m.mtype === 'videoMessage'
  let senderId = m.key.participant || m.sender
  let messageId = m.key.id

  // Jika fitur antiVideo aktif dan pesan adalah video
  if (chat.antiVideo && isVideo) {
    // Jika pengirim bukan admin dan bot memiliki izin admin
    if (!isAdmin && isBotAdmin) {
      await m.reply(`*Video Terdeteksi*\n\nMaaf, hanya admin yang diperbolehkan mengirim video di grup ini. Video kamu akan dihapus secara otomatis.`)

      // Menghapus pesan video
      return this.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: messageId,
          participant: senderId
        }
      })
    }

    // Jika pengirim adalah admin
    if (isAdmin) {
      await m.reply(`*Video Terdeteksi*\n\nKamu adalah admin, jadi bebas mengirim video kapan saja.`)
    }
  }

  return true
}