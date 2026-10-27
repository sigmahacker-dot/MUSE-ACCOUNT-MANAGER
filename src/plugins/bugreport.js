'use strict';
module.exports={name:'bugreport',aliases:['issue','reportbug'],category:'developer',description:'Create GitHub issue (BugBot-style)',async run(ctx){
const token=process.env.GITHUB_TOKEN,repo=process.env.GITHUB_REPOSITORY,raw=ctx.args.join(' ').trim();
if(!token||!repo)return ctx.reply('⚙️ Configure GITHUB_TOKEN and GITHUB_REPOSITORY=owner/repo in .env first.');
const parts=raw.split('|').map(s=>s.trim());if(parts.length<2||!parts[0]||!parts[1])return ctx.reply('Usage: .bugreport Short title | detailed description');
if(!/^[\w.-]+\/[\w.-]+$/.test(repo))return ctx.reply('GITHUB_REPOSITORY must be owner/repo.');
try{const r=await fetch('https://api.github.com/repos/'+repo+'/issues',{method:'POST',headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},body:JSON.stringify({title:parts[0].slice(0,200),body:parts.slice(1).join(' | ').slice(0,5000)+'\n\nReported via SIGMA MD BOT'})});
const d=await r.json();if(!r.ok)throw Error(d.message||('GitHub API error '+r.status));return ctx.reply('✅ *Bug report created*\n#'+d.number+' — '+d.title+'\n'+d.html_url)}
catch(e){return ctx.reply('❌ GitHub issue create nahi hua: '+String(e.message||e).slice(0,150))}
}};
