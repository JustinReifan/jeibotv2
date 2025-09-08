const { proto } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn, text, command, usedPrefix }) => {
    let M = proto.WebMessageInfo;
    if (!m.quoted) throw `Balas pesan dengan perintah *${usedPrefix + command}*`;
    if (!text) throw `Penggunaan: ${usedPrefix + command} <teks>\n\nContoh:\n${usedPrefix + command} tes`;

    // Pastikan struktur datanya ada
    if (!db.data.chats[m.chat]) db.data.chats[m.chat] = {};
    if (!db.data.chats[m.chat].listStr) db.data.chats[m.chat].listStr = {};

    let msgs = db.data.chats[m.chat].listStr;

    if (text in msgs) throw `'${text}' telah terdaftar di List Store`;
    msgs[text] = M.fromObject(await m.getQuotedObj()).toJSON();
    m.reply(`Berhasil menambahkan '${text}' ke List Store.\n\nAkses dengan mengetik namanya`.trim());
}

handler.help = ['addlist'];
handler.tags = ['store'];
handler.command = /^addlist$/i;

handler.group = true;
handler.admin = true;
handler.daftar = false

export default handler;