import fs from 'fs'
let handler = m => m

handler.all = async function (m, { isBlocked }) {
  if (isBlocked) return

  if (
    (m.mtype === 'groupInviteMessage' || 
     m.text.startsWith('Undangan untuk bergabung') || 
     m.text.startsWith('Invitation to join') || 
     m.text.startsWith('Buka tautan ini')) && 
    !m.isBaileys && 
    !m.isGroup
  ) {
    let teks = `
Hai! Sepertinya kamu ingin mengundang *MasToreeBot* ke grup.

Berikut daftar harga layanan:

• *Sewa Bot Grup*
  - 1 Bulan : Rp15.000
  - 5 Bulan : Rp55.000

• *Akun Premium*
  - 1 Bulan : Rp10.000

Butuh durasi lain? Tenang, kami juga menerima request sesuai kebutuhan kamu!

Silakan hubungi admin dengan perintah *.owner*
Terima kasih sudah tertarik menggunakan layanan kami!
`.trim()
    this.reply(m.chat, teks, m)
  }
}

export default handler