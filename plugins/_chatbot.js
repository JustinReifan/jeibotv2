import axios from 'axios'

export async function before(m, { conn }) {
  if (m.isBaileys || m.fromMe || m.quoted?.fromMe) return !0
  if (!m.isGroup) return !1

  const chat = global.db.data.chats[m.chat]
  if (!chat.chatbot) return !1

  const pesan = m.text?.trim()
  if (!pesan) return

  try {
    const promptKarakter = `Kamu adalah chatbot cerdas berbasis AI. Namamu adalah *MatsToree AI*, kamu diciptakan dan dikembangkan oleh owner bernama *MatsToree*. Kamu memiliki kepribadian ramah, informatif, dan sopan seperti manusia. Tugasmu adalah membantu menjawab pertanyaan apa pun dengan jelas dan dalam Bahasa Indonesia yang mudah dimengerti.`

    const gabungan = `${promptKarakter} Pertanyaan: ${pesan}`
    const url = `https://wudysoft.xyz/api/ai/aichatbot?prompt=${encodeURIComponent(gabungan)}`
    
    const { data } = await axios.get(url)
    const jawaban = data?.resAi || 'Maaf, saya tidak bisa menjawab pesan tersebut.'

    await m.reply(jawaban.trim())
  } catch (err) {
    console.error('Terjadi kesalahan:', err)
    await m.reply('Maaf, terjadi kesalahan saat menjawab pertanyaan kamu.')
  }
}