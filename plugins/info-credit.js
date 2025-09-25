let handler = async (m, { conn }) => {
  let teks = `
💳 *INFO CREDIT BOT*

Credit adalah sistem poin yang kamu dapatkan setiap melakukan pembelian layanan (misalnya suntik followers). 

🔹 Cara mendapatkan credit:
- Setiap kali kamu melakukan pembelian layanan, kamu akan otomatis mendapat *bonus credit* sebagai bentuk cashback.

🔹 Fungsi credit:
- Credit digunakan untuk memperpanjang masa aktif bot di grup kamu.

🔎 Cek credit kamu: *.mycredit*
🛒 Cek harga perpanjang masa sewa: *.sewabot*
  `;
  await conn.reply(m.chat, teks.trim(), m);
};

handler.help = ["info-credit"];
handler.tags = ["info"];
handler.command = /^info-credit$/i;

export default handler;
