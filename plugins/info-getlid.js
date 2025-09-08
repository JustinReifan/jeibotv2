const handler = async (m, { conn }) => {
  const sender = m.sender || m.key?.participant || m.key?.remoteJid
  const jid = sender
  const type = jid.includes('@lid')
    ? 'Channel (LID)'
    : jid.includes('@s.whatsapp.net')
      ? 'Pengguna WhatsApp Biasa'
      : 'Tipe tidak dikenal'

  await conn.sendMessage(m.chat, {
    text: `乂  *G E T  -  L I D*\n\nID kamu: ${jid}\nTipe: ${type}`,
    mentions: [jid]
  }, { quoted: m })
}

handler.command = ['getlid', 'gtlid']
handler.tags = ['info']
handler.desc = 'Cek apakah pengirim adalah channel (@lid) atau pengguna biasa'
handler.register = true // optional: jika pakai sistem daftar

export default handler