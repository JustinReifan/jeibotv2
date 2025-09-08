import fs from 'fs'
import path from 'path'
import moment from 'moment-timezone'

const file = path.join('./database/redeemcode.json')

function loadCodes() {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : []
}

function saveCodes(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

function parseDuration(str) {
  const match = str.match(/^(\d+)([smhd])$/)
  if (!match) return 0
  const [, num, unit] = match
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
  return parseInt(num) * (units[unit] || 0)
}

function formatDuration(str) {
  const match = str.match(/^(\d+)([smhd])$/)
  if (!match) return str
  const [, num, unit] = match
  const label = { s: 'detik', m: 'menit', h: 'jam', d: 'hari' }
  return `${num} ${label[unit] || ''}`.trim()
}

let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Khusus Owner!')
  if (!args[0]) return m.reply('Format: .buatkode kode|limit|koin|exp|durasi|maxklaim')

  const [code, limit, koin, exp, duration, maxClaim] = args[0].split('|')
  if (!code || !duration) return m.reply('⚠️ Contoh: .buatkode Bonus2025|10|1000|20|1h|3')

  const codes = loadCodes()
  if (codes.find(c => c.code === code)) return m.reply('❌ Kode sudah ada.')

  const expiredMs = parseDuration(duration)
  if (!expiredMs) return m.reply('❌ Format durasi salah. Gunakan s, m, h, d.')

  const newCode = {
    code,
    limit: parseInt(limit) || 0,
    koin: parseInt(koin) || 0,
    exp: parseInt(exp) || 0,
    expiredAt: Date.now() + expiredMs,
    maxClaim: parseInt(maxClaim) || 1,
    claimed: []
  }

  codes.push(newCode)
  saveCodes(codes)

  const durasiTeks = formatDuration(duration)

  const msg = `
🟢 *Kode Redeem Baru!*

✅ *Kode:* ${code}
📦 *Bonus Limit:* +${newCode.limit}
💰 *Bonus Koin:* +${newCode.koin}
🧪 *Bonus Exp:* +${newCode.exp}
⏰ *Expired:* ${durasiTeks}
👥 *Maksimal Klaim:* ${newCode.maxClaim} orang

🎁 *Klaim sekarang dengan perintah:*
.redeem ${code}
`.trim()

  await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
}

handler.help = ['buatkode <kode|limit|koin|exp|durasi|maxklaim>']
handler.tags = ['owner']
handler.command = /^buatkode$/i
handler.owner = true

export default handler