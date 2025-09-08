import fs from 'fs'

let handler = async (m, { conn }) => {
let rules = `Peraturan Penggunaan Bot :
🔐 Kebijakan Privasi
1. Bot tidak akan merekam data riwayat chat user.
2. Bot tidak akan menyebarkan nomor user.
3. Bot tidak akan menyimpan media yang dikirimkan oleh user.
4. Bot tidak akan menyalah gunakan data data user.
5. Owner berhak melihat data riwayat chat user.
6. Owner berhak melihat status user.
7. Owner dapat melihat riwayat chat, dan media yang dikirimkan user.
   *Privasi Data Keamanan Anda Terjaga 100%*

📃 Peraturan Penggunaan
1. Dilarang menelpon Atau video call nomor bot.
2. Dilarang kirim berbagai bug, virtex, dll ke nomor bot.
3. Diharap Keras melakukan spam dalam penggunaan bot.
4. Dilarang Menculik bot secara illegal, untuk menambahkan silahkan hubungi owner.
5. Tidak menyalah gunakan fitur fitur bot.
6. Dilarang keras menggunakan fitur bot 18+ Bagi Yg bukan User Premium/bawah 18+

🖇️ Syarat Ketentuan  
1. Bot akan keluar dari group Jika Waktu Sewa Habis.
2. Bot dapat mem-ban user Jika melakukan Spam
3. Bot tidak akan bertanggungjawab atas apapun yang user lakukan terhadap fitur bot.
4. Bot akan memberlakukan hukuman: block atau ban terhadap user yang melanggar peraturan.
5. Bot bertanggung jawab atas kesalahan fatal dalam programing maupun owner.

📬 Rules: 14/02/24
`;
await conn.sendMessage(m.chat, { image: { url: 'https://i.pinimg.com/564x/d2/31/50/d231504955d3e7562d8a5084d40c56b6.jpg' }, caption: rules }, m)
	
}
handler.help = ['rules']
handler.tags = ['info']
handler.command = /^(rules|rule)$/i;
handler.daftar = true

export default handler;