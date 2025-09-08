let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Masukkan Link Spotify ‼️\n*Contoh:* ${usedPrefix + command} https://open.spotify.com/track/xxxxxxxx`

  if (!/^https?:\/\/(open|play)\.spotify\.com\/track\/[A-Za-z0-9]+/i.test(text)) {
    throw `Link tidak valid. Kirim link Spotify yang benar (hanya track).`
  }

  await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

  const endpoint = `https://api.neoxr.eu/api/spotify?url=${encodeURIComponent(text)}&apikey=${global.neoxr}`

  try {
    const res = await fetch(endpoint)
    if (!res.ok) throw `Gagal terhubung ke API (HTTP ${res.status}).`

    const json = await res.json()
    if (!json?.status) throw `API mengembalikan status gagal.`

    const data = json.data
    if (!data?.url) throw `Gagal mendapatkan audio dari API.`

    const caption =
`🎵 *Spotify Downloader*
∘ *Title:* ${data.title || '-'}
∘ *Artist:* ${data.artist?.name || '-'}
∘ *Duration:* ${data.duration || '-'}
∘ *Link:* ${text}`

    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: data.title || 'Spotify',
          body: data.artist?.name || '',
          thumbnailUrl: data.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: false,
          showAdAttribution: false,
          sourceUrl: text
        }
      }
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: data.url },
      mimetype: 'audio/mpeg',
      fileName: `${(data.title || 'spotify')}.mp3`,
      ptt: false
    }, { quoted: m })

  } catch (e) {
    console.log(e)
    throw `Terjadi Kesalahan!\n${e}`
  }
}

handler.help = ['spotifydl <url>']
handler.tags = ['downloader']
handler.command = /^(spotifydl)$/i
handler.limit = true
handler.daftar = true

export default handler