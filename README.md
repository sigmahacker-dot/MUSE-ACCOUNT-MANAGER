# SIGMA MD BOT

Termux-first modular WhatsApp bot using a phone-number pairing code.

> Baileys is an unofficial WhatsApp Web library. Unofficial use can lead to restrictions. Use your own account, keep pairing/session credentials private, and follow WhatsApp's terms. Media commands are for content you own or have permission to download.

## Termux install

~~~sh
pkg update -y && pkg upgrade -y
pkg install nodejs-lts git python ffmpeg -y
python -m pip install -U yt-dlp
git clone https://github.com/sigmahacker-dot/MUSE-ACCOUNT-MANAGER.git
cd MUSE-ACCOUNT-MANAGER
npm install
cp .env.example .env
nano .env
npm start
~~~

Set PAIRING_NUMBER to your own international number, digits only. Enter the printed code in WhatsApp → Linked devices → Link a device → Link with phone number instead.

## Commands

Core: .menu, .help, .commands, .ping, .about, .time, .owner, .plugins

Groups: .groupinfo, .kick @member, .promote @member, .welcome, .rules. New members get a styled greeting; set WELCOME=false to disable.

Media: .tts [en/ur/hi/ar/fr/es] text; .ytmp3 URL; .ytmp4 URL. YouTube commands require yt-dlp; audio extraction requires ffmpeg. Video/audio uploads are capped at 15 MB. Site/library changes can affect compatibility.

Developer: .bugreport Short title | detailed description. Configure GITHUB_TOKEN and GITHUB_REPOSITORY=owner/repo. Use a fine-grained token scoped only to Issues read/write on the intended repository. Never share or commit the token.

Local lab: npm run lab, then node lab/local-lab.js --check. It is localhost-only, not an attack tool.

## Notes

This is a modular base, not a claim that 1,000+ commands are all implemented. Silva MD archive has many plugins that need individual security and compatibility review before integration. The provided BugBot archive is a Slack-to-GitHub issue bot, so its issue-reporting workflow is implemented as .bugreport rather than importing its old Slack runtime into WhatsApp.
