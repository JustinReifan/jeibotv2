import fetch from 'node-fetch';

const handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`❌ Masukkan pertanyaan!\n\n📌 *Contoh:* ${usedPrefix + command} Siapa presiden Indonesia sekarang?`);
  }

  try {
    await m.reply('⏳ Cici sedang berpikir...');

    let res = await fetch(`https://anabot.my.id/api/ai/cici?prompt=${encodeURIComponent(text)}&apikey=freeApikey`);
    let json = await res.json();

    if (json.status !== 200) {
      return m.reply('❌ Gagal mendapatkan respons. Coba lagi nanti.');
    }

    let replyText = `👧🏻 *Cici AI Assistant*\n━━━━━━━━━━━━━━\n📝 *Pertanyaan:* ${text}\n\n💡 *Jawaban:* ${json.data.result.chat.replace(/\\n/g, '\n')}\n━━━━━━━━━━━━━━\n🚀 *Powered by Cici AI*`;

    await m.reply(replyText);
  } catch (err) {
    console.error(err);
    return m.reply('⚠️ Terjadi kesalahan. Coba lagi nanti.');
  }
};

handler.command = handler.help = ['cici'];
handler.tags = ['ai'];
handler.limit = true;
handler.daftar = true

export default handler;