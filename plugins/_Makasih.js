let handler = async (m, { conn }) => {
	
	m.reply('Heehee iyah sama-sama, Btw jngan spam yh ☺')
	
}


handler.customPrefix = /^(makasih min|makasih|makasih bot|makaci|tq bot|tq min)$/i
handler.command = new RegExp

export default handler