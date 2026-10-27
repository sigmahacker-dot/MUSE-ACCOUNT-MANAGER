require("dotenv").config();
const pino = require("pino");
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const plugins = require("./plugins");
const { handleMessage } = require("./router");
const { bindWelcomeEvents } = require("./welcome-events");

const logger = pino({ level: process.env.LOG_LEVEL || "silent" });
const BOT_NAME = process.env.BOT_NAME || "SIGMA MD BOT";
const PAIRING_NUMBER = (process.env.PAIRING_NUMBER || "").replace(/[^0-9]/g, "");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  let version;
  try { version = (await fetchLatestBaileysVersion()).version; } catch {}
  const sock = makeWASocket({
    version, auth: state, logger, printQRInTerminal: false,
    browser: [BOT_NAME, "Chrome", "1.0.0"],
    markOnlineOnConnect: false, syncFullHistory: false
  });

  bindWelcomeEvents(sock);
  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (!state.creds.registered && PAIRING_NUMBER && !globalThis.sigmaPairCodeRequested) {
      globalThis.sigmaPairCodeRequested = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1200));
        const code = await sock.requestPairingCode(PAIRING_NUMBER);
        console.log("\n==================================");
        console.log(BOT_NAME + " — WHATSAPP PAIRING CODE");
        console.log("Your code: " + code);
        console.log("WhatsApp → Linked devices → Link with phone number instead");
        console.log("Never share this code with anyone.");
        console.log("==================================\n");
      } catch (err) {
        globalThis.sigmaPairCodeRequested = false;
        console.error("Could not request pairing code:", err?.message || err);
        console.error("Check PAIRING_NUMBER format and try again.");
      }
    }
    if (connection === "open") {
      console.log("\n✨ " + BOT_NAME + " CONNECTED — " + plugins.length + " plugins loaded. Type .menu.");
      const owner = process.env.OWNER_JID || "";
      if (owner && !globalThis.sigmaOwnerWelcomeSent) {
        globalThis.sigmaOwnerWelcomeSent = true;
        const welcome = "╭━━〔 SIGMA MD BOT 〕━━╮\n│ ✅ PAIRING SUCCESSFUL\n│ Bot is connected!\n│ Commands: .menu\n│ TTS: .tts hello\n│ YouTube: .ytmp3 URL / .ytmp4 URL\n╰━━━━━━━━━━━━━━━━━━━━╯\nKeep your session private.";
        try { await sock.sendMessage(owner, { text: welcome }); } catch (e) { console.error("Owner welcome failed:", e.message); }
      }
    }
    if (connection === "close") {\n      globalThis.sigmaOwnerWelcomeSent = false;
      const code = lastDisconnect?.error?.output?.statusCode;
      const reconnect = code !== DisconnectReason.loggedOut;
      console.log("Connection closed.", reconnect ? "Reconnecting…" : "Logged out; remove auth_info_baileys and pair again.");
      if (reconnect) setTimeout(() => { globalThis.sigmaPairCodeRequested = false; startBot(); }, 2500);
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const msg of messages) {
      try { await handleMessage(sock, msg, plugins); }
      catch (err) { console.error("Message handler error:", err?.message || err); }
    }
  });
}
startBot().catch(err => { console.error("Startup failed:", err); process.exitCode = 1; });
