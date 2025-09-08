import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fs from 'fs'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
import knights from 'knights-canvas'
import canvafy from 'canvafy'
import { drawCard, LinearGradient } from 'discord-welcome-card'
/**
 * @type {import('@adiwajshing/baileys')}
 */
const { proto, jidNormalizedUser, areJidsSameUser } = (await import('@adiwajshing/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

/**
 * Handle messages upsert
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate 
 */
 
export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    
    global.img = 'https://telegra.ph/file/e4a2f4339da8a32ad20a1.jpg' 
    
    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()
    
    // Check if the message is from the bot itself
    if (m.fromMe) {
        return; // Do not process the bot's own messages
    }

    try {
        m = smsg(this, m) || m
        if (!m)
            return
        m.exp = 0
        m.limit = false
        try {
            // TODO: use loop to insert data instead of this
            let user = global.db.data.users[m.sender]
            if (typeof user !== 'object')
                global.db.data.users[m.sender] = {}
            if (user) {
                if (!("banned" in user)) 
                    user.banned = false
                if (!isNumber(user.exp))
                    user.exp = 0
                if (!isNumber(user.limit))
                    user.limit = 100
                if (!isNumber(user.udahklaim))
                    user.udahklaim = 0
                if (!isNumber(user.udahopenbo))
                    user.udahopenbo = 0                 
                if (!isNumber(user.udahrampok))
                    user.udahrampok = 0
                if (!isNumber(user.pasangan))
                    user.pasangan = ''
                if (!('daftar' in user))
                    user.daftar = false
                if (!user.daftar) {
                if (!('nama' in user))
                    user.nama = m.name
                 if (!isNumber(user.umur))
                    user.umur = -1
                  if (!isNumber(user.regTime))
                    user.regTime = -1
                }
                if (!isNumber(user.afk))
                    user.afk = -1
                if (!('afkReason' in user))
                    user.afkReason = ''
                if (!('banned' in user))
                    user.banned = false
                if (!isNumber(user.level))
                    user.level = 0
                if (!('role' in user))
                    user.role = 'Mizunoto ✩¹'
                if (!('autolevelup' in user))
                    user.autolevelup = true

                if (!isNumber(user.koin))
                    user.koin = 0
                if (!isNumber(user.udahklaim))
                    user.udahklaim = 0
                
                    
                if (typeof user.premium !== 'boolean')
                    user.premium = false
                if (!isNumber(user.premiumTime))
                    user.premiumTime = 0                
            } else
                global.db.data.users[m.sender] = {
                    exp: 0,
                    limit: 100,
                    udahklaim: 0,
                    udahrampok: 0,
                    udahopenbo: 0,
                    daftar: false,
                    autolevelup: true,
                    nama: m.name,
                    pasangan: '',
                    age: -1,
                    regTime: -1,
                    afk: -1,
                    afkReason: '',
                    banned: false,
                    level: 0,
                    koin: 0,      
                    premium: false,
                    premiumTime: 0,                 
                }
            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object')
                global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat))
                    chat.isBanned = false
                if (!('welcome' in chat))
                    chat.welcome = true
                if (!('detect' in chat))
                    chat.detect = false
                if (!('sWelcome' in chat))
                    chat.sWelcome = ''
                if (!('sBye' in chat))
                    chat.sBye = ''
                if (!('sPromote' in chat))
                    chat.sPromote = ''
                if (!('sDemote' in chat))
                    chat.sDemote = ''
                    if (!('listStr' in chat))
                    chat.listStr = ''
                if (!('delete' in chat))
                    chat.delete = false
                if (!('gameMode' in chat)) 
                    chat.gameMode = true
                if (!('antiLink' in chat))
                    chat.antiLink = false
                if (!('antiFoto' in chat))
                    chat.antiFoto = false
                if (!('antiBot' in chat))
                    chat.antiBot = false
                if (!('antiVideo' in chat))
                    chat.antiVideo = false
                if (!('antiSticker' in chat))
                    chat.antiSticker = false
                if (!('antiAudio' in chat))
                    chat.antiAudio = false
                if (!('viewonce' in chat))
                    chat.viewonce = false
                if (!('antiBadword' in chat)) 
                    chat.antiBadword = false
                if (!('chatbot' in chat))
                    chat.chatbot = false
                if (!('nsfw' in chat))
                    chat.nsfw = false
                if (!('premnsfw' in chat))
                    chat.premnsfw = false
                if (!isNumber(chat.expired))
                    chat.expired = 0
            } else
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    welcome: true,
                    detect: false,
                    sWelcome: '',
                    sBye: '',
                    sPromote: '',
                    sDemote: '',
                    delete: false,
                    antiBot: false,
                    antiLink: false,
                    antiFoto: false,
                    antiVideo: false,
                    antiSticker: false,
                    antiAudio: false,
                    viewonce: false,
                    antiBadword: false,
                    chatbot: false,
                    expired: 0,
                }
            let settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('autoread' in settings)) settings.autoread = true
                if (!('anticall' in settings)) settings.anticall = true
                if (!('restrict' in settings)) settings.restrict = true
                if (!('autorestart' in settings)) settings.autorestart = true
				if (!('backup' in settings)) settings.backup = false
				if (!isNumber(settings.backupDB)) settings.backupDB = 0
                if (!('restartDB' in settings)) settings.restartDB = 0
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                autoread: true,
                anticall: true,
                antidelete: false,
                restrict: false,
                backup: false,
				backupDB: 0,
                autorestart: true,
                restartDB: 0
            }
        } catch (e) {
            console.error(e)
        }
        if (opts['nyimak'])
            return
        if (!m.fromMe && opts['self'] && !global.owner.some(([v]) => v + '@s.whatsapp.net' === m.sender))
    return
        if (opts['pconly'] && m.chat.endsWith('g.us'))
            return
        if (opts['gconly'] && !m.chat.endsWith('g.us'))
            return
        if (opts['swonly'] && m.chat !== 'status@broadcast')
            return
        if (typeof m.text !== 'string')
            m.text = ''

        const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isOwner = isROwner || m.fromMe
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isPrems = isROwner || db.data.users[m.sender].premiumTime > 0

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        m.exp += Math.ceil(Math.random() * 10)

        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        // === setelah baris groupMetadata ===
const groupMetadata = (m.isGroup
  ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null))
  : {}
) || {}

const participants = (m.isGroup ? groupMetadata.participants : []) || []

const user = m.isGroup
  ? (participants.find(u => areJidsSameUser(u.jid, m.sender)) || {})
  : {}

const bot = m.isGroup
  ? (participants.find(u => areJidsSameUser(u.jid, this.user.jid)) || {})
  : {}

const isRAdmin   = user?.admin === 'superadmin'
const isAdmin    = isRAdmin || user?.admin === 'admin'
const isBotAdmin = !!bot?.admin
        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    // if (typeof e === 'string') continue
                    console.error(e)
                    for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await conn.onWhatsApp(jid))[0] || {}
                        if (data.exists)
                            m.reply(`*Plugin:* ${name}\n*Sender:* ${m.sender}\n*Chat:* ${m.chat}\n*Command:* ${m.text}\n\n\`\`\`${format(e)}\`\`\``.trim(), data.jid)
                    }
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                   // global.dfail('restrict', m, this)
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                        plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? // String?
                            plugin.command === command :
                            false

                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    if (name != 'owner-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'tool-delete.js' && chat?.isBanned)
                        return // Except this
                    if (name != 'owner-unbanuser.js' && user?.banned)
                        return
                }
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Premium
                    fail('premium', m, this)
                    continue
                }
                if (plugin.onlyprem && !m.isGroup && !isPrems) {
                    fail('onlyprem', m, this)
                    continue
                }                
               if (plugin.group && !m.isGroup) { // Group Only
    fail('group', m, this)
    continue
}

// Cek gameMode jika plugin bertag game
if (plugin.tags && plugin.tags.includes('game') && m.isGroup) {
    let chat = global.db.data.chats[m.chat]
    if (!chat.gameMode) {
        m.reply('❌ Fitur game di grup ini sedang dimatikan oleh admin!')
        continue
    }
}

if (plugin.botAdmin && !isBotAdmin) { // Bot harus admin
    fail('botAdmin', m, this)
    continue
}

if (plugin.admin && !isAdmin) { // User harus admin
    fail('admin', m, this)
    continue
}

if (plugin.private && m.isGroup) { // Private Chat Only
    fail('private', m, this)
    continue
}

if (plugin.daftar == true && _user.daftar == false) { // Butuh daftar?
    fail('unreg', m, this)
    continue
}

m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
                if (xp > 200)
                    m.reply('Ngecit -_-') // Hehehe
                else
                    m.exp += xp
                if (!isPrems && plugin.limit && global.db.data.users[m.sender].limit < plugin.limit * 1) {
                    this.reply(m.chat, `Limit Kamu tidak mencukupi untuk menggunakan fitur ini, Beli limit Dengan Cara *${usedPrefix}beli limit 1 atau beli premium dengan mengetik .premium*`, m)
                    continue // Limit habis
                }
                if (plugin.level > _user.level) {
                    this.reply(m.chat, `Diperlukan Level ${plugin.level} Untuk Menggunakan Perintah Ini\n*Level Kamu:* ${_user.level}`, m)
                    continue // If the level has not been reached
                }
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems)
                        m.limit = m.limit || plugin.limit || false
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        if (e.name)
                        for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
                        let data = (await conn.onWhatsApp(jid))[0] || {}
                        if (data.exists)
                        m.reply(`Hai sayang sepertinya ada yang error, Harap di perbaiki ya!\n\n*• Plugin:* ${m.plugin}\n*• Sender:* ${m.sender}\n*• Chat:* ${m.chat}\n*• Command:* ${usedPrefix}${command} ${args.join(' ')}\n• *Error Logs:*\n\n\`\`\`${text}\`\`\``.trim(), data.jid)
                               }
                         m.reply(text)
                    }
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        //console.log(global.db.data.users[m.sender])
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.limit -= m.limit * 1
            }

            let stat
            if (m.plugin) {
              let rn = ['recording','composing']
              let jd = rn[Math.floor(Math.random() * rn.length)]
              await this.sendPresenceUpdate(jd,m.chat)
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total)) stat.total = 1
                    if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last)) stat.last = now
                    if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now
                } else stat = stats[m.plugin] = {
                    total: 1,
                    success: m.error != null ? 0 : 1,
                    last: now,
                    lastSuccess: m.error != null ? 0 : now
                }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        if (opts['autoread']) await this.readMessages([m.key])
    }
}

/**
 * Handle groups participants update
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
export async function participantsUpdate({ id, participants, action }) {
    if (opts['self'])
        return
    if (this.isInit)
        return
    if (global.db.data == null)
        await loadDatabase()
    let chat = global.db.data.chats[id] || {}
    let text = ''
    switch (action) {
        case 'add':
        case 'remove':
            if (chat.welcome) {
                let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata
                for (let user of participants) {
                    let pp = 'https://telegra.ph/file/f23f6570eb70b6748d678.png'
                    try {
                        pp = await this.profilePictureUrl(user, 'image')
                    } catch (e) { }

                    let tag = '@' + user.split('@')[0]

                    text = (action === 'add'
                        ? (chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!')
                            .replace('@subject', await this.getName(id))
                            .replace('@desc', groupMetadata.desc?.toString() || 'unknow')
                        : (chat.sBye || this.bye || conn.bye || 'Bye, @user!')
                    ).replace(/@user/gi, tag)

                    let wel = await drawCard({
                        theme: 'code',
                        text: {
                            title: await this.getName(id),
                            text: await this.getName(user),
                            subtitle: `Anggota ke-${groupMetadata.participants.length}`,
                            color: `#DDDDDD`,
                        },
                        avatar: {
                            image: pp,
                            outlineWidth: 5,
                            outlineColor: new LinearGradient([0, '#33f'], [1, '#f33']),
                        },
                        background: 'https://p4.wallpaperbetter.com/wallpaper/659/538/534/anime-girls-black-rock-shooter-anime-wallpaper-preview.jpg',
                        blur: 1,
                        border: true,
                        rounded: true,
                    })

                    let lea = await drawCard({
                        theme: 'code',
                        text: {
                            title: await this.getName(id),
                            text: await this.getName(user),
                            subtitle: `Anggota ke-${groupMetadata.participants.length}`,
                            color: `#DDDDDD`,
                        },
                        avatar: {
                            image: pp,
                            outlineWidth: 5,
                            outlineColor: new LinearGradient([0, '#33f'], [1, '#f33']),
                        },
                        background: 'https://p4.wallpaperbetter.com/wallpaper/659/538/534/anime-girls-black-rock-shooter-anime-wallpaper-preview.jpg',
                        blur: 1,
                        border: true,
                        rounded: true,
                    })

                    this.sendFile(id, action === 'add' ? wel : lea, 'pp.jpg', text, null, false, { mentions: [user] })
                }
            }
            break
        case 'promote':
            text = (chat.sPromote || this.spromote || conn.spromote || '@user ```is now Admin```')
        case 'demote':
            if (!text)
                text = (chat.sDemote || this.sdemote || conn.sdemote || '@user ```is no longer Admin```')
            text = text.replace(/@user/gi, '@' + participants[0].split('@')[0])
            if (chat.detect)
                this.sendMessage(id, { text, mentions: this.parseMention(text) })
            break
    }
}

/**
 * Handle groups update
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate) {
    if (opts['self'])
        return
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id], text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (!text) continue
        await this.sendMessage(id, { text, mentions: this.parseMention(text) })
    }
}
export async function deleteUpdate(message) {
    try {
        const {
            fromMe,
            id,
            participant
        } = message
        if (fromMe)
            return
        let msg = this.serializeM(this.loadMessage(id))
        if (!msg)
            return
        let chat = global.db.data.chats[msg.chat] || {}
        if (chat.antiDelete)
            return
        this.sendMessage(msg.key.remoteJid, {
            text: `Terdeteksi *@${participant.split`@`[0]}* Telah Menghapus Pesan.\nUntuk Mematikan Fitur Ini, Ketik\n*.off antidelete*`,
            mentions: [participant]
        }, {
            quoted: msg
        })
        this.copyNForward(msg.chat, msg, false).catch(e => console.log(e, msg))
    } catch (e) {
        console.error(e)
    }
}
global.dfail = async (type, m, conn) => {
  const tag = `@${m.sender.replace(/@.+/, '')}`
  const mentionedJid = [m.sender]
  const name = await conn.getName(m.sender)

  const fkon = {
    key: {
      fromMe: false,
      participant: `${m.sender.split('@')[0]}@s.whatsapp.net`,
      remoteJid: '0@s.whatsapp.net',
    },
    message: {
      contactMessage: {
        displayName: name,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      },
    },
  }

  const replyStyled = async (text) => {
    const head = `「━━〔 *Akses Ditolak* 〕━━」\n ✦ ${tag} ${text}`
    await conn.sendMessage(m.chat, {
      text: head,
      mentions: mentionedJid,
      contextInfo: {
        externalAdReply: {
          title: global.wm,
          body: global.namebot,
          mediaType: 2,
          thumbnailUrl: global.fotonya,
          sourceUrl: `https://wa.me/${global.nomorwa}`,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: fkon })
  }

    const messages = {
        rowner: 'fitur ini khusus developer bot.',
        owner: 'fitur ini hanya bisa digunakan oleh owner bot.',
        mods: 'fitur ini hanya untuk moderator.',
        premium: 'fitur ini hanya untuk user premium.',
        group: 'fitur ini hanya bisa digunakan di dalam grup.',
        private: 'fitur ini hanya bisa digunakan di private chat.',
        admin: 'fitur ini hanya bisa digunakan oleh admin grup.',
        botAdmin: 'jadikan bot sebagai admin terlebih dahulu.',
        restrict: 'fitur ini dibatasi oleh owner dan belum diaktifkan.',
        unreg: '❌ Kamu belum terdaftar!\n\n✅ Silakan daftar dulu dengan format:\n.daftar nama.umur\n\n📝 Contoh:\n.daftar Matt.15'
    };

    if (messages[type]) return replyStyled(messages[type]);
};

function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH');
    let res = "Sudah Dini Hari Kok Belum Tidur Kak? 🌚";
    if (time >= 4) {
        res = "Pagi Kak 🌄";
    }
    if (time >= 10) {
        res = "Selamat Siang Kak ☀️";
    }
    if (time >= 15) {
        res = "Selamat Sore Kak 🌇";
    }
    if (time >= 18) {
        res = "Malam Kak 🌙";
    }
    return res;
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

let file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
    unwatchFile(file);
    console.log(chalk.redBright("Update 'handler.js'"));
    if (global.reloadHandler) console.log(await global.reloadHandler());
});