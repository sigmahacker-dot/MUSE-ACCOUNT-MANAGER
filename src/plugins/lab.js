module.exports = [{ name:"labhelp", category:"security-lab", description:"Explain local-only lab", async run(ctx) {
 return ctx.reply("🧪 SIGMA Safe Lab\nRun npm run lab in one terminal, then node lab/local-lab.js --check in another.\nLab binds to 127.0.0.1 only. No crash, malware, or third-party targeting features.");
}}];