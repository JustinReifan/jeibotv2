import axios from 'axios';

async function capcut(url) {
  let { data } = await axios.post('https://3bic.com/api/download', { url }, {
    headers: {
      "content-type": "application/json",
      "origin": "https://3bic.com",
      "referer": "https://3bic.com/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/133.0.0.0 Mobile Safari/537.36"
    }
  });
  data.originalVideoUrl = 'https://3bic.com' + data.originalVideoUrl;
  return data;
}

let handler = async (m, { args, conn }) => {
  if (!args[0]) return m.reply('Masukkan link CapCut!\nContoh: .capcut https://www.capcut.com/t/Zs864Pgq3/');

  m.reply('⏳ Sedang mengambil video, mohon tunggu...');
  
  try {
    let res = await capcut(args[0]);
    await conn.sendMessage(m.chat, { video: { url: res.originalVideoUrl } }, { quoted: m });
  } catch (e) {
    m.reply('❌ Gagal mengambil video. Pastikan link valid atau coba lagi nanti.');
  }
};

handler.tags = ['downloader'];
handler.help = ['capcut'];
handler.command = ['capcut','cc','capcutdl','ccdl'];

handler.register = true;
handler.limit = true;

handler.daftar = true

export default handler;