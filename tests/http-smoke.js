// GitHub-Pages-style smoke test: serves the repository over local HTTP under a project sub-path
// (like https://<user>.github.io/<repo>/web-module/index.html) and checks that the module loads and works.
// This is NOT a GitHub Pages deployment. Usage (from the repo root):  node tests/http-smoke.js
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, ".."), PREFIX = "/phishing-awareness-training";
const results = [];
const T = (name, ok, detail) => { results.push({ name, status: ok ? "PASS" : "FAIL", detail }); console.log(ok ? "PASS" : "FAIL", name, "-", detail); };
const served = [];
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split("?")[0]); served.push(u);
  if (!u.startsWith(PREFIX + "/")) { res.writeHead(404); return res.end("not found"); }
  const f = path.join(ROOT, u.slice(PREFIX.length)); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end("not found"); }
  const type = { ".html": "text/html; charset=utf-8", ".png": "image/png", ".md": "text/markdown" }[path.extname(f)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type }); fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r)); const port = server.address().port;
  const browser = await chromium.launch(); const p = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const issues = [], reqs = [];
  p.on("console", (m) => { if (["error", "warning"].includes(m.type())) issues.push(m.text()); }); p.on("pageerror", (e) => issues.push(e.message)); p.on("request", (r) => reqs.push(r.url()));
  const resp = await p.goto(`http://127.0.0.1:${port}${PREFIX}/web-module/index.html`); await p.waitForSelector("main h1");
  T("Loads over HTTP from a project sub-path", resp.status() === 200, "HTTP " + resp.status());
  const ext = reqs.filter((u) => !u.startsWith(`http://127.0.0.1:${port}${PREFIX}/web-module/index.html`) && !u.startsWith("data:"));
  T("No additional files or external hosts requested (relative paths not needed)", ext.length === 0, ext.length ? ext.join(", ") : "only index.html was requested");
  const heads = []; for (let i = 0; i < 8; i++) { await p.locator("nav .navitem").nth(i).click(); heads.push(await p.locator("main h1").first().innerText()); }
  T("All 8 views open", heads.every((h) => h.length > 0), heads.length + " views");
  await p.locator(".rail .langsw button", { hasText: "العربية" }).click();
  T("Language switch to Arabic sets RTL", (await p.evaluate(() => document.documentElement.dir)) === "rtl", "dir=rtl");
  await p.locator(".rail .langsw button", { hasText: "English" }).click(); await p.locator("nav .navitem").nth(4).click(); await p.locator(".options .opt").nth(1).click();
  T("Quiz answer gives feedback", (await p.locator(".explain .badge").innerText()).includes("Correct"), "Correct badge shown for the right answer");
  T("No console errors or warnings", issues.length === 0, issues.length ? issues.join(" | ").slice(0, 200) : "0 issues");
  await browser.close(); server.close();
  const nf = results.filter((r) => r.status === "FAIL").length;
  fs.writeFileSync(path.join(__dirname, "test-results", "http-smoke-results.json"), JSON.stringify({ environment: { date: new Date().toISOString().slice(0, 10), playwright: require("playwright/package.json").version, note: "local HTTP server under /phishing-awareness-training/; not a GitHub Pages deployment" }, summary: { total: results.length, passed: results.length - nf, failed: nf }, results }, null, 1));
  console.log(`TOTAL ${results.length} PASS ${results.length - nf} FAIL ${nf}`);
  process.exit(nf ? 1 : 0);
})();
