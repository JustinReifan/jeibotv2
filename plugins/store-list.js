let handler = async (m, { conn, usedPrefix, command }) => {
    let msgs = db.data.chats[m.chat]?.listStr || {};
    let list = Object.entries(msgs).map(([nama, isi]) => ({ nama, ...isi }));

    if (!list.length) {
        throw `\n❌ Belum ada list yang ditambahkan oleh admin.\n\nKetik *${usedPrefix}addlist <nama>* untuk menambahkan daftar.`;
    }

    let teks = list.map((v, i) => {
        return `${i + 1}. ${v.nama}`;
    }).join('\n');

    await m.reply(`乂 *LIST STORE*\n\n✅ Akses dengan mengetik namanya\n*Contoh:* _${list[0].nama}_\n\n📋 *Daftar List:*\n${teks}`);
}
handler.help = ['list']
handler.tags = ['store']
handler.command = /^list(store|shop)?$/i
handler.group = true
handler.daftar = false

export default handler