export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
try {
const body = req.body || {};
const message = body.message || body.edited_message;
const chatId = message && message.chat && message.chat.id;
const text = (message && message.text) || '';
if (!chatId) {
return res.status(200).json({ ok: true, ignored: true });
}
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
return res.status(500).json({ ok: false, error: 'Missing TELEGRAM_BOT_TOKEN' });
}
const replyText = text ? `I got your message: "${text}"` : `I got your message.`;
const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ chat_id: chatId, text: replyText })
});
const tgJson = await tgRes.json();
if (!tgRes.ok) {
return res.status(500).json({ ok: false, telegram_error: tgJson });
}
return res.status(200).json({ ok: true });
} catch (error) {
return res.status(500).json({ ok: false, error: (error && error.message) || 'Unknown error' });
}
}
