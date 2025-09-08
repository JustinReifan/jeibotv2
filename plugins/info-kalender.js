import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  let [bulan, tahun] = args;

  if (!bulan || !tahun) {
    await conn.sendMessage(m.chat, {
      react: { text: '🗓️', key: m.key }
    });
    return m.reply('Silakan ketik dengan format: *.kalender [bulan] [tahun]*\nContoh: *.kalender 1 2025*');
  }

  bulan = parseInt(bulan);
  tahun = parseInt(tahun);

  if (isNaN(bulan) || isNaN(tahun)) {
    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key }
    });
    return m.reply('Bulan dan tahun harus berupa angka.\nContoh: *.kalender 4 2025*');
  }

  const url = `https://fastrestapis.fasturl.cloud/maker/calendar/advanced?month=${bulan}&year=${tahun}`;

  await conn.sendMessage(m.chat, {
    react: { text: '🗓️', key: m.key }
  });

  try {
    const res = await fetch(url, {
      headers: { accept: 'image/png' }
    });

    if (!res.ok) throw new Error('Gagal ambil gambar kalender.');

    const buffer = await res.buffer();

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `🗓️ Kalender bulan *${bulan}* tahun *${tahun}*`
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key }
    });
    m.reply('Gagal mengambil kalender. Silakan coba lagi nanti.');
  }
};

handler.help = ['kalender [bulan] [tahun]'];
handler.tags = ['info'];
handler.command = /^kalender$/i;
handler.limit = false;
handler.daftar = true

export default handler;