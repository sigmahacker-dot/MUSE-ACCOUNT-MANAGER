# SIGMA MD BOT

Modular WhatsApp bot starter for Android Termux with **phone-number pairing code**, command plugins, group moderation helpers, and a safe localhost-only security lab.

> **Compatibility notice:** Baileys is an unofficial WhatsApp Web library. WhatsApp can change its protocol and unofficial use may cause restrictions or bans. Use only a number you own and follow WhatsApp's terms. For business-critical messaging, prefer the official WhatsApp Business Platform (which uses a different onboarding flow).

## Install on Termux

```bash
pkg update -y
pkg upgrade -y
pkg install nodejs-lts git -y
git clone https://github.com/sigmahacker-dot/MUSE-ACCOUNT-MANAGER.git
cd MUSE-ACCOUNT-MANAGER
npm install
cp .env.example .env
nano .env
npm start
```

Set `PAIRING_NUMBER` in `.env` to your own number in international format with digits only, e.g. `923001234567` (no plus sign or spaces). Start the bot; it prints a pairing code. In WhatsApp go to **Linked devices → Link a device → Link with phone number instead**, then enter the code. Availability of this option depends on the WhatsApp client/version. Do not share the code or session folder.

## Commands

- `.menu` / `.help`
- `.ping`, `.about`, `.time`, `.owner`, `.plugins`
- `.groupinfo` (group only)
- `.kick @member`, `.promote @member` (group admin only)
- `.labhelp`

## Safe local lab

Terminal 1:
```bash
npm run lab
```
Terminal 2:
```bash
node lab/local-lab.js --check
```

The lab listens only on `127.0.0.1` and checks its own endpoint. Do not use it to target third-party systems. No crash attacks, malware, unsolicited mass messaging, or account-abuse features are included.

## Plugin architecture

Add commands as small modules in `src/plugins/`, then register them in `src/plugins/index.js`. This starter is **not 1,000 fully implemented commands yet**; it provides a scalable structure for adding more.

## Security

- Never commit `.env`, `auth_info_baileys/`, pairing codes, or session credentials.
- If your session is exposed, unlink the device in WhatsApp immediately.
- Termux on Android is not guaranteed to run 24/7 because battery management may stop background processes.
- This bot does not create WhatsApp accounts or phone numbers.
