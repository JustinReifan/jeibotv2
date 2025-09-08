import fs from "fs"; 
 import fetch from "node-fetch"; 
 let handler = async (m, { conn, usedPrefix: _p, args, command }) => { 
   let fdoc = { 
     key: { 
       remoteJid: "status@broadcast", 
       participant: "0@s.whatsapp.net", 
     }, 
     message: { 
       documentMessage: { 
         title: "𝙳 𝙰 𝚃 𝙰 𝙱 𝙰 𝚂 𝙴", 
         jpegThumbnail: fs.readFileSync("./Nyxora.jpg"), 
       }, 
     }, 
   }; 
   let d = new Date(); 
   let date = d.toLocaleDateString("id", { 
     day: "numeric", 
     month: "long", 
     year: "numeric", 
   }); 
   conn.reply(m.chat, "*Database Di Kirimkan Ke Chat Pribadi*", m); 
   conn.reply( 
     `${global.nomorwa}` + "@s.whatsapp.net", 
     `*Database:* ${date}`, 
     null 
   ); 
   conn.sendFile( 
     `${global.nomorwa}` + "@s.whatsapp.net", 
     fs.readFileSync("./database.json"), 
     "database.json", 
     "", 
     0, 
     0, 
     { mimetype: "application/json", quoted: fdoc } 
   ); 
 }; 
  
 handler.help = ["backup"]; 
 handler.tags = ["owner"]; 
 handler.command = /^(backup)$/i; 
 handler.rowner = true; 
handler.daftar = true
  
 export default handler;