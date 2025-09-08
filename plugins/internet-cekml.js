import fetch from 'node-fetch';

let handler = async (m, { args }) => {
    if (args.length < 2) {
        return m.reply('Gunakan format: .ml <id> <zone>\nContoh: .ml 950769946 12774');
    }

    let [id, zone] = args;
    let url = `https://api.neoxr.eu/api/ml-region?id=${id}&zone=${zone}&apikey=${neoxr}`;

    try {
        let res = await fetch(url);
        let json = await res.json();

        if (!json.status) {
            return m.reply('Gagal mengambil data. Pastikan ID dan Zone benar.');
        }

        let { uid, zone: userZone, username, region } = json.data;
        let message = `*Mobile Legends Profile*\n\n` +
                      `• *User ID:* ${uid}\n` +
                      `• *Zone:* ${userZone}\n` +
                      `• *Username:* ${username}\n` +
                      `• *Region:* ${region}`;

        m.reply(message);
    } catch (err) {
        console.error(err);
        m.reply('Terjadi kesalahan dalam mengambil data.');
    }
};

handler.help = ['ml'];
handler.tags = ['internet'];
handler.command = /^(ml(stalk)?)$/i;
handler.daftar = true

export default handler;