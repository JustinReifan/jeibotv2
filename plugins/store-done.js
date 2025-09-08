import moment from 'moment-timezone';

let handler = async (m, { conn, text }) => {
  let waktu = moment().tz('Asia/Jakarta');
  let tampilTanggal = waktu.format('dddd DD MMMM YYYY');
  let tampilWaktu = waktu.format('HH:mm:ss');

  let who = (m.mentionedJid?.[0] || m.quoted?.sender || "").toString();
  if (!who) throw "⚠️ Harap reply pesan atau mention pengguna!";

  if (!text) throw "⚠️ Harap tambahkan nama barang! Contoh: *.done NamaBarang*";

  let pesan = `✅ *TRANSAKSI BERHASIL*  
📅 *Tanggal:* ${tampilTanggal}  
⏰ *Jam:* ${tampilWaktu} WIB  
📌 *Status:* Berhasil  
🛒 *Barang:* ${text}  
👤 *Pesanan:* @${who.split('@')[0]} telah selesai!`;

  await conn.sendMessage(m.chat, { text: pesan, mentions: [who] });
};

handler.help = ['done'];
handler.tags = ['store'];
handler.command = /^done$/i;
handler.group = false;
handler.owner= true;
handler.daftar = true

export default handler;