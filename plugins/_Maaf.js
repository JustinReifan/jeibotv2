let handler = async (m, { conn }) => {
	
	m.reply('Ya Gapapa Sayang, Jangan Di Ulangin Ya..❤')
	
}


handler.customPrefix = /^(maaf|maaf min|sorry|sorry min|maaf bot)$/i
handler.command = new RegExp

export default handler