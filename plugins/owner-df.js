import { join } from 'path'
import { unlinkSync } from 'fs'

let handler = async (m, { conn, usedPrefix: _p, __dirname, args, text, command }) => {
  let ar = Object.keys(plugins)
  let ar1 = ar.map(v => v.replace('.js', ''))

  if (!text) throw `Uhm.. mana nama plugin-nya?\n\nContoh:\n${_p + command} info`
  if (!ar1.includes(args[0])) return m.reply(`*Plugin tidak ditemukan!*\n\nDaftar plugin yang tersedia:\n${ar1.map(v => ' ' + v).join`\n`}`)

  const file = join(__dirname, '../plugins/' + args[0] + '.js')
  unlinkSync(file)
  conn.reply(m.chat, `✅ Berhasil menghapus: "plugins/${args[0]}.js"`, m)
}

handler.help = ['df']
handler.tags = ['owner']
handler.command = /^(df)$/i

handler.mods = true
handler.daftar = true

export default handler