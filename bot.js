import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Load .env manually to avoid extra dependencies
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value.trim();
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const botToken = process.env.VITE_TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.VITE_TELEGRAM_CHAT_ID;

if (!supabaseUrl || !supabaseKey || !botToken) {
  console.error("❌ Error: Missing configuration. Ensure VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_TELEGRAM_BOT_TOKEN are set in .env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
let lastUpdateId = 0;

async function sendTelegramMessage(chatId, text) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
    if (!res.ok) {
      console.error(`Telegram API error: ${res.statusText}`);
    }
  } catch (err) {
    console.error("Failed to send message:", err);
  }
}

async function handleMessage(message) {
  const text = message.text ? message.text.trim() : '';
  const chatId = message.chat.id.toString();

  // Security: only allow commands from the configured admin chat ID if set
  if (adminChatId && chatId !== adminChatId) {
    console.warn(`Unauthorized access attempt from Chat ID: ${chatId}`);
    return;
  }

  if (text.startsWith('/start') || text.startsWith('/help')) {
    const helpMsg = `
🤖 *DigiTools Admin Bot*
━━━━━━━━━━━━━━
Welcome! Use the commands below to manage store orders:

📈 /stats — View revenue & order counts
⏳ /pending — List the last 5 pending orders
✅ \`/confirm_[prefix]\` — Confirm payment & grant access
❌ \`/reject_[prefix]\` — Reject invalid order/TrxID
    `.trim();
    await sendTelegramMessage(chatId, helpMsg);
    return;
  }

  if (text === '/stats') {
    await handleStats(chatId);
    return;
  }

  if (text === '/pending') {
    await handlePending(chatId);
    return;
  }

  // Handle confirmation: /confirm_45479877
  const confirmMatch = text.match(/^\/confirm_([a-zA-Z0-9-]+)$/);
  if (confirmMatch) {
    const prefix = confirmMatch[1];
    await updateOrder(chatId, prefix, 'confirmed');
    return;
  }

  // Handle rejection: /reject_45479877
  const rejectMatch = text.match(/^\/reject_([a-zA-Z0-9-]+)$/);
  if (rejectMatch) {
    const prefix = rejectMatch[1];
    await updateOrder(chatId, prefix, 'rejected');
    return;
  }
}

async function handleStats(chatId) {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*');

    if (error) throw error;

    const confirmed = orders.filter(o => o.status === 'confirmed');
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const totalSales = confirmed.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const statsMsg = `
📊 *Store Statistics*
━━━━━━━━━━━━━━
💰 Total Revenue: *$${totalSales}*
✅ Completed Orders: *${confirmed.length}*
⏳ Pending Orders: *${pendingCount}*
━━━━━━━━━━━━━━
    `.trim();

    await sendTelegramMessage(chatId, statsMsg);
  } catch (err) {
    await sendTelegramMessage(chatId, `❌ *Error fetching stats:* ${err.message}`);
  }
}

async function handlePending(chatId) {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!orders || orders.length === 0) {
      await sendTelegramMessage(chatId, "🎉 *No pending orders!* All payments are verified.");
      return;
    }

    let reply = `⏳ *Pending Orders (${orders.length}):*\n━━━━━━━━━━━━━━\n`;
    orders.slice(0, 5).forEach((order, idx) => {
      const shortId = order.id.slice(0, 8);
      const itemsList = order.items?.map(i => i.name).join(', ') || 'No Items';
      reply += `
${idx + 1}. 👤 *${order.user_email}*
   📦 Tools: _${itemsList}_
   💰 Amount: $${order.total_amount}
   📱 bKash: \`${order.bkash_number}\`
   🔑 TrxID: \`${order.bkash_trx_id}\`
   ✅ Confirm: \`/confirm_${shortId}\`
   ❌ Reject: \`/reject_${shortId}\`
      `.trim() + '\n━━━━━━━━━━━━━━\n';
    });

    if (orders.length > 5) {
      reply += `\n_...and ${orders.length - 5} more pending orders._`;
    }

    await sendTelegramMessage(chatId, reply);
  } catch (err) {
    await sendTelegramMessage(chatId, `❌ *Error fetching pending:* ${err.message}`);
  }
}

async function updateOrder(chatId, prefix, status) {
  try {
    // 1. Fetch recent orders to find a prefix match (safe and fast query)
    const { data: orders, error: fetchErr } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (fetchErr) throw fetchErr;

    // Match order ID starting with prefix, ignoring dashes
    const matched = orders.filter(o => 
      o.id.startsWith(prefix) || 
      o.id.replace(/-/g, '').startsWith(prefix)
    );

    if (matched.length === 0) {
      await sendTelegramMessage(chatId, `❌ *Order not found!* No recent order matches prefix \`${prefix}\`.`);
      return;
    }

    if (matched.length > 1) {
      await sendTelegramMessage(chatId, `⚠️ *Multiple matches found!* Specify a longer prefix.`);
      return;
    }

    const order = matched[0];
    
    // 2. Update status in database
    const { error: updateErr } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', order.id);

    if (updateErr) throw updateErr;

    const emoji = status === 'confirmed' ? '✅' : '❌';
    const statusText = status.toUpperCase();

    let reply = `
${emoji} *Order Updated Successfully!*
━━━━━━━━━━━━━━
👤 Email: ${order.user_email}
💰 Total: $${order.total_amount}
🔑 TrxID: \`${order.bkash_trx_id}\`
🆔 Order ID: \`${order.id}\`
📈 New Status: *${statusText}*
━━━━━━━━━━━━━━
    `.trim();

    await sendTelegramMessage(chatId, reply);
  } catch (err) {
    console.error("Error updating order:", err);
    await sendTelegramMessage(chatId, `❌ *Database Error:* ${err.message || err}`);
  }
}

async function pollUpdates() {
  const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.ok && data.result) {
      for (const update of data.result) {
        lastUpdateId = update.update_id;
        if (update.message) {
          await handleMessage(update.message);
        }
      }
    }
  } catch (err) {
    // Suppress polling logging to keep console clean, but log fatal ones
    if (err.code !== 'ETIMEDOUT') {
      console.error("Polling error:", err.message || err);
    }
  }
  setTimeout(pollUpdates, 500);
}

console.log("🤖 Telegram Admin Bot service started. Listening for commands...");
pollUpdates();
