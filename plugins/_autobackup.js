import fs from 'fs'
import moment from 'moment-timezone'

export async function all(m) {
    let setting = global.db.data.settings[this.user.jid]

    if (setting.backup) {
        if (new Date() - setting.backupDB > 60 * 60 * 1000) { // 1 jam
            let waktu = moment().tz('Asia/Jakarta').format('DD MMMM YYYY, HH:mm:ss')
            let filePath = './database.json'

            // masukin nomor mu
            let ownerNumber = '62812345678910@s.whatsapp.net'
            await global.conn.sendMessage(ownerNumber, {
                document: fs.readFileSync(filePath),
                mimetype: 'application/json',
                fileName: 'database.json',
                caption: `📦 *Backup Database Otomatis*\n🕒 ${waktu} WIB`
            }, { quoted: m })

            setting.backupDB = new Date() * 1
        }
    }

    return !0
}