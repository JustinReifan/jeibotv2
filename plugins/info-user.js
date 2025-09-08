import fs from 'fs'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

let handler = async (m, { usedPrefix, command, conn }) => {
  let mentionedJid = [m.sender]
  let name = conn.getName(m.sender)
  let totalUser = Object.keys(global.db.data.users).length
  let registeredUser = Object.values(global.db.data.users).filter(user => user.daftar === true).length
  let unregisteredUser = totalUser - registeredUser

  let chartConfig = {
    type: 'doughnut',
    data: {
      labels: ['Terdaftar', 'Belum Terdaftar'],
      datasets: [{
        data: [registeredUser, unregisteredUser],
        backgroundColor: ['#4CAF50', '#F44336']
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: `Statistik Pengguna Bot`,
          font: { size: 18 }
        },
        doughnutlabel: {
          labels: [
            {
              text: `${totalUser}`,
              font: { size: 20, weight: 'bold' }
            },
            {
              text: 'Total User',
              font: { size: 14 }
            }
          ]
        }
      }
    },
    plugins: ['doughnutlabel']
  }

  let chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`

  await conn.sendMessage(m.chat, {
    image: { url: chartUrl },
    caption: `📊 *Statistik Database User*\n\n- Total User: *${totalUser}*\n- Terdaftar: *${registeredUser}*\n- Belum Terdaftar: *${unregisteredUser}*`
  }, { quoted: m })
}

handler.help = ['user']
handler.tags = ['info']
handler.command = /^(pengguna|(jumlah)?database|user)$/i
handler.daftar = true

export default handler