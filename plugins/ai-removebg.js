const result = await import("../lib/removebg.js");
import axios from 'axios'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || ''
if (!mime) throw 'Kirim/Reply Gambar Dengan Caption ' + usedPrefix+command 
m.reply(wait)
let cap = `*Result from* : ${usedPrefix + command} `
const media = await q.download()
const a = await result.removeBg(media);
const buffer = Buffer.from(a, "base64");
await conn.sendFile(m.chat, buffer, "", "", m);
}
handler.help = ['removebg']
handler.tags = ['ai']
handler.command = /^(removebg|nobg)$/i
handler.limit = true
handler.daftar = true
export default handler