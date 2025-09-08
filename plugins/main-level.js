import { canLevelUp, xpRange } from '../lib/levelling.js'
import canvafy from 'canvafy'

function getRoleByLevel(level = 0) {
  const roleMap = [
    [2,'Mizunoto ✩¹'],[4,'Mizunoto ✩²'],[6,'Mizunoto ✩³'],[8,'Mizunoto ✩⁴'],[10,'Mizunoto ✩⁵'],
    [20,'Mizunoe ✩¹'],[30,'Mizunoe ✩²'],[40,'Mizunoe ✩³'],[50,'Mizunoe ✩⁴'],[60,'Mizunoe ✩⁵'],
    [70,'Kanoto ✩¹'],[80,'Kanoto ✩²'],[90,'Kanoto ✩³'],[100,'Kanoto ✩⁴'],[110,'Kanoto ✩⁵'],
    [120,'Kanoe ✩¹'],[130,'Kanoe ✩²'],[140,'Kanoe ✩³'],[150,'Kanoe ✩⁴'],[160,'Kanoe ✩⁵'],
    [170,'Michinoto ✩¹'],[180,'Michinoto ✩²'],[190,'Michinoto ✩³'],[200,'Michinoto ✩⁴'],[210,'Michinoto ✩⁵'],
    [220,'Michinoe ✩¹'],[230,'Michinoe ✩²'],[240,'Michinoe ✩³'],[250,'Michinoe ✩⁴'],[260,'Michinoe ✩⁵'],
    [270,'Tsuchinoto ✩¹'],[280,'Tsuchinoto ✩²'],[290,'Tsuchinoto ✩³'],[300,'Tsuchinoto ✩⁴'],[310,'Tsuchinoto ✩⁵'],
    [320,'Tsuchinoe ✩¹'],[330,'Tsuchinoe ✩²'],[340,'Tsuchinoe ✩³'],[350,'Tsuchinoe ✩⁴'],[360,'Tsuchinoe ✩⁵'],
    [370,'Hinoto ✩¹'],[380,'Hinoto ✩²'],[390,'Hinoto ✩³'],[400,'Hinoto ✩⁴'],[410,'Hinoto ✩⁵'],
    [420,'Hinoe ✩¹'],[430,'Hinoe ✩²'],[440,'Hinoe ✩³'],[450,'Hinoe ✩⁴'],[460,'Hinoe ✩⁵'],
    [470,'Kinoto ✩¹'],[480,'Kinoto ✩²'],[490,'Kinoto ✩³'],[500,'Kinoto ✩⁴'],[510,'Kinoto ✩⁵'],
    [520,'Kinoe ✩¹'],[530,'Kinoe ✩²'],[540,'Kinoe ✩³'],[550,'Kinoe ✩⁴'],[560,'Kinoe ✩⁵'],
    [600,'Pillar 숒'],
  ]
  for (const [maxLv, role] of roleMap) if (level <= maxLv) return role
  return 'Pillar 숒'
}

let handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]
  const name = user.nama || await conn.getName(m.sender)

  if (!canLevelUp(user.level, user.exp, global.multiplier)) {
    const { min, xp, max } = xpRange(user.level, global.multiplier)
    const who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender)
    const pp = await conn.profilePictureUrl(who, 'image').catch(_ => './src/avatar_contact.png')

    const image = await new canvafy.Rank({
      font: { name: 'Poppins', path: 'assets/fonts/Poppins/Poppins-Regular.ttf' }
    })
      .setAvatar(pp)
      .setBackground('image', 'https://i.postimg.cc/852vxqmy/level.jpg')
      .setUsername(name)
      .setBorder('#FF0000')
      .setOverlayOpacity(0.5)
      .setLevel(user.level)
      .setCurrentXp(user.exp - min)
      .setBarColor('#FF0000')
      .setRequiredXp(xp)
      .build()

    const txt = `乂  *L E V E L*\n\n• Nama  : ${name}\n• Level : *${user.level}*\n• XP    : *${user.exp - min}/${xp}*\n• Sisa  : *${max - user.exp} XP* lagi`
    await conn.sendMessage(m.chat, { image, caption: txt }, { quoted: m })
    return
  }

  const before = user.level
  while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++
  user.role = getRoleByLevel(user.level)

  const who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender)
  const pp = await conn.profilePictureUrl(who, 'image').catch(_ => './src/avatar_contact.png')

  const image = await new canvafy.LevelUp()
    .setAvatar(pp)
    .setBackground('image', 'https://i.postimg.cc/852vxqmy/level.jpg')
    .setUsername(name)
    .setBorder('#FF0000')
    .setAvatarBorder('#FF0000')
    .setOverlayOpacity(0.5)
    .setLevels(before, user.level)
    .build()

  const txt = `乂  *L E V E L  U P*\n\n• Nama             : ${name}\n• Level Sebelum    : ${before}\n• Level Baru       : ${user.level}\n• Role Baru        : ${user.role}\n• Waktu            : ${new Date().toLocaleString('id-ID')}`
  await conn.sendMessage(m.chat, { image, caption: txt }, { quoted: m })
}

handler.help = ['level']
handler.tags = ['user']
handler.command = /^(level(up)?)$/i
handler.daftar = true

export default handler