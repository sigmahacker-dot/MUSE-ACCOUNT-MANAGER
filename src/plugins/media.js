'use strict';
const fs=require('fs'), os=require('os'), path=require('path');
const {promisify}=require('util'); const {execFile}=require('child_process');
const run=promisify(execFile); const gTTS=require('node-gtts');
const LANGS=new Set(['en','ur','hi','ar','fr','es','de','pt','ja','zh','id','ru','tr']);
const MAX=15*1024*1024;
function ytUrl(raw){try{const u=new URL(raw);return ['youtube.com','www.youtube.com','m.youtube.com','youtu.be','www.youtu.be','music.youtube.com'].includes(u.hostname)&&['http:','https:'].includes(u.protocol)}catch{return false}}
module.exports=[
{name:'tts',aliases:['speak','voice'],category:'media',description:'Text ko speech audio mein convert karein',async run(ctx){
const first=(ctx.args[0]||'').toLowerCase(), lang=LANGS.has(first)?first:'en', text=(LANGS.has(first)?ctx.args.slice(1):ctx.args).join(' ').trim();
if(!text)return ctx.reply('🔊 Usage: .tts [en/ur/hi/ar/fr/es] your text'); if(text.length>350)return ctx.reply('Text limit 350 characters hai.');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sigma-tts-')), file=path.join(dir,'speech.mp3');
try{await new Promise((res,rej)=>gTTS(lang).save(file,text,e=>e?rej(e):res()));await ctx.sock.sendMessage(ctx.chat,{audio:fs.readFileSync(file),mimetype:'audio/mpeg',ptt:true},{quoted:ctx.msg})}
catch(e){return ctx.reply('❌ TTS fail hua. Internet/language code check karein: '+String(e.message||e).slice(0,100))}
finally{fs.rmSync(dir,{recursive:true,force:true})}
}},
{name:'ytmp3',aliases:['ytaudio','yta'],category:'media',description:'YouTube se audio download (yt-dlp + ffmpeg required)',async run(ctx){
const url=ctx.args[0];if(!url||!ytUrl(url))return ctx.reply('🎵 Usage: .ytmp3 https://youtu.be/...\nSirf apne ya permission-wale content ke liye.');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sigma-yt-')), out=path.join(dir,'%(title).40B.%(ext)s');
try{await run('yt-dlp',['--no-playlist','--no-warnings','--max-filesize','15M','-x','--audio-format','mp3','-o',out,url],{timeout:120000,maxBuffer:1048576});
const file=fs.readdirSync(dir).map(n=>path.join(dir,n)).find(p=>fs.statSync(p).isFile());if(!file)throw Error('No output file');if(fs.statSync(file).size>MAX)throw Error('File 15 MB se bara hai.');
await ctx.sock.sendMessage(ctx.chat,{audio:fs.readFileSync(file),mimetype:'audio/mpeg',fileName:path.basename(file)},{quoted:ctx.msg})}
catch(e){const m=String(e.message||e);return ctx.reply('❌ Download fail: '+(m.includes('ENOENT')?'Termux mein python -m pip install -U yt-dlp aur pkg install ffmpeg karein.':m.slice(0,150)))}
finally{fs.rmSync(dir,{recursive:true,force:true})}
}},
{name:'ytmp4',aliases:['ytvideo','ytv'],category:'media',description:'YouTube se video download (yt-dlp required, max 15 MB)',async run(ctx){
const url=ctx.args[0];if(!url||!ytUrl(url))return ctx.reply('🎬 Usage: .ytmp4 https://youtu.be/...\nSirf apne ya permission-wale content ke liye.');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sigma-yt-')), out=path.join(dir,'%(title).40B.%(ext)s');
try{await run('yt-dlp',['--no-playlist','--no-warnings','--max-filesize','15M','-f','best[ext=mp4][filesize<15M]/best[filesize<15M]','--merge-output-format','mp4','-o',out,url],{timeout:120000,maxBuffer:1048576});
const file=fs.readdirSync(dir).map(n=>path.join(dir,n)).find(p=>fs.statSync(p).isFile()&&/\.(mp4|webm|mkv)$/i.test(p));if(!file)throw Error('No compatible video under 15 MB found');if(fs.statSync(file).size>MAX)throw Error('File 15 MB se bara hai.');
await ctx.sock.sendMessage(ctx.chat,{video:fs.readFileSync(file),mimetype:'video/mp4',caption:'🎬 SIGMA MD BOT'},{quoted:ctx.msg})}
catch(e){const m=String(e.message||e);return ctx.reply('❌ Download fail: '+(m.includes('ENOENT')?'Termux mein python -m pip install -U yt-dlp install karein.':m.slice(0,150)))}
finally{fs.rmSync(dir,{recursive:true,force:true})}
}}
];
