import PhoneNumber from 'awesome-phonenumber'
import canvafy from 'canvafy'

function getRoleByLevel(level = 0) {
  const roleMap = [
    [2,  'Mizunoto ✩¹'],
    [4,  'Mizunoto ✩²'],
    [6,  'Mizunoto ✩³'],
    [8,  'Mizunoto ✩⁴'],
    [10, 'Mizunoto ✩⁵'],
    [20, 'Mizunoe ✩¹'],
    [30, 'Mizunoe ✩²'],
    [40, 'Mizunoe ✩³'],
    [50, 'Mizunoe ✩⁴'],
    [60, 'Mizunoe ✩⁵'],
    [70,  'Kanoto ✩¹'],
    [80,  'Kanoto ✩²'],
    [90,  'Kanoto ✩³'],
    [100, 'Kanoto ✩⁴'],
    [110, 'Kanoto ✩⁵'],
    [120, 'Kanoe ✩¹'],
    [130, 'Kanoe ✩²'],
    [140, 'Kanoe ✩³'],
    [150, 'Kanoe ✩⁴'],
    [160, 'Kanoe ✩⁵'],
    [170, 'Michinoto ✩¹'],
    [180, 'Michinoto ✩²'],
    [190, 'Michinoto ✩³'],
    [200, 'Michinoto ✩⁴'],
    [210, 'Michinoto ✩⁵'],
    [220, 'Michinoe ✩¹'],
    [230, 'Michinoe ✩²'],
    [240, 'Michinoe ✩³'],
    [250, 'Michinoe ✩⁴'],
    [260, 'Michinoe ✩⁵'],
    [270, 'Tsuchinoto ✩¹'],
    [280, 'Tsuchinoto ✩²'],
    [290, 'Tsuchinoto ✩³'],
    [300, 'Tsuchinoto ✩⁴'],
    [310, 'Tsuchinoto ✩⁵'],
    [320, 'Tsuchinoe ✩¹'],
    [330, 'Tsuchinoe ✩²'],
    [340, 'Tsuchinoe ✩³'],
    [350, 'Tsuchinoe ✩⁴'],
    [360, 'Tsuchinoe ✩⁵'],
    [370, 'Hinoto ✩¹'],
    [380, 'Hinoto ✩²'],
    [390, 'Hinoto ✩³'],
    [400, 'Hinoto ✩⁴'],
    [410, 'Hinoto ✩⁵'],
    [420, 'Hinoe ✩¹'],
    [430, 'Hinoe ✩²'],
    [440, 'Hinoe ✩³'],
    [450, 'Hinoe ✩⁴'],
    [460, 'Hinoe ✩⁵'],
    [470, 'Kinoto ✩¹'],
    [480, 'Kinoto ✩²'],
    [490, 'Kinoto ✩³'],
    [500, 'Kinoto ✩⁴'],
    [510, 'Kinoto ✩⁵'],
    [520, 'Kinoe ✩¹'],
    [530, 'Kinoe ✩²'],
    [540, 'Kinoe ✩³'],
    [550, 'Kinoe ✩⁴'],
    [560, 'Kinoe ✩⁵'],
    [600, 'Pillar 숒'],
  ]
  for (const [maxLv, role] of roleMap) if (level <= maxLv) return role
  return 'Pillar 숒'
}

let handler = async (m, { conn }) => {
  try {
    const user = global.db.data.users[m.sender] || {}
    const who = m.mentionedJid?.[0] || (m.fromMe ? conn.user.jid : m.sender)
    const username = user.nama || await conn.getName(who)
    const raw = '+' + String(who).replace('@s.whatsapp.net', '')
    let nomor
    try {
      nomor = new PhoneNumber(raw).getNumber('international') || raw
    } catch {
      nomor = raw
    }

    const pp = await conn.profilePictureUrl(who, 'image').catch(() => './src/avatar_contact.png')

    const {
      koin = 0,
      exp = 0,
      limit = 0,
      level = 0,
      role: savedRole = 'Mizunoto ✩¹',
      premium = false,
      premiumTime = 0,
    } = user

    const computedRole = getRoleByLevel(level)
    if (savedRole !== computedRole) user.role = computedRole

    const isPremium = Boolean(premium) && Number(premiumTime) > Date.now()
    const isOwner = Array.isArray(global.owner)
      ? global.owner.some(([id]) => m.sender.includes(String(id)))
      : false
    const displayLimit = (isOwner || isPremium) ? '∞ [Limit Tanpa Batas]' : limit
    const expiredText = isPremium
      ? `*Expired Premium:* ${new Date(premiumTime).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n`
      : ''

    const image = await new canvafy.WelcomeLeave()
      .setAvatar(pp)
      .setBackground('image', 'https://i.postimg.cc/fT28rb05/profile.png')
      .setTitle(username)
      .setDescription(nomor)
      .setBorder('#FF0000')
      .setAvatarBorder('#FFD700')
      .setOverlayOpacity(0.5)
      .build()

    const str = [
      `*Nama Pengguna:* ${username}`,
      `*Total Koin:* ${koin}`,
      `*Total Exp:* ${exp}`,
      `*Total Limit:* ${displayLimit}`,
      expiredText ? expiredText.trimEnd() : null,
      `*Role Saat Ini:* ${user.role}`,
      `*Level Saat Ini:* ${level}`,
    ].filter(Boolean).join('\n')

    await conn.sendMessage(m.chat, { image, caption: str }, { quoted: m })
  } catch (e) {
    m.reply('❌ Nama kamu terlalu panjang, sehingga tidak dapat melihat profil kamu!')
  }
}

handler.help = ['profile']
handler.tags = ['user']
handler.command = /^(profile|limit|me)$/i
handler.daftar = true

export default handler