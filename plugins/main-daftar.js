import { createHash } from 'crypto'

const Reg = /^([^\d]+)[.|] *?(\d{1,2})$/i

let handler = async function (m, { text, usedPrefix }) {
  let user = global.db.data.users[m.sender]

  if (user.daftar === true) {
    throw `🚫 Kamu sudah terdaftar di database!\n\nJika ingin daftar ulang, ketik:\n*${usedPrefix}unreg <serial_number>*`
  }

  if (!Reg.test(text)) {
    throw `📌 Format salah!\nGunakan: *${usedPrefix}daftar Nama.Umur*\nContoh: *${usedPrefix}daftar Matt.15*`
  }

  let [_, nama, umur] = text.match(Reg)
  umur = parseInt(umur)

  if (!nama) throw '❗ Nama tidak boleh kosong.'
  if (!umur) throw '❗ Umur tidak boleh kosong.'
  if (umur < 13 || umur > 29) throw '⚠️ Umur harus antara 13 hingga 29 tahun.'

  user.nama = nama.trim()
  user.umur = umur
  user.regTime = +new Date()
  user.daftar = true
  user.registered = true

  let sn = createHash('md5').update(m.sender).digest('hex')

  let caption = `🎉 *Pendaftaran Berhasil!*\n\n` +
                `📇 *Nama:* ${nama}\n` +
                `🎂 *Umur:* ${umur} tahun\n` +
                `🆔 *Serial Number:*\n\`\`\`${sn}\`\`\`\n\n` +
                `📌 Simpan SN kamu untuk unregister jika diperlukan.`

  await conn.reply(m.chat, caption, m)
}

handler.help = ['daftar']
handler.tags = ['user']
handler.command = /^(daftar|verify|reg(ister)?)$/i

export default handler