export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true

  let chat = global.db.data.chats[m.chat]
  let isFoto = m.mtype === 'imageMessage'
  let hapus = m.key.participant
  let bang = m.key.id

  if (chat.antiFoto && isFoto && isBotAdmin) {
    if (!isAdmin) {
      // Hapus pesan gambar
      await this.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: bang,
          participant: hapus
        }
      })

      // Kirim peringatan
      return this.sendMessage(m.chat, {
        text: `⚠️ Gambar dari @${hapus.split('@')[0]} telah dihapus karena tidak diperbolehkan dalam grup ini!`,
        mentions: [hapus]
      })
    }
  }

  return true
}