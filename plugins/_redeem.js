import fs from 'fs'
import path from 'path'

const file = path.join('./database/redeemcode.json')

function loadCodes() {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : []
}

function saveCodes(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

// Plugin ini akan dijalankan otomatis oleh sistem
let handler = async () => {
  let codes = loadCodes()
  const now = Date.now()
  const before = codes.length

  // Filter hanya yang belum expired
  const filtered = codes.filter(c => c.expiredAt > now)

  if (filtered.length !== before) {
    saveCodes(filtered)
    console.log(`[AUTO DELETE] ${before - filtered.length} kode redeem kadaluarsa telah dihapus.`)
  }
}

// Jalankan setiap 5 menit (300.000 ms)
setInterval(handler, 300_000)

export default () => {}