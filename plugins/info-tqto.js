import fetch from 'node-fetch'

let handler = async function (m, { conn, text, usedPrefix }) {
  
let tqto = `
 _*Saya sangat berterima kasih kepada kalian semua*_

╭╾─⊷ _*THANKS TO*_
⋄ My self 
⋄ Zeltoria (Base)
⋄ neoxr (apikey)
⋄ Betabotz (apikey)
⋄ Pengguna Bot..
╰╾──•••
`

	await conn.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/39497eb26a44d30a9b190.jpg' }, caption: tqto }, m)
}
handler.help = ['tqto']
handler.tags = ['info']
handler.command = /^(tqto)$/i;
handler.daftar = true

export default handler;