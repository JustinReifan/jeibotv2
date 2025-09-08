import fs from 'fs'
import path from 'path'

const file = path.join('./database/redeemcode.json')

function loadCodes() {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : []
}

function saveCodes(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

let handler = async (m, { args }) => {
  if (!args[0]) return m.reply('Gunakan: .redeem <kode>')

  const codes = loadCodes()
  const code = codes.find(c => c.code === args[0])
  if (!code) return m.reply('❌ Kode tidak ditemukan.')
  if (Date.now() > code.expiredAt) return m.reply('⏰ Kode ini sudah kadaluarsa.')
  if (code.claimed.includes(m.sender)) return m.reply('⚠️ Kamu sudah klaim kode ini.')
  if (code.claimed.length >= code.maxClaim) return m.reply('⚠️ Jumlah klaim sudah penuh.')

  let user = global.db.data.users[m.sender]
  user.koin = (user.koin || 0) + (code.koin || 0)
  user.limit = (user.limit || 0) + (code.limit || 0)
  user.exp = (user.exp || 0) + (code.exp || 0)

  code.claimed.push(m.sender)
  saveCodes(codes)

  let message = `
🎉 *Sukses Redeem!*

🔑 *Kode:* ${code.code}
📦 *Bonus Limit:* +${code.limit}
💰 *Bonus Koin:* +${code.koin}
🧪 *Bonus Exp:* +${code.exp}
👥 *Klaim Ke-${code.claimed.length} dari Maksimal ${code.maxClaim} Orang*

Terima kasih telah menggunakan kode redeem! ✨
`.trim()

  m.reply(message)
}

handler.help = ['redeem <kode>']
handler.tags = ['user']
handler.command = /^redeem$/i
handler.daftar = true

export default handler