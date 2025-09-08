import fs from "fs";
import cp, { exec as _exec } from "child_process";
import { promisify } from "util";

let exec = promisify(_exec).bind(cp);

let handler = async (m, { conn, args, isROwner }) => {
   try {
      if (!isROwner) return m.reply("Hanya owner yang bisa menggunakan perintah ini.");
      if (args.length === 0) return m.reply("Masukkan nomor tujuan! Contoh: .kirimscript 6281234567890");

      let targetNumber = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
      let zipFileName = `ScriptBot.zip`;

      m.reply("Sedang mempersiapkan script... Harap tunggu sebentar.");

      // Buat file ZIP dari semua script (kecuali node_modules)
      let zipCommand = `zip -r ${zipFileName} * -x "node_modules/*"`;
      exec(zipCommand, async (err, stdout) => {
         if (err) {
            m.reply("Terjadi kesalahan saat mengompresi script.");
            console.error(err);
            return;
         }

         if (fs.existsSync(zipFileName)) {
            const file = fs.readFileSync(zipFileName);

            // Kirim file script ke nomor tujuan
            conn.sendMessage(
               targetNumber,
               {
                  document: file,
                  mimetype: "application/zip",
                  fileName: zipFileName,
                  caption: "Berikut adalah script bot yang dipesan kak. Harap hapus file database.json dan sesionnya agar bot bisa dijalankan",
               }
            ).then(() => {
               m.reply(`Script berhasil dikirim ke ${args[0]}`);
               fs.unlinkSync(zipFileName); // Hapus file setelah dikirim
            }).catch(err => {
               m.reply("Gagal mengirim script ke nomor tujuan.");
               console.error(err);
            });
         } else {
            m.reply("File script tidak ditemukan.");
         }
      });

   } catch (error) {
      m.reply("Terjadi kesalahan saat mengirim script.");
      console.error(error);
   }
};

handler.help = ["kirimscript <nomor>"];
handler.tags = ["owner"];
handler.command = ["kirimscript"];
handler.rowner = true;
handler.daftar = true

export default handler;