let handler = async (m, { conn, args, usedPrefix, command }) => {
  let groupId;

  if (m.isGroup) {
    groupId = m.chat;
  } else {
    if (!args[0]) {
      return conn.reply(m.chat, 'Harap sertakan link gc atau id grup yang akan dihapus masa sewanya!', m);
    }
    groupId = args[0].trim();
  }

  if (!global.db.data.chats[groupId]) global.db.data.chats[groupId] = { expired: false };

  global.db.data.chats[groupId].expired = false;

  conn.reply(m.chat, `Berhasil menghapus masa sewa untuk grup:\n${groupId}`, m);
}

handler.help = ['delsewa']
handler.tags = ['owner']
handler.command = /^(delexpired|delsewa)$/i
handler.rowner = true
handler.group = false
handler.daftar = true

export default handler;