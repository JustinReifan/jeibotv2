let handler = async (m, { conn, args, groupMetadata, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) throw 'Perintah ini hanya bisa digunakan di dalam grup.'
  if (!groupMetadata || !groupMetadata.id) {
    groupMetadata = await conn.groupMetadata(m.chat).catch(() => null)
  }
  if (!groupMetadata) throw 'Gagal mengambil metadata grup.'
  if (!isBotAdmin) throw 'Jadikan bot sebagai admin terlebih dahulu.'
  if (!isAdmin) throw 'Fitur ini hanya bisa digunakan oleh admin grup.'
  const code = await conn.groupInviteCode(groupMetadata.id)
  await m.reply('https://chat.whatsapp.com/' + code)
}

handler.help = ['linkgc']
handler.tags = ['group']
handler.command = /^(linkgc)$/i
handler.group = true
handler.botAdmin = true
handler.admin = true
handler.daftar = true

export default handler