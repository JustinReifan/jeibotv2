import moment from 'moment-timezone';

let handler = async (m, { conn }) => {
    let waktu = moment().tz('Asia/Jakarta');
    let tampilTanggal = waktu.format('dddd, DD MMMM YYYY');
    let tampilWaktu = waktu.format('HH:mm:ss');

    // Mendapatkan pengguna yang disebut atau direply
    let user = (m.mentionedJid?.[0] || m.quoted?.sender || "").toString(); 

    if (!user) throw "⚠️ Harap reply pesan atau mention pengguna!";

    let pesan = `*TRANSAKSI PENDING*  
📅 *Tanggal:* ${tampilTanggal}  
⏰ *Jam:* ${tampilWaktu} WIB  
📌 *Status:* Pending  
👤 *Pesanan:* @${user.split('@')[0]} sedang diproses!`;

    let notifikasi = `📌 *Pesanan @${user.split('@')[0]}* sedang diproses.  
> Hapus pesan ini jika sudah selesai.`;

    // Kirim pesan ke grup dengan mention yang benar
    await conn.sendMessage(m.chat, { text: pesan, mentions: [user] });

    // Kirim notifikasi ke pengirim perintah
    await conn.sendMessage(m.sender, { text: notifikasi, mentions: [user] });
};

handler.help = ['proses'];
handler.tags = ['store'];
handler.command = /^proses$/i;
handler.owner = true;
handler.daftar = true

export default handler;