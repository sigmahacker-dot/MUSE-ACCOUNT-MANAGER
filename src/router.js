const PREFIX = process.env.PREFIX || ".";
const OWNER_JID = process.env.OWNER_JID || "";
function getText(message) {
  const m = message.message || {};
  return m.conversation || m.extendedTextMessage?.text || m.imageMessage?.caption ||
    m.videoMessage?.caption || m.documentMessage?.caption ||
    m.buttonsResponseMessage?.selectedButtonId || m.listResponseMessage?.singleSelectReply?.selectedRowId || "";
}
async function handleMessage(sock, msg, plugins) {
  if (!msg.message || msg.key.fromMe) return;
  const text = getText(msg).trim();
  if (!text.startsWith(PREFIX)) return;
  const [raw, ...args] = text.slice(PREFIX.length).trim().split(/\s+/);
  const command = (raw || "").toLowerCase();
  if (!command) return;
  const chat = msg.key.remoteJid;
  const sender = msg.key.participant || chat;
  const isGroup = chat.endsWith("@g.us");
  const plugin = plugins.find(p => p.name === command || (p.aliases || []).includes(command));
  if (!plugin) return sock.sendMessage(chat, { text: `Unknown command: ${command}\nType ${PREFIX}menu.` }, { quoted: msg });
  const ctx = { sock, msg, chat, sender, isGroup, args, text, command, prefix: PREFIX, ownerJid: OWNER_JID, plugins,
    reply: content => sock.sendMessage(chat, { text: String(content) }, { quoted: msg }) };
  if (plugin.ownerOnly && sender !== OWNER_JID) return ctx.reply("Owner-only command.");
  if (plugin.groupOnly && !isGroup) return ctx.reply("This command only works in groups.");
  return plugin.run(ctx);
}
module.exports = { handleMessage };
