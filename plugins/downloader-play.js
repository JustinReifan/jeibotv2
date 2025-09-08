import yts from 'yt-search'

let handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) throw `Contoh pemakaian:\n.${command} judul lagu`

  const react = (e) =>
    conn.sendMessage(m.chat, { react: { text: e, key: m.key } }).catch(() => {})

  try {
    await react('⏱️')

    const res = await yts(text)
    const list = res?.videos?.length ? res.videos : (res?.all || [])
    if (!list.length) {
      await react('❌')
      return m.reply('Video tidak ditemukan.')
    }

    // ambil hasil pertama
    const v = list[0]
    const url = v?.url || (v?.videoId ? `https://www.youtube.com/watch?v=${v.videoId}` : '')
    const title = v?.title || '-'
    const channel = v?.author?.name || '-'
    const duration = v?.timestamp || (Number(v?.seconds) ? formatDuration(v.seconds) : '-')
    const views = typeof v?.views === 'number' ? v.views.toLocaleString('id-ID') : (v?.views || '-')
    const published = v?.ago || '-'
    const thumb = v?.thumbnail || v?.image || v?.bestThumbnail?.url

    const body = 
`🎶 *Hasil Pencarian*

• Judul     : ${title}
• Channel   : ${channel}
• Durasi    : ${duration}
• Views     : ${views}
• Upload    : ${published}
• Link      : ${url}

Klik *Video* untuk unduh MP4
Klik *Audio* untuk unduh MP3`

    const buttons = [
      { buttonId: `${usedPrefix}ytmp4 ${url}`, buttonText: { displayText: '▶️ Video' }, type: 1 },
      { buttonId: `${usedPrefix}ytmp3 ${url}`, buttonText: { displayText: '🎧 Audio' }, type: 1 },
    ]

    await conn.sendMessage(
      m.chat,
      {
        image: thumb ? { url: thumb } : undefined,
        caption: body,
        buttons,
        headerType: 1,
        viewOnce: true,
        contextInfo: {
          externalAdReply: {
            title: title.slice(0, 60),
            body: `${channel} • ${duration} • ${views}x`,
            thumbnailUrl: thumb,
            sourceUrl: url,
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: false
          }
        }
      },
      { quoted: m }
    )

    await react('✅')
  } catch (err) {
    console.error(err)
    await react('⚠️')
    m.reply('Terjadi kesalahan: ' + (err?.message || err))
  }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play)$/i
handler.limit = true
handler.daftar = true

export default handler

function formatDuration (secs) {
  const s = Number(secs) || 0
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = Math.floor(s % 60)
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(ss)}` : `${m}:${pad(ss)}`
}