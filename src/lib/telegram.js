const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8955983072:AAGb-Cho9XcTT977YkUqX1eD3V0mkxmlg2g'
const CHAT_ID   = import.meta.env.VITE_TELEGRAM_CHAT_ID || '6885443469'

export async function notifyOrder(order) {
  try {
    const items = order.items.map(i => `• ${i.name} — $${i.price}`).join('\n')

    const msg = `
🛒 *নতুন অর্ডার!*
━━━━━━━━━━━━━━
👤 Email: ${order.user_email}
📦 Items:
${items}

💰 Total: $${order.total_amount}
📱 bKash Number: \`${order.bkash_number}\`
🔑 TrxID: \`${order.bkash_trx_id}\`
🆔 Order ID: \`${order.id}\`
━━━━━━━━━━━━━━
✅ Confirm: \`/confirm_${order.id.slice(0,8)}\`
❌ Reject: \`/reject_${order.id.slice(0,8)}\`
    `.trim()

    // Using GET with query parameters and 'no-cors' mode completely bypasses
    // browser CORS preflight restrictions and ensures the bot receives the message.
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(msg)}&parse_mode=Markdown`

    await fetch(url, {
      method: 'GET',
      mode: 'no-cors'
    })
  } catch (err) {
    console.warn("Telegram notification log:", err)
  }
}
