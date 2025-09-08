let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `gunakan *${usedPrefix}list* untuk melihat daftar pesan yg tersimpan.`

  // pastikan struktur sama seperti addlist
  const chat = db.data.chats[m.chat] || (db.data.chats[m.chat] = {})
  if (!chat.listStr) chat.listStr = {}

  const msgs = chat.listStr

  if (!(text in msgs)) throw `'${text}' tidak terdaftar di daftar pesan.`
  delete msgs[text]

  m.reply(`\n  [💬] berhasil menghapus pesan di daftar List dengan nama '${text}'.\n`)
}

handler.help = ['dellist']
handler.tags = ['store']
handler.command = /^dellist$/i
handler.admin = true
handler.group = true
handler.daftar = true

export default handler