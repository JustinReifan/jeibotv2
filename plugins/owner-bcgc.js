import moment from 'moment-timezone'

let handler = async (m, { conn, text }) => {
  let d = new Date()
  let locale = 'id'
  let week = d.toLocaleDateString(locale, { weekday: 'long' })
  let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  let time = moment.tz('Asia/Jakarta').format('HH:mm:ss')

  const pesan = m.quoted?.text || text
  if (!pesan) throw '📢 Masukkan teks broadcast!\nContoh: .bcgc Halo semua!'

  let groups = Object.values(await conn.groupFetchAllParticipating())
  let ids = groups.map(v => v.id)

  m.reply(`🚀 Mengirim broadcast ke ${ids.length} grup...\n🕐 Estimasi: ${(ids.length * 3).toFixed(0)} detik`)

  const msg = 
`📢 *Broadcast Message*

📅 ${week}, ${date}
🕒 ${time} WIB

${pesan}`

  for (let id of ids) {
    await conn.sendMessage(id, { text: msg }, { quoted: m })
    await delay(3000) // Jeda 3 detik
  }

  m.reply(`✅ Broadcast selesai ke ${ids.length} grup.`)
}

handler.help = ['bcgc']
handler.tags = ['owner']
handler.command = /^(broadcastgc|bcgc)$/i
handler.owner = true
handler.daftar = true

const delay = ms => new Promise(res => setTimeout(res, ms))

export default handler