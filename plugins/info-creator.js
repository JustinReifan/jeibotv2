import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, text, args, command }) => {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let name = await conn.getName(who)

  const sentMsg = await conn.sendContactArray(m.chat, [
    [`${nomorwa}`, `${await conn.getName(nomorwa+'@s.whatsapp.net')}`, `ItsMeMatt`, ``, `Mats.toreeOfc@gmail.com`, `Indonesia`, `https://www.instagram.com/StoryKecur_`,`Owner MatsToree - MD`]
  ], m)
  await conn.sendMessage(m.chat, { text: `Hallo Kak @${m.sender.split('@')[0]}, Itu Nomor Ownerku!`, mentions: [m.sender] })
  } 

handler.help = ['owner']
handler.tags = ['info']
handler.command = /^(owner|creator)/i

export default handler