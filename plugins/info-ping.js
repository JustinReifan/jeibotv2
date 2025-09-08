import os from 'os'
import { performance } from 'perf_hooks'
import moment from 'moment-timezone'

let handler = async (m, { conn }) => {
  const time = moment().tz('Asia/Makassar')
  const uptimeSeconds = process.uptime()
  const uptime = clockString(uptimeSeconds * 1000)

  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem
  const memUsed = (usedMem / 1024 / 1024).toFixed(2)
  const memTotal = (totalMem / 1024 / 1024).toFixed(2)
  const memPercent = ((usedMem / totalMem) * 100).toFixed(2)

  const memTotalGB = (totalMem / 1024 / 1024 / 1024).toFixed(2)
  const memUsedGB = (usedMem / 1024 / 1024 / 1024).toFixed(2)
  const memFreeGB = (freeMem / 1024 / 1024 / 1024).toFixed(2)

  const hostname = os.hostname()
  const platform = os.platform()
  const osRelease = os.release()
  const arch = os.arch()
  const cpus = os.cpus().length
  const cpuModel = os.cpus()[0].model
  const loadAvgArr = os.loadavg()
  const loadAvg = loadAvgArr.map(v => v.toFixed(2)).join(', ')
  const uptimeOs = clockString(os.uptime() * 1000)

  const old = performance.now()
  const neww = performance.now()
  const speed = (neww - old).toFixed(4)

  const caption = `
=========== BOT STATUS ===========

[ Waktu Sekarang ]
• Hari      : ${time.format('dddd')}
• Tanggal   : ${time.format('LL')}
• Jam       : ${time.format('HH:mm:ss')} WITA

[ Informasi Server ]
• Hostname  : ${hostname}
• Platform  : ${platform}
• OS Versi  : ${osRelease}
• Arsitektur: ${arch}
• CPU       : ${cpuModel} (${cpus} Cores)
• Load Avg  : ${loadAvg}
• Memory    : ${memUsed} / ${memTotal} MB (${memPercent}%)
• Uptime OS : ${uptimeOs}

[ Status Bot ]
• Latensi   : ${speed} ms
• Aktif     : ${uptime}

==================================
`.trim()

  const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify({
    type: 'bar',
    data: {
      labels: ['RAM Digunakan', 'RAM Tersisa', 'RAM Total', 'CPU Load 1m', 'CPU Load 5m', 'CPU Load 15m'],
      datasets: [{
        label: 'Statistik Server',
        data: [
          parseFloat(memUsedGB),
          parseFloat(memFreeGB),
          parseFloat(memTotalGB),
          parseFloat(loadAvgArr[0].toFixed(2)),
          parseFloat(loadAvgArr[1].toFixed(2)),
          parseFloat(loadAvgArr[2].toFixed(2))
        ],
        backgroundColor: [
          '#ff6384', // RAM Used
          '#36a2eb', // RAM Free
          '#4bc0c0', // RAM Total
          '#ff9f40', // CPU 1m
          '#9966ff', // CPU 5m
          '#c9cbcf'  // CPU 15m
        ]
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Statistik RAM & CPU'
        },
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Nilai (GB untuk RAM, Load untuk CPU)'
          }
        }
      }
    }
  }))}`

  await conn.sendMessage(m.chat, {
    text: caption,
    contextInfo: {
      externalAdReply: {
        title: 'Statistik RAM & CPU',
        body: `RAM: ${memUsedGB}/${memTotalGB} GB • CPU Load: ${loadAvg}`,
        thumbnailUrl: chartUrl,
        sourceUrl: chartUrl,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false
      }
    }
  }, { quoted: m })
}

handler.help = ['ping', 'speed', 'status']
handler.tags = ['info']
handler.command = ['ping', 'speed', 'status']
handler.daftar = true

export default handler

function clockString(ms) {
  if (isNaN(ms)) return '-- Hari -- Jam -- Menit -- Detik'
  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms % 86400000 / 3600000)
  let m = Math.floor(ms % 3600000 / 60000)
  let s = Math.floor(ms % 60000 / 1000)
  return `${d > 0 ? d + ' Hari ' : ''}${h.toString().padStart(2, '0')} Jam ${m.toString().padStart(2, '0')} Menit ${s.toString().padStart(2, '0')} Detik`
}