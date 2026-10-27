const botName = process.env.BOT_NAME || "SIGMA MD BOT";
const prefix = process.env.PREFIX || ".";
module.exports = [
 { name:"menu", aliases:["help","commands"], category:"core", description:"List commands", async run(ctx) {
   const grouped = {};
   for (const p of ctx.plugins) (grouped[p.category || "other"] ||= []).push(p);
   const out = [`╭━━〔 ${botName} 〕━━╮`];
   for (const [cat, list] of Object.entries(grouped)) { out.push("\n▸ " + cat.toUpperCase()); for (const p of list) out.push(prefix + p.name + " — " + p.description); }
   out.push("\n╰─ Modular starter • use responsibly"); return ctx.reply(out.join("\n"));
 }},
 { name:"ping", category:"core", description:"Check bot response", async run(ctx) { return ctx.reply("🏓 Pong! SIGMA MD BOT is responding."); }},
 { name:"about", category:"core", description:"Bot information", async run(ctx) { return ctx.reply(botName + "\nModular WhatsApp bot starter\nPhone pairing code • plugins • safe local lab"); }},
 { name:"time", category:"utility", description:"Current time", async run(ctx) { return ctx.reply("🕒 " + new Date().toLocaleString()); }},
 { name:"owner", category:"core", description:"Show configured owner", async run(ctx) { return ctx.reply("Bot owner: " + (ctx.ownerJid || "Set OWNER_JID in .env")); }},
 { name:"plugins", category:"core", description:"Show loaded plugin count", async run(ctx) { return ctx.reply("Loaded " + ctx.plugins.length + " commands/plugins."); }}
];