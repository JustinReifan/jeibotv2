let handler = async (m, { conn, text, isAdmin, isBotAdmin }) => {
    if (!m.isGroup) throw "Fitur ini hanya bisa digunakan dalam grup.";
    if (!isAdmin) throw "Fitur ini hanya bisa digunakan oleh admin grup.";
    
    let chat = global.db.data.chats[m.chat]; 
    if (!chat) global.db.data.chats[m.chat] = {}; // Pastikan data grup tersedia
    
    if (text) {
        global.db.data.chats[m.chat].sWelcome = text;
        m.reply("✅ *Pesan welcome berhasil diatur untuk grup ini!*");
    } else {
        throw "❌ *Teks welcome tidak boleh kosong!*\nContoh penggunaan: *.setwelcome Selamat datang di grup!*";
    }
};

handler.help = ["setwelcome"];
handler.tags = ["group"];
handler.command = /^setwelcome$/i;

handler.group = true;
handler.admin = true;
handler.daftar = true

export default handler;