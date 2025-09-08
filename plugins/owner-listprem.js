let handler = async (m, { conn, args }) => {
  let userList = Object.entries(global.db.data.users)
    .filter(([_, user]) => user.premium === true && user.premiumTime > Date.now())
    .map(([jid, data]) => ({ ...data, jid }))

  let loadingSteps = [
    '《██▒▒▒▒▒▒▒▒▒▒▒》10%',
    '《████▒▒▒▒▒▒▒▒▒》30%',
    '《███████▒▒▒▒▒▒》50%',
    '《██████████▒▒▒》70%',
    '《█████████████》100%',
    '✅ 𝙻𝙾𝙰𝙳𝙸𝙽𝙶 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴𝙳...'
  ]

  let { key } = await conn.sendMessage(m.chat, { text: '_Loading..._' })
  for (let step of loadingSteps) {
    await conn.sendMessage(m.chat, { text: step, edit: key })
  }

  let me = global.db.data.users[m.sender] || {}
  let myName = me.nama || await conn.getName(m.sender)

  let isOwner = Array.isArray(global.owner)
    ? global.owner.some(([id]) => m.sender.includes(String(id)))
    : false

  let myStatus = isOwner
    ? '👑 Owner'
    : (me.premium && me.premiumTime > Date.now() ? '⭐ Premium' : '👤 Biasa')

  let waktu = isOwner
    ? 'Permanen'
    : (me.premium && me.premiumTime > Date.now()
      ? clockString(me.premiumTime - Date.now())
      : 'Expired 🚫')

  let nameCard = '⚡ PREMIUM LIST ⚡'
  let fkon = {
    key: {
      fromMe: false,
      participant: `${m.sender.split`@`[0]}@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: 'status@broadcast' } : {})
    },
    message: {
      contactMessage: {
        displayName: nameCard,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${nameCard}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    }
  }

  let sorted = userList
    .map(toNumber('premiumTime'))
    .sort(sort('premiumTime'))

  let len = args[0] && args[0].length > 0
    ? Math.min(100, Math.max(parseInt(args[0]), 10))
    : Math.min(10, sorted.length)

  let list = sorted.slice(0, len).map(({ jid, nama, premiumTime }, i) => {
    let user = global.db.data.users[jid] || {}
    let namaFinal = user.nama || nama || 'User'
    let waktuAktif = premiumTime > Date.now() ? clockString(premiumTime - Date.now()) : 'Expired 🚫'
    return `\n\n┌✦ ${i + 1}. ${namaFinal}\n┊📞 Nomor : ${jid.split('@')[0]}\n┊⏳ Aktif : ${waktuAktif}`
  }).join('\n╚━━━━━━━━━━━━━━━✧')

  await conn.reply(m.chat, `┌✦ *👤 Data Kamu*
┊• Nama    : ${myName}
┊• Status  : ${myStatus}
┊• Sisa    : ${waktu}
╚━━━━━━━━━━━━━━━✧

✦ 『 𝗔𝗞𝗧𝗜𝗙 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗨𝗦𝗘𝗥𝗦 』 ✦${list}`, fkon)

  setTimeout(() => {
    if (global.db.data.chats[m.chat].deletemedia)
      conn.deleteMessage(m.chat, key)
  }, global.db.data.chats[m.chat].deletemediaTime || 5000)
}

handler.help = ['listprem']
handler.tags = ['user']
handler.command = /^(cekprem|listprem|premlist)$/i
handler.daftar = true
export default handler

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return `${d} hari, ${h} jam, ${m} menit, ${s} detik`
}

function sort(property, ascending = true) {
  return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
}

function toNumber(property, _default = 0) {
  return (a, i, b) => ({
    ...b[i],
    [property]: a[property] === undefined ? _default : a[property]
  })
}