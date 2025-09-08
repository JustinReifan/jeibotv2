import fetch from 'node-fetch';

const handler = async (m, { text, conn }) => {
  if (!text) {
    return m.reply("Please provide a valid Instagram username.");
  }

  m.reply("Please wait, fetching the story...");

  const apiUrl = `https://api.neoxr.eu/api/igs?username=${encodeURIComponent(text)}&apikey=${neoxr}`;
  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (!result.status || !result.data || result.data.length === 0) {
      return m.reply("No stories found for this username.");
    }

    for (const story of result.data) {
      const { url } = story;

      try {
        await conn.sendFile(m.chat, url, 'story.mp4', 'Instagram Story', m);
      } catch (err) {
        console.error('Error sending media:', err);
        return m.reply("Failed to send the media file.");
      }
    }
  } catch (error) {
    console.error('Error fetching stories:', error);
    m.reply("An error occurred while fetching the stories.");
  }
};

handler.help = ['igstory'];
handler.tags = ['downloader'];
handler.command = /^(igstory|instagramstory)$/i;
handler.register = false;
handler.limit = 3;

handler.daftar = true

export default handler;