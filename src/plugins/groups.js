async function metadata(sock, jid) { const meta = await sock.groupMetadata(jid); return { meta, admins: meta.participants.filter(p => p.admin).map(p => p.id) }; }
function mentions(ctx) { return ctx.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []; }
module.exports = [
 { name:"groupinfo", category:"groups", groupOnly:true, description:"Show group info", async run(ctx) {
   const m = await ctx.sock.groupMetadata(ctx.chat); return ctx.reply("📋 " + m.subject + "\nMembers: " + m.participants.length + "\nGroup ID: " + ctx.chat);
 }},
 { name:"kick", category:"moderation", groupOnly:true, description:"Remove mentioned member (admins only)", async run(ctx) {
   const { admins } = await metadata(ctx.sock, ctx.chat);
   if (!admins.includes(ctx.sender)) return ctx.reply("Only group admins can use this command.");
   const targets = mentions(ctx); if (!targets.length) return ctx.reply("Mention a member first.");
   await ctx.sock.groupParticipantsUpdate(ctx.chat, targets, "remove"); return ctx.reply("Removal request sent.");
 }},
 { name:"promote", category:"moderation", groupOnly:true, description:"Promote mentioned member (admins only)", async run(ctx) {
   const { admins } = await metadata(ctx.sock, ctx.chat);
   if (!admins.includes(ctx.sender)) return ctx.reply("Only group admins can use this command.");
   const targets = mentions(ctx); if (!targets.length) return ctx.reply("Mention a member first.");
   await ctx.sock.groupParticipantsUpdate(ctx.chat, targets, "promote"); return ctx.reply("Promotion request sent.");
 }}
];