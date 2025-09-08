import fs from 'fs'
import path from 'path'

const file = path.join('./database/redeemcode.json')

function loadCodes() {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : []
}

function saveCodes(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

let handler = async (m, { args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Khusus owner.')
  if (!args[0]) return m.reply('Gunakan: .hapusredeem <kode>')

  let codes = loadCodes()
  let index = codes.findIndex(c => c.code === args[0])

  if (index === -1) return m.reply('❌ Kode tidak ditemukan.')

  let deleted = codes.splice(index, 1)[0]
  saveCodes(codes)

  m.reply(`🗑️ Kode *${deleted.code}* berhasil dihapus.\nJumlah klaim: ${deleted.claimed.length}/${deleted.maxClaim}`)
}

handler.help = ['hapusredeem <kode>']
handler.tags = ['owner']
handler.command = /^hapusredeem$/i
handler.owner = true

export default handler