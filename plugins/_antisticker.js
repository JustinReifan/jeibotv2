export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true

  let chat = global.db.data.chats[m.chat]
  let isSticker = m.mtype === 'stickerMessage'
  let hapus = m.key.participant || m.sender
  let bang = m.key.id

  if (chat.antiSticker && isSticker) {
    if (!isBotAdmin) return

    if (isAdmin) {
      await m.reply(`*Sticker terdeteksi!*\nNamun karena kamu admin, kamu bebas sebebas angin malam.\nLanjutkan aksimu, bosku!`)
      return true
    }

    await m.reply(`🚫 *PERINGATAN: STICKER TERDETEKSI*\n\nPengiriman sticker dilarang di grup ini.\nTolong ikuti aturan agar grup tetap nyaman untuk semua anggota.\n\n⚠️ Jika kamu mengulangi pelanggaran ini, kamu akan *dikeluarkan dari grup* tanpa peringatan lagi.`)

    await this.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: bang,
        participant: hapus
      }
    })

    return true
  }

  return true
}