export async function all(m) {
    try {
        let chat = global.db.data.chats[m.chat];
        let user = global.db.data.users[m.sender];

        // Cek jika bukan grup, adalah pesan broadcast, atau pengguna/bot diblokir
        if (!m.isGroup || m.chat.endsWith('broadcast') || chat?.isBanned || user?.banned || m.isBaileys) return;

        let msgs = chat?.listStr;
        if (!msgs || !(m.text in msgs)) return;

        let _m = JSON.parse(JSON.stringify(msgs[m.text]), (_, v) => {
            if (v !== null && typeof v === 'object' && 'type' in v && Array.isArray(v.data)) {
                return Buffer.from(v.data);
            }
            return v;
        });

        // Serialisasi pesan sebelum mengirim
        let serializedMessage = await this.serializeM(_m);

        // Kirim ulang pesan sebagai forward message
        await this.sendMessage(m.chat, { forward: serializedMessage }, { quoted: m });

    } catch (error) {
        console.error("Error in function 'all':", error);
    }
}