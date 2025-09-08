import fs from 'fs'

let handler = m => m

handler.before = async function (m) {
    handler.daftar = true
    let id = m.chat
    let reward = 9999
    let body = typeof m.text == 'string' ? m.text : false

    this.tebakbom = this.tebakbom || {}
    if (!(id in this.tebakbom) && m.quoted && /❏ *B O M B*/i.test(m.quoted.text)) {
        return this.reply(m.chat, `Sesi telah berakhir, silahkan kirim .tebakbom untuk membuat sesi baru.`, m)
    }

    if ((id in this.tebakbom) && !isNaN(body)) {
        let timeout = 180000
        let cell = this.tebakbom[id][1].find(v => v.position == body)
        if (!cell) return this.reply(m.chat, `Untuk membuka kotak, kirim angka 1 - 9`, m)

        if (cell.emot === '💥') {
            cell.state = true
            let board = this.tebakbom[id][1]
            let teks = `❏  *B O M B*\n\n`
            teks += `Duaarrr bangsat!\n\n`
            teks += board.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += board.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
            teks += board.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
            teks += `Timeout : [ *${(timeout / 60000)} menit* ]\n`
            teks += `*Permainan selesai!*, kotak berisi bom terbuka.`
            await this.sendFile(m.chat, "https://telegra.ph/file/287cbe90fe5263682121d.jpg", "", teks, m)
            clearTimeout(this.tebakbom[id][2])
            delete this.tebakbom[id]
        } else if (cell.state) {
            return this.reply(m.chat, `Kotak ${cell.number} sudah dibuka, silakan pilih kotak lain.`, m)
        } else {
            cell.state = true
            let board = this.tebakbom[id][1]
            let open = board.filter(v => v.state && v.emot !== '💥').length

            if (open >= 8) {
                let teks = `❏  *B O M B*\n\n`
                teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
                teks += board.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
                teks += board.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
                teks += board.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
                teks += `Timeout : [ *${(timeout / 60000)} menit* ]\n`
                teks += `*Permainan selesai!* kotak berisi bom tidak terbuka : (+ *${reward}* Exp )`
                await this.sendFile(m.chat, "https://telegra.ph/file/f6ebfea2758b947e1e49d.jpg", "", teks, m)
                db.data.users[m.sender].exp += reward
                clearTimeout(this.tebakbom[id][2])
                delete this.tebakbom[id]
            } else {
                let teks = `❏  *B O M B*\n\n`
                teks += `Kirim angka *1* - *9* untuk membuka *9* kotak nomor di bawah ini :\n\n`
                teks += board.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
                teks += board.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
                teks += board.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
                teks += `Timeout : [ *${(timeout / 60000)} menit* ]\n`
                teks += `Kotak berisi bom tidak terbuka.`
                await this.reply(m.chat, teks, m)
                db.data.users[m.sender].exp += reward
            }
        }
    }
}

export default handler

async function randomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}