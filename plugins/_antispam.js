export async function before(m) {
    let user = db.data.users[m.sender];
    let chat = db.data.chats[m.chat];

    if ((m.chat.endsWith('broadcast') || m.fromMe) && !m.message && !chat.isBanned) return;
    if (!m.text.startsWith('.') && !m.text.startsWith('#') && !m.text.startsWith('!') && !m.text.startsWith('/') && !m.text.startsWith('\/')) return;
    if (user.banned && new Date() * 1 < user.unbanTime) return; // Jika masih dalam masa banned, blokir pesan

    this.spam = this.spam || {};
    
    if (m.sender in this.spam) {
        this.spam[m.sender].count++;
        let now = new Date() * 1;
        let lastSpamTime = this.spam[m.sender].lastspam || 0;
        
        if (now - lastSpamTime <= 5000) { // Spam dalam 5 detik
            if (this.spam[m.sender].count >= 4) { // Jika spam lebih dari 3 kali
                user.banned = true;
                user.unbanTime = now + 15000; // Ban selama 15 detik
                m.reply('*⚠️ Detected Spamming!!*\n\nNomor kamu telah di-ban selama 15 detik karena spam.');
                
                setTimeout(() => {
                    user.banned = false;
                    delete user.unbanTime;
                    m.reply('*✅ Ban otomatis telah dicabut!*\nSilakan gunakan bot dengan bijak.');
                }, 15000);
            }
        } else {
            this.spam[m.sender].count = 1; // Reset jika tidak spam dalam 5 detik
        }
        
        this.spam[m.sender].lastspam = now;
    } else {
        this.spam[m.sender] = {
            jid: m.sender,
            count: 1,
            lastspam: new Date() * 1
        };
    }
}