const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
const CHAT_ID   = import.meta.env.VITE_TELEGRAM_CHAT_ID

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

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg,
        parse_mode: 'Markdown'
      })
    })
  } catch (err) {
    // Log the error but do not throw it, so that the checkout flow is not interrupted
    console.warn("Telegram notification warning (often a client-side CORS block, but message is usually sent):", err)
  }
}
