// lib/print.js
import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile, readFile, writeFile } from 'fs';
import terminalImage from 'terminal-image';
import urlRegex from 'url-regex-safe';

let logCount = 0;
let codeUpdated = false;

export default async function (m = {}, conn = { user: {} }) {
  // Helpers (safe)
  const formatType = (type) =>
    type
      ? String(type)
          .replace(/message$/i, '')
          .replace('audio', (m?.msg?.ptt ? 'PTT' : 'audio'))
          .replace(/^./, (v) => v.toUpperCase())
      : 'Unknown';

  const formatTime = (timestamp) => {
    const ts = (timestamp && (timestamp.low ?? timestamp)) || null;
    try {
      return ts ? new Date(1000 * ts).toLocaleString() : new Date().toLocaleString();
    } catch {
      return new Date().toLocaleString();
    }
  };

  const safeGetName = async (jid) => {
    try {
      return (conn?.getName && jid) ? await conn.getName(jid) : '';
    } catch {
      return '';
    }
  };

  const _name = await safeGetName(m?.sender);
  const senderPretty = m?.sender
    ? PhoneNumber('+' + String(m.sender).replace('@s.whatsapp.net', '')).getNumber('international') + (_name ? ' ~ ' + _name : '')
    : 'Unknown';

  const chatName = await safeGetName(m?.chat);

  const filesize =
    m?.msg?.vcard?.length ??
    (m?.msg?.fileLength?.low ?? m?.msg?.fileLength) ??
    (typeof m?.text === 'string' ? m.text.length : 0) ??
    0;

  // Header block
  if (m?.sender) {
    console.log(chalk.blue('══════════════════════════════════════════════════'));
    console.log(chalk.redBright('  📩 MESSAGE INFO  '));
    console.log(chalk.blue('══════════════════════════════════════════════════'));
    console.log(`  📌 ${chalk.cyan('Message Type')}: ${formatType(m?.mtype)}`);
    console.log(`  🆔 ${chalk.cyan('Message ID')}: ${m?.msg?.id || m?.key?.id || 'N/A'}`);
    console.log(`  ⏰ ${chalk.cyan('Sent Time')}: ${formatTime(m?.messageTimestamp)}`);
    console.log(`  📂 ${chalk.cyan('Message Size')}: ${filesize || 0} bytes`);
    console.log(`  👤 ${chalk.cyan('Sender ID')}: ${m?.sender?.split?.('@')?.[0] || 'N/A'}`);
    // FIX: show actual sender’s display name (not bot name)
    console.log(`  🎭 ${chalk.cyan('Sender Name')}: ${_name || 'N/A'}`);
    console.log(`  💬 ${chalk.cyan('Chat ID')}: ${m?.chat?.split?.('@')?.[0] || 'N/A'}`);
    console.log(`  🏷️ ${chalk.cyan('Chat Name')}: ${chatName || 'N/A'}`);
    console.log(`  📊 ${chalk.cyan('Total Log Messages')}: ${logCount}`);
    console.log(chalk.blue('══════════════════════════════════════════════════\n'));
  }

  // Text block
  if (typeof m?.text === 'string' && m.text) {
    console.log(chalk.blue('══════════════════════════════════════════════════'));
    let logMessage = m.text.replace(/\u200e+/g, '');

    const mdRegex =
      /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;

    const mdFormat = (depth = 4) => (_, type, text, monospace) => {
      const types = { _: 'italic', '*': 'bold', '~': 'strikethrough' };
      text = text || monospace;
      const formatted =
        !types[type] || depth < 1
          ? text
          : chalk[types[type]](String(text).replace(mdRegex, mdFormat(depth - 1)));
      return formatted;
    };

    if (logMessage.length < 4096) {
      logMessage = logMessage.replace(urlRegex, (url, i, text) => {
        const end = url.length + i;
        return i === 0 ||
          end === text.length ||
          (/^\s$/.test(text[end] || '') && /^\s$/.test(text[i - 1] || ''))
          ? chalk.blueBright(url)
          : url;
      });
    }

    logMessage = logMessage.replace(mdRegex, mdFormat(4));

    if (Array.isArray(m?.mentionedJid)) {
      for (const user of m.mentionedJid) {
        const uname = await safeGetName(user);
        logMessage = logMessage.replace(
          '@' + String(user).split('@')[0],
          chalk.blueBright('@' + (uname || user))
        );
      }
    }

    console.log(
      m?.error != null
        ? `${chalk.red(logMessage)}`
        : m?.isCommand
        ? `${chalk.yellow(logMessage)}`
        : logMessage
    );
    console.log(chalk.blue('══════════════════════════════════════════════════\n'));
  }

  // Attachments block
  if (m?.msg) {
    const attachmentType = String(m?.mtype || '').replace(/message$/i, '');

    const printAttachment = (title, extra = '') => {
      console.log(chalk.blue('══════════════════════════════════════════════════'));
      console.log(chalk.redBright(`  📎 ${title} ${extra}`));
      console.log(chalk.blue('══════════════════════════════════════════════════\n'));
    };

    if (/document/i.test(attachmentType)) {
      printAttachment('Document', m?.msg?.fileName || 'Unnamed');
    } else if (/contact/i.test(attachmentType)) {
      printAttachment('Contact', m?.msg?.displayName || 'N/A');
    } else if (/audio/i.test(attachmentType)) {
      const duration = Number(m?.msg?.seconds) || 0;
      const mm = Math.floor(duration / 60).toString().padStart(2, '0');
      const ss = (duration % 60).toString().padStart(2, '0');
      printAttachment(m?.msg?.ptt ? 'Voice Note' : 'Audio', `Duration: ${mm}:${ss}`);
    } else if (/image/i.test(attachmentType)) {
      printAttachment('Image', m?.msg?.caption || 'No Caption');

      if (m?.msg?.url && global?.opts?.['img']) {
        try {
          const imageBuffer = await m.download();
          if (imageBuffer) {
            const terminalImg = await terminalImage.buffer(imageBuffer);
            console.log(terminalImg);
          }
        } catch (error) {
          console.error(chalk.red('Error displaying image:'), error);
        }
      }
    } else if (/video/i.test(attachmentType)) {
      printAttachment('Video', m?.msg?.caption || 'No Caption');
    } else if (/sticker/i.test(attachmentType)) {
      printAttachment('Sticker');
    }
  }

  // From/To footer
  if (m?.sender) {
    try {
      const fromNum = getPhoneNumber(m.sender) || 'Unknown';
      const toJid = conn?.user?.jid;
      const toNum = toJid ? getPhoneNumber(toJid) : 'N/A';
      console.log(chalk.greenBright(`  📲 ${chalk.red('From')}: ${fromNum}`));
      console.log(chalk.blueBright(`  📤 ${chalk.red('To')}: ${toNum}`));
      console.log(chalk.magentaBright('\n'));
    } catch { /* ignore */ }
  }

  logCount++;
}

const getPhoneNumber = (jid) =>
  PhoneNumber('+' + String(jid || '').replace('@s.whatsapp.net', '')).getNumber('international');

// Hot-reload (safe)
const file = global.__filename?.(import.meta.url) || import.meta.url;
watchFile(file, async () => {
  console.log(chalk.redBright("Update 'lib/print.js'"));
  if (!codeUpdated) {
    readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(chalk.redBright('Error reading the file:'), err);
        return;
      }
      writeFile(file, data, (writeErr) => {
        if (writeErr) {
          console.error(chalk.redBright('Error saving the updated code:'), writeErr);
        } else {
          codeUpdated = true;
          console.log(chalk.greenBright('Updated code has been saved to the file.'));
        }
      });
    });
  }
});
