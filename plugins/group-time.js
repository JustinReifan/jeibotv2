import fs from "fs"
import moment from "moment-timezone"

const dbPath = "./grouptime.json"
let schedule = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : {}
const saveDB = () => fs.writeFileSync(dbPath, JSON.stringify(schedule, null, 2))
const fmt = (s = "") => s.padStart(5, "0")
const TZ = "Asia/Makassar"

const helpText = () => (
`Jadwal Otomatis Grup (WITA)

• Atur jadwal
  .grouptime <buka>-<tutup>
  contoh: .grouptime 09:00-21:00

• Lihat jadwal
  .grouptime list

• Hapus jadwal
  .grouptime clear

Semua jadwal menggunakan zona waktu Asia/Makassar (WITA).`
)

let handler = async (m, { args }) => {
  if (!args[0]) return m.reply(helpText())

  const sub = args[0].toLowerCase()

  if (sub === "list") {
    if (!schedule[m.chat]) return m.reply("Belum ada jadwal untuk grup ini.")
    const { open, close } = schedule[m.chat]
    const nowStr = moment().tz(TZ).format("HH:mm")
    const isOpen = nowStr >= open && nowStr < close
    const status = isOpen ? "Terbuka" : "Tertutup"
    return m.reply(
`Jadwal Grup (WITA)
────────────
Buka   : ${open}
Tutup  : ${close}
Zona   : ${TZ}
Waktu  : ${nowStr}
Status : ${status}`
    )
  }

  if (sub === "clear") {
    if (!schedule[m.chat]) return m.reply("Tidak ada jadwal untuk dihapus.")
    delete schedule[m.chat]
    saveDB()
    return m.reply("Jadwal grup berhasil dihapus.")
  }

  const timeRange = args[0]
  const [openRaw, closeRaw] = timeRange.split("-")
  if (!openRaw || !closeRaw) return m.reply("Format jam tidak valid. Contoh: 09:00-21:00")

  const open = fmt(openRaw)
  const close = fmt(closeRaw)
  const hhmm = /^\d{2}:\d{2}$/
  if (!hhmm.test(open) || !hhmm.test(close)) return m.reply("Gunakan format HH:mm, misal 09:00 atau 21:30")

  schedule[m.chat] = { open, close }
  saveDB()
  const nowLocal = moment().tz(TZ).format("HH:mm")
  return m.reply(
`Jadwal disimpan
────────────
Buka   : ${open}
Tutup  : ${close}
Zona   : ${TZ}
Waktu  : ${nowLocal}`
  )
}

handler.help = ["grouptime"]
handler.tags = ["group"]
handler.command = /^grouptime$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler

setInterval(async () => {
  const nowUTC = moment.utc()
  for (const [chatId, { open, close }] of Object.entries(schedule)) {
    try {
      const nowLocal = nowUTC.clone().tz(TZ).format("HH:mm")
      if (nowLocal === open) {
        await global.conn.groupSettingUpdate(chatId, "not_announcement")
        await global.conn.sendMessage(chatId, { text: `Grup dibuka otomatis pada ${open} (${TZ})` })
      } else if (nowLocal === close) {
        await global.conn.groupSettingUpdate(chatId, "announcement")
        await global.conn.sendMessage(chatId, { text: `Grup ditutup otomatis pada ${close} (${TZ})` })
      }
    } catch (e) {
      console.error(`Error pada grup ${chatId}:`, e)
    }
  }
}, 60 * 1000)