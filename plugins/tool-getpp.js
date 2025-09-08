import fetch from 'node-fetch'
let handler = async(m) => {
	try {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender
    let url = await conn.profilePictureUrl(who, 'image')
    await conn.sendFile(m.chat, url, 'profile.jpg', `@${who.split`@`[0]}`, m, null, { mentions: [who]})
 } catch (e) {
    m.reply('Pp Nya Di Privasi :( atau tidak ada Pp')
  }
}
handler.command = /^(get(pp|profile))$/i;
handler.help = ["getprofile"];
handler.tags = ["group"];
handler.group = false;
handler.limit = true;
handler.daftar = true

export default handler;