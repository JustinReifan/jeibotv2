import { createHash } from 'crypto'

let handler = async function (m, { args }) {
  if (!args[0]) throw 'Masukkan *Serial Number* kamu.\nCek dengan perintah: *.ceksn*'

  const sn = createHash('md5').update(m.sender).digest('hex')
  if (args[0] !== sn) throw 'Serial Number salah!'

  delete global.db.data.users[m.sender]  // benar-benar hapus data user
  m.reply('✅ *Berhasil unregister!*\nSemua data kamu telah dihapus dari sistem.')
}

handler.help = ['unregister']
handler.tags = ['user']
handler.command = /^unreg(ister)?$/i
handler.register = true
handler.daftar = true

export default handler