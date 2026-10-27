'use strict';
module.exports=[
{name:'welcome',aliases:['greet'],category:'groups',description:'Welcome system status',groupOnly:true,async run(ctx){return ctx.reply('👋 *SIGMA MD BOT — Welcome system*\nWelcome setting: '+((process.env.WELCOME||'true').toLowerCase()!=='false'?'ON':'OFF')+'\nNew members ko styled greeting bheji jati hai.')}},
{name:'rules',category:'groups',description:'Show group rules template',groupOnly:true,async run(ctx){return ctx.reply('╭━━〔 📜 GROUP RULES 〕━━╮\n│ 1. Respect everyone\n│ 2. No spam/scams\n│ 3. No unsolicited links\n│ 4. Follow admins\n╰━━━━━━━━━━━━━━━━━━╯')}}
];
