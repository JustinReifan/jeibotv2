let handler = async (m, { conn, usedPrefix, text, args, command }) => {
  let who =
    m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
      ? conn.user.jid
      : m.sender;
  let name = await conn.getName(who);

  const sentMsg = await conn.sendContactArray(
    m.chat,
    [
      [
        `${nomorwa}`,
        `${await conn.getName(nomorwa + "@s.whatsapp.net")}`,
        `Justin`,
        ``,
        `justinereifanwijaya@gmail.com`,
        `Indonesia`,
        `https://www.instagram.com/justin_reifan`,
        `Owner Jei Bot`,
      ],
    ],
    m
  );
  await conn.sendMessage(m.chat, {
    text: `Chat owner klik wa.me/${nomorwa}`,
    mentions: [m.sender],
  });
};

handler.help = ["owner"];
handler.tags = ["info"];
handler.command = /^(owner|creator)/i;

export default handler;
