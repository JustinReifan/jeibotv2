import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import { writeFile } from 'fs/promises'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const handler = async (m, { conn, args, command }) => {
   if (!args[0]) return m.reply(`Contoh:\n${command} https://vt.tiktok.com/ZSY5SgvHE/`)
   if (!args[0].includes('tiktok.com')) return m.reply('❌ Link tidak valid!')

   await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

   try {
      const res = await fetch(`${APIs.neoxr}/api/tiktok?url=${encodeURIComponent(args[0])}&apikey=${global.neoxr}`)
      const json = await res.json()

      if (!json.status || !json.data) {
         return m.reply('⚠️ Gagal mengambil data dari TikTok.')
      }

      const { video, photo } = json.data

      if (video) {
         const vidRes = await fetch(video)
         if (!vidRes.ok) throw 'Gagal unduh video.'
         const buffer = await vidRes.buffer()

         const tmpPath = path.join(tmpdir(), `tiktok_${Date.now()}.mp4`)
         await writeFile(tmpPath, buffer)

         await conn.sendMessage(m.chat, {
            video: { url: tmpPath },
            mimetype: 'video/mp4',
            caption: '✨ Ini videonya kak! Semoga bermanfaat ya~ Jangan lupa support kami dengan donasi agar kami terus semangat berbagi. Terima kasih!'
         }, { quoted: m })

         fs.unlinkSync(tmpPath) // hapus file setelah dikirim
      } else if (Array.isArray(photo)) {
         for (const p of photo) {
            await conn.sendMessage(m.chat, {
               image: { url: p }
            }, { quoted: m })
            await sleep(2000)
         }
      } else {
         return m.reply('⚠️ Tidak menemukan video atau foto pada link tersebut.')
      }

   } catch (e) {
      console.error(e)
      m.reply(m.chat, 'Ada kesalahan! hubungi owner untuk memperbaikinya.', m)
   }
}

handler.help = ['tiktok']
handler.tags = ['downloader']
handler.command = /^(tiktok|tt|ttdl|tiktokdl)$/i
handler.limit = true
handler.daftar = true

export default handler