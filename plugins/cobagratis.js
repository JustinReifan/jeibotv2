let handler = async (m, { conn }) => {
  let teks = `
🎁 *COBA GRATIS BOT 7 HARI*

Kami menyediakan trial gratis bot ini selama *7 hari* untuk grup WhatsApp kamu. 
Selama masa trial, semua fitur bot bisa dipakai tanpa batas.

📌 Setelah 7 hari, kamu bisa memilih untuk melanjutkan dengan:
- Perpanjang via Credit (hasil pembelian layanan).
- Atau pembayaran manual melalui admin.

👉 Untuk info lebih lanjut & aktivasi trial gratis:
Ketik *.owner* untuk langsung menghubungi admin.
  `;

  const interactiveButtons = [
    {
      name: "cta_url",
      buttonParamsJson: JSON.stringify({
        display_text: "Chat Owner",
        url:
          "https://wa.me/" +
          global.nomorwa +
          "?text=Halo%20Owner,%20saya%20ingin%20mencoba%20trial%20gratis%20Jei%20bot.",
      }),
    },
  ];

  const interactiveMessage = {
    text: teks.trim(),
    interactiveButtons,
  };

  await conn.sendMessage(m.chat, interactiveMessage, { quoted: m });
};

handler.help = ["cobagratis"];
handler.tags = ["info"];
handler.command = /^cobagratis$/i;

export default handler;
