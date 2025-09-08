import fetch from 'node-fetch'
const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
let handler = async (m, {conn, text, args, usedPrefix, command }) => {
if (!args[0]) throw `Linknya??, Example: ${usedPrefix}${command} https://github.com/`
if (!regex.test(args[0])) throw 'Invalid repositories!'

try {
let [_, user, repo] = (args[0] || '').match(regex) || []
repo = repo.replace(/.git$/, '')
let url = `https://api.github.com/repos/${user}/${repo}/zipball`
let filename = (await fetch(url, { method: 'HEAD' })).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
m.reply(`*_sending file, don't spam . . ._*`)
let name = filename.replace('.zip.zip','.zip')
conn.sendFile(m.chat, url, name, null, m)

} catch (e) {
console.log(e)
m.reply(`Terjadi Kesalahan, Tidak Dapat Menemukan Nickname/Repostory Yang Kamu Masukan`)
}
}
handler.help = ['gitclone']
handler.tags = ['downloader']
handler.command = /gitclone/i

handler.limit = true

handler.daftar = true

export default handler
