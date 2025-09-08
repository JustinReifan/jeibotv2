import { watchFile, unwatchFile } from "fs";
import chalk from "chalk";
import { fileURLToPath } from "url";
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

// Owner
global.owner = [["6282191987064", "ItsMeMatt", true]];
global.mods = [];
global.prems = [];
// Info
global.nomorwa = "6282191987064";
global.packname = "Made With";
global.author = "© Copyright Nyxora Assistant";
global.namebot = "Nyxora Assistant";
global.wm = "Created by Nyxora Assistant";
global.stickpack = "Created by";
global.stickauth = "© Nyxora Assistant";
global.fotonya = "./level.jpg";
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
};

/*Apikey*/
global.APIKeys = {
  "https://api.neoxr.eu": global.neoxr,
  "https://api.betabotz.eu.org": global.lann,
};

let file = fileURLToPath(import.meta.url);
watchFile(file, () => {
  unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  import(`${file}?update=${Date.now()}`);
});
