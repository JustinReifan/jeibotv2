import { watchFile, unwatchFile } from "fs";
import chalk from "chalk";
import { fileURLToPath } from "url";
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

// Owner
global.owner = [["6285931018333", "Justin", true]];
global.mods = [];
global.prems = [];
// Info
global.nomorwa = "6285931018333";
global.packname = "Made With";
global.author = "© Copyright Jei Bot";
global.namebot = "Jei Bot";
global.wm = "Created by Jei Bot";
global.stickpack = "Created by";
global.stickauth = "© Jei Bot";
global.fotonya = "./media/logojei.jpg";
global.sgc = "_";
// Info Wait
global.wait = "harap tunggu sebentar...";
global.eror = "⚠️ Terjadi kesalahan, coba lagi nanti!";
global.multiplier = 69;
// Apikey
global.neoxr = "Kemii";
global.lann = "ItsMeMatt";

// Catatan : Jika Mau Work Fiturnya
// Masukan Apikeymu
// Gapunya Apikey? Ya Daftar
global.APIs = {
  neoxr: "https://api.neoxr.eu",
  lann: "https://api.betabotz.eu.org",
  tinped: "https://tinped.com/api",
};

/*Apikey*/
global.APIKeys = {
  "https://api.neoxr.eu": global.neoxr,
  "https://api.betabotz.eu.org": global.lann,
};

global.tinped_id = "8186";
global.tinped_key = "p070t31U0he3DdhqY7kh6z3J6dFRFyMwk3Z";

global.duitku_merchant_code = "D19869";
global.duitku_key = "0cf493eb08d8aa010804b0a1a66dcccf";
global.duitku_callback_url = "https://bot.naelstore.id/duitku/callback";
global.duitku_production = true;

let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  import(`${file}?update=${Date.now()}`);
});
