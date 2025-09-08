let handler = async (m, { conn, text, isAdmin }) => {
    if (!m.isGroup) throw "❌ *Fitur ini hanya bisa digunakan dalam grup.*";
    if (!isAdmin) throw "❌ *Fitur ini hanya bisa digunakan oleh admin grup.*";
    
    let chat = global.db.data.chats[m.chat]; 
    if (!chat) global.db.data.chats[m.chat] = {}; // Pastikan data grup tersedia
    
    if (text) {
        global.db.data.chats[m.chat].sBye = text;
        m.reply("✅ *Pesan bye berhasil diatur untuk grup ini!*");
    } else {
        throw "❌ *Teks bye tidak boleh kosong!*\nContoh penggunaan: *.setbye Sampai jumpa!*";
    }
};

handler.help = ["setbye"];
handler.tags = ["group"];
handler.command = /^setbye$/i;
handler.group = true;
handler.admin = true;
handler.daftar = true

export default handler;