const lyricSessions = new Map();
const SESSION_TIMEOUT = 2 * 60 * 1000;

const handler = async (m, { conn, args, command, usedPrefix }) => {
  const userId = m.sender;
  const input = args.join(' ').trim();
  const now = Date.now();

  let session = lyricSessions.get(userId);
  if (session && now - session.created_at > SESSION_TIMEOUT) {
    lyricSessions.delete(userId);
    session = null;
  }

  if (!input) {
    return conn.reply(
      m.chat,
      `${usedPrefix + command} komang`,
      m
    );
  }

  if (!isNaN(input) && session && Array.isArray(session.results) && session.results.length > 0) {
    const idx = parseInt(input, 10) - 1;
    if (idx < 0 || idx >= session.results.length) {
      return conn.reply(m.chat, `Nomor yang kamu pilih tidak ada di daftar hasil.`, m);
    }
    const { url } = session.results[idx];
    try {
      const res = await fetch(`https://api.neoxr.eu/api/lyric?q=${encodeURIComponent(url)}&apikey=${neoxr}`);
      const json = await res.json();
      if (!json.status || !json.data || !json.data.lyric) {
        throw new Error('Lirik tidak ditemukan');
      }
      const msg = `*${json.data.title.toUpperCase()}*\n\n${json.data.lyric}\n\n${global.footer || ''}`;
      lyricSessions.delete(userId);
      return conn.reply(m.chat, msg, m);
    } catch (err) {
      return conn.reply(m.chat, `Gagal mengambil lirik: ${err.message}`, m);
    }
  }

  conn.sendReact?.(m.chat, '🕒', m.key);

  try {
    const res = await fetch(`https://api.neoxr.eu/api/lyric?q=${encodeURIComponent(input)}&apikey=${neoxr}`);
    const json = await res.json();

    if (json.data && typeof json.data === 'object' && json.data.lyric) {
      const msg = `*${json.data.title.toUpperCase()}*\n\n${json.data.lyric}\n\n${global.footer || ''}`;
      return conn.reply(m.chat, msg, m);
    }

    const results = Array.isArray(json.data) ? json.data : [];
    if (results.length === 0) {
      return conn.reply(m.chat, `Tidak ditemukan hasil untuk "${input}".`, m);
    }

    lyricSessions.set(userId, {
      results,
      created_at: now,
    });

    let msg = ``;
    results.forEach((item, i) => {
      msg += `*${i + 1}.* ${item.title}\n${item.url}\n\n`;
    });
    msg += `Ketik ${usedPrefix + command} nomor`;

    return conn.reply(m.chat, msg, m);
  } catch (err) {
    return conn.reply(m.chat, `Terjadi error: ${err.message}`, m);
  }
};

handler.help = ['lirik'];
handler.tags = ['internet'];
handler.limit = true
handler.command = /^(lirik|lyrics|lyric)$/i;
handler.daftar = true

export default handler;