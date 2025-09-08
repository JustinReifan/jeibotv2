let handler = async (m, { conn }) => {
    let chats = global.db.data.chats;
    let sewaList = [];

    // Ambil semua grup yang masih bot ikuti
    let activeGroups = await conn.groupFetchAllParticipating();
    let groupIds = Object.keys(activeGroups);

    for (let id of groupIds) {
        let chat = chats[id];
        if (chat && chat.expired && chat.expired > Date.now()) {
            try {
                let metadata = activeGroups[id];
                let groupName = metadata.subject || "Tidak diketahui";
                sewaList.push(`📌 *Nama Grup:* ${groupName}\n🔑 *ID Grup:* ${id}\n⏳ *Kadaluarsa:* ${msToDate(chat.expired - Date.now())}\n`);
            } catch (e) {
                console.log(`Gagal membaca metadata grup ${id}:`, e);
            }
        }
    }

    if (sewaList.length === 0) {
        return conn.reply(m.chat, "📭 Tidak ada grup yang sedang menyewa bot.", m);
    }

    let pesan = `📋 *Daftar Grup yang Menyewa Bot:*\n\n` + sewaList.join("\n\n");
    conn.reply(m.chat, pesan, m);
};

handler.help = ['listsewa'];
handler.tags = ['owner'];
handler.command = /^(listsewa)$/i;
handler.rowner = true;
handler.daftar = true

export default handler;

function msToDate(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    let minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${days} Hari ${hours} Jam ${minutes} Menit`;
}