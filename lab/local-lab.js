const http = require("http");
const HOST = "127.0.0.1";
const PORT = Number(process.env.LAB_PORT || 8787);
if (process.argv.includes("--check")) {
 const req = http.request({ hostname:HOST, port:PORT, path:"/health", method:"GET", timeout:2000 }, res => {
  let data = ""; res.on("data", c => data += c); res.on("end", () => { console.log("Local lab HTTP " + res.statusCode + ": " + data); process.exitCode = res.statusCode === 200 ? 0 : 1; });
 });
 req.on("error", err => { console.error("Start lab first with: npm run lab"); console.error(err.message); process.exitCode = 1; }); req.end();
} else {
 const server = http.createServer((req,res) => {
  if (req.url === "/health") { res.writeHead(200, {"content-type":"application/json"}); return res.end(JSON.stringify({status:"ok",scope:"localhost-only"})); }
  res.writeHead(404, {"content-type":"text/plain"}); res.end("Not found");
 });
 server.listen(PORT, HOST, () => console.log("Safe lab listening only at http://" + HOST + ":" + PORT + " (Ctrl+C to stop)"));
}