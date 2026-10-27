module.exports.bindWelcomeEvents=function(sock){
sock.ev.on('group-participants.update',async({id,participants,action})=>{
if((process.env.WELCOME||'true').toLowerCase()==='false'||action!=='add')return;
for(const jid of (participants||[]).slice(0,10)){const mention='@'+String(jid).split('@')[0];
const text='╭━━〔 ✨ WELCOME TO THE GROUP 〕━━╮\n│ Hey '+mention+'! 👋\n│ Aapka welcome hai!\n│ Please group rules follow karein.\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n🤖 *SIGMA MD BOT*';
try{await sock.sendMessage(id,{text,mentions:[jid]})}catch(e){console.error('Welcome message failed:',e.message)}
}
});
};
