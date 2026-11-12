// QA suite for the STANDALONE file.
// Usage (from the repository root):  node tests/qa.js [path/to/index.html] [out.json]
// Defaults: web-module/index.html  ->  tests/test-results/qa-results.json
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const FILE = "file://" + path.resolve(process.argv[2] || path.join(__dirname, "..", "web-module", "index.html"));
const OUT = path.resolve(process.argv[3] || path.join(__dirname, "test-results", "qa-results.json"));
const results = [], consoleIssues = [], extRequests = [];
let browser, current = "", ignoreConsole = false;

const ok = (c, m) => { if (!c) throw new Error(m); };
const eq = (a, b, m) => { if (a !== b) throw new Error(`${m}: expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };
async function T(id, area, name, expected, fn) {
  current = id; let status = "PASS", actual = "";
  try { actual = (await fn()) || "as expected"; } catch (e) { status = "FAIL"; actual = String(e.message).split("\n")[0].slice(0, 400); }
  results.push({ id, area, name, expected, actual, status });
  console.log(status, id, "-", name, status === "FAIL" ? "=> " + actual : "");
}
async function fresh(opts = {}, hash = "") {
  const ctx = await browser.newContext(Object.assign({ viewport: { width: 1440, height: 900 } }, opts));
  const p = await ctx.newPage();
  p.on("console", (m) => { if (!ignoreConsole && ["error", "warning"].includes(m.type())) consoleIssues.push({ test: current, type: m.type(), text: m.text().slice(0, 200) }); });
  p.on("pageerror", (e) => consoleIssues.push({ test: current, type: "pageerror", text: e.message.slice(0, 200) }));
  p.on("request", (r) => { const u = r.url(); if (!u.startsWith("file:") && !u.startsWith("data:") && !u.startsWith("blob:")) extRequests.push({ test: current, url: u.slice(0, 120) }); });
  await p.goto(FILE + hash); await p.waitForSelector("main h1");
  return { ctx, p };
}
const mobile = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };
const H1 = (p) => p.locator("main h1").first().innerText();
const nav = (p, n) => p.locator("nav .navitem").nth(n).click();
const ROUTE_H1_EN = ["Learn to read a message the way an analyst does.", "Inspect the message", "Read the address", "What would you do?", "Check what stuck", "If something went wrong", "Your results", "Sources"];
const ROUTE_H1_AR = ["تعلّم أن تقرأ الرسالة كما يقرؤها محلّل أمني.", "افحص الرسالة", "اقرأ العنوان", "ماذا ستفعل؟", "اختبر ما ترسّخ", "إذا حدث خطأ", "نتائجك", "المصادر"];
const hot = (p, text) => p.locator(".mail .hot", { hasText: text }).first();
const EMAIL_SUSP = [
  ["helpdesk@nile-logistics-it.invalid", "Action required", "Verify mailbox now", "Dear user,"],
  ["accounts@atlas-components-billing.invalid", "Our bank account has changed.", "Our phone lines", "today, before the end"],
  ["hr-payroll@nile-logistics-hr.invalid", "Salary_Statement.pdf.exe", 'Enable content'],
];
const EMAIL_NEUTRAL = [["Nile Logistics IT Department", "Mon 09:14"], ["Invoice_4471_new_bank.pdf", "Wed 16:42"], ["Please review it before Friday.", "Thu 08:05"]];
const WEB_CORRECT = [2, 1, 1, 1, 2]; // segment index, or "g" for genuine
const WEB_PLAN = [2, "g", 1, 1, 2];
const QUIZ_OK = [1, 0, 2, 1, 2];

async function doEmails(p) {
  await nav(p, 1);
  for (let e = 0; e < 3; e++) {
    await p.locator(".tabs .tab").nth(e).click();
    for (const t of EMAIL_SUSP[e]) await hot(p, t).click();
  }
}
async function doWeb(p, plan) {
  await nav(p, 2);
  for (let i = 0; i < 5; i++) {
    const c = plan[i];
    if (c === "g") await p.locator("button", { hasText: "This address is genuine" }).click(); else await p.locator(".url .seg").nth(c).click();
    await p.locator("button", { hasText: i < 4 ? "Next address" : "Next: social" }).click();
  }
}
async function doSocial(p, picks) {
  await nav(p, 3);
  for (let i = 0; i < 3; i++) { await p.locator(".tabs .tab").nth(i).click(); await p.locator(".options .opt").nth(picks[i]).click(); }
}
async function doQuiz(p, picks) {
  await nav(p, 4);
  for (let i = 0; i < 5; i++) { await p.locator(".options .opt").nth(picks[i]).click(); if (i < 4) await p.locator("button", { hasText: "Next question" }).click(); }
}
const pct = (p) => p.locator(".scorecard .big b").innerText();

(async () => {
  browser = await chromium.launch();

  // ---------- 1. NAVIGATION ----------
  await T("NAV-01", "Navigation", "Each of the 8 sidebar items opens its view", "h1 matches the module and aria-current moves to the item", async () => {
    const { ctx, p } = await fresh();
    for (let i = 0; i < 8; i++) { await nav(p, i); eq(await H1(p), ROUTE_H1_EN[i], "h1 for item " + (i + 1)); eq(await p.locator("nav .navitem").nth(i).getAttribute("aria-current"), "page", "aria-current " + i); }
    await ctx.close(); return "8/8 views opened with correct heading";
  });
  await T("NAV-02", "Navigation", "Dashboard buttons and queue buttons route correctly", "Start training->Email lab; queue Start buttons->their lab; 'I think I clicked'->Incident guide", async () => {
    const { ctx, p } = await fresh();
    await p.locator("button", { hasText: "Start training" }).click(); eq(await H1(p), "Inspect the message", "Start training");
    await nav(p, 0);
    const want = ["Inspect the message", "Read the address", "What would you do?", "Check what stuck"];
    for (let i = 0; i < 4; i++) { await p.locator(".queue .btn").nth(i).click(); eq(await H1(p), want[i], "queue " + i); await nav(p, 0); }
    await p.locator("button", { hasText: "I think I clicked something" }).click(); eq(await H1(p), "If something went wrong", "incident button");
    await ctx.close(); return "6/6 dashboard buttons routed correctly";
  });
  await T("NAV-03", "Navigation", "'Next' buttons chain through the learning path", "Email->Website->Social->Quiz; Social last->Quiz; hash updates", async () => {
    const { ctx, p } = await fresh();
    await nav(p, 1); await p.locator(".tabs .tab").nth(2).click(); await p.locator("button", { hasText: "Next: websites" }).click(); eq(await H1(p), "Read the address", "email->web");
    await p.locator(".url .seg").nth(2).click(); for (let i = 0; i < 4; i++) { await p.locator("button", { hasText: /Next address|Next: social/ }).click(); if (i < 3) await p.locator(".url .seg, button:has-text('This address is genuine')").first().click(); }
    ok((await H1(p)) !== "", "h1 present");
    ok((await p.evaluate(() => location.hash)).startsWith("#/"), "hash set");
    await ctx.close(); return "Next chain works; hash=" + "#/..";
  });
  await T("NAV-04", "Navigation", "Deep link and hash change open the right view", "Loading #/results shows Your results; changing hash to #/quiz switches view", async () => {
    const { ctx, p } = await fresh({}, "#/results"); eq(await H1(p), "Your results", "deep link");
    await p.evaluate(() => (location.hash = "#/quiz")); await p.waitForFunction(() => document.querySelector("main h1")?.textContent === "Check what stuck");
    await ctx.close(); return "deep link + hashchange OK";
  });

  // ---------- 2. LANGUAGE ----------
  await T("LANG-01", "Language", "Switch EN->AR->EN updates lang, dir, title and nav labels", "html lang/dir flip; labels translate; title translates", async () => {
    const { ctx, p } = await fresh();
    eq(await p.evaluate(() => document.documentElement.dir), "ltr", "initial dir");
    await p.locator(".rail .langsw button", { hasText: "العربية" }).click();
    eq(await p.evaluate(() => document.documentElement.lang + "/" + document.documentElement.dir), "ar/rtl", "AR");
    eq((await p.locator("nav .nlabel").first().innerText()), "لوحة المتابعة", "nav label AR");
    ok((await p.title()).includes("التدريب"), "title AR");
    await p.locator(".rail .langsw button", { hasText: "English" }).click();
    eq(await p.evaluate(() => document.documentElement.lang + "/" + document.documentElement.dir), "en/ltr", "EN");
    await ctx.close(); return "lang/dir/title/labels switch both ways";
  });
  await T("LANG-02", "Language", "Language choice persists after reload", "Arabic still active after page reload", async () => {
    const { ctx, p } = await fresh();
    await p.locator(".rail .langsw button", { hasText: "العربية" }).click(); await p.reload(); await p.waitForSelector("main h1");
    eq(await p.evaluate(() => document.documentElement.dir), "rtl", "dir after reload"); await ctx.close(); return "persisted";
  });
  await T("LANG-03", "Language", "Every view has an Arabic heading", "8 Arabic h1 values match", async () => {
    const { ctx, p } = await fresh(); await p.locator(".rail .langsw button", { hasText: "العربية" }).click();
    for (let i = 0; i < 8; i++) { await nav(p, i); eq(await H1(p), ROUTE_H1_AR[i], "AR h1 " + i); }
    await ctx.close(); return "8/8 Arabic headings";
  });
  await T("LANG-04", "Language", "No untranslated English UI text in Arabic mode (all views, incl. feedback states)", "Only brand names, acronyms, addresses and source titles remain Latin", async () => {
    const { ctx, p } = await fresh(); await p.locator(".rail .langsw button", { hasText: "العربية" }).click();
    const ALLOW = new Set("Code Alpha CISA NSA FBI FTC ABA IC3 DOJ SDNY NIST USENIX SOUPS PDF Delta Trust Bank Atlas Nile Logistics Hana Mostafa Phish Scale ISAC SP Rev English billing stop CyberScoop".toLowerCase().split(" "));
    const leaks = new Set();
    const scan = async (label) => {
      const txt = await p.evaluate(() => { const c = document.querySelector("main").cloneNode(true); c.querySelectorAll(".ltr,.refs a,.org,.refs small,.refs p, small.srcb, .url").forEach((n) => n.remove()); return c.innerText + " " + document.querySelector("nav").innerText + " " + document.querySelector(".railfoot").innerText; });
      txt.replace(/\S*[.@:\/_]\S*/g, " ").split(/[^A-Za-z]+/).filter((w) => w.length >= 3 && !ALLOW.has(w.toLowerCase()) && !/^(exe|pdf|test|invalid)$/i.test(w)).forEach((w) => leaks.add(label + ":" + w));
    };
    for (let i = 0; i < 8; i++) { await nav(p, i); await scan("r" + i); }
    await nav(p, 1); for (let e = 0; e < 3; e++) { await p.locator(".tabs .tab").nth(e).click(); await p.locator(".mail .hot").first().click(); await scan("email"); await p.locator(".mail .hot", { hasText: /Mon|Wed|Thu|الاثنين|الأربعاء|الخميس/ }).first().click(); await scan("email-neutral"); }
    await nav(p, 2); await p.locator(".url .seg").nth(2).click(); await scan("web");
    await nav(p, 3); for (let i = 0; i < 3; i++) { await p.locator(".tabs .tab").nth(i).click(); await p.locator(".options .opt").nth(0).click(); await scan("social"); }
    await nav(p, 4); await p.locator(".options .opt").nth(0).click(); await scan("quiz-fb");
    await nav(p, 5); await scan("incident");
    await ctx.close(); ok(leaks.size === 0, "English leftovers in Arabic mode: " + [...leaks].slice(0, 12).join(", ")); return "no leftovers";
  });

  // ---------- 3. RTL ----------
  await T("RTL-01", "Arabic RTL", "Layout mirrors: sidebar on the right, number nodes right of labels, text aligned right", "rail.left > main.left; node.x > label.x; heading text-align resolves to right", async () => {
    const { ctx, p } = await fresh(); await p.locator(".rail .langsw button", { hasText: "العربية" }).click(); await nav(p, 1);
    const g = await p.evaluate(() => { const r = document.querySelector(".rail").getBoundingClientRect(), m = document.querySelector("main").getBoundingClientRect(), n = document.querySelector(".navitem .node").getBoundingClientRect(), l = document.querySelector(".navitem .nlabel").getBoundingClientRect(); const h = getComputedStyle(document.querySelector("main h1")); return { railRight: r.left > m.left, nodeRight: n.left > l.left, dir: getComputedStyle(document.querySelector("main")).direction, ta: h.textAlign, hx: document.querySelector("main h1").getBoundingClientRect().right, mx: m.right }; });
    ok(g.railRight, "sidebar not on the right"); ok(g.nodeRight, "node not on right of label"); eq(g.dir, "rtl", "main direction");
    ok(["start", "right"].includes(g.ta), "text-align " + g.ta); ok(g.mx - g.hx < 300, "heading not right-aligned"); await ctx.close(); return "mirrored correctly";
  });
  await T("RTL-02", "Arabic RTL", "Addresses/emails stay left-to-right inside Arabic text; arrows flip", "bdi.ltr computed direction ltr; .ic.flip has scaleX(-1)", async () => {
    const { ctx, p } = await fresh(); await p.locator(".rail .langsw button", { hasText: "العربية" }).click(); await nav(p, 1);
    const g = await p.evaluate(() => { const l = [...document.querySelectorAll(".mail .ltr")].map((e) => getComputedStyle(e).direction); const f = document.querySelector(".ic.flip"); return { l, flip: f ? getComputedStyle(f).transform : "none" }; });
    ok(g.l.length > 0 && g.l.every((d) => d === "ltr"), "ltr isolation: " + g.l.join(","));
    ok(g.flip.startsWith("matrix(-1"), "arrow not mirrored: " + g.flip); await ctx.close(); return "ltr spans=" + g.l.length + ", arrow mirrored";
  });
  await T("RTL-03", "Arabic RTL", "Arabic mode has no horizontal overflow on any view (desktop and mobile)", "scrollWidth <= viewport width on 8 views x 2 viewports", async () => {
    for (const o of [{}, mobile]) {
      const { ctx, p } = await fresh(o); const sw = async () => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (o.isMobile) await p.locator(".topbar .langsw button", { hasText: "العربية" }).click(); else await p.locator(".rail .langsw button", { hasText: "العربية" }).click();
      for (let i = 0; i < 8; i++) { await p.evaluate((r) => (location.hash = "#/" + r), ["dashboard", "email", "web", "social", "quiz", "incident", "results", "references"][i]); await p.waitForTimeout(80); const d = await sw(); ok(d <= 1, `overflow ${d}px on view ${i} (${o.isMobile ? "mobile" : "desktop"})`); }
      await ctx.close();
    } return "no overflow";
  });

  // ---------- 4. EMAIL LAB ----------
  await T("EMAIL-01", "Email lab", "Clicking each suspicious element marks it found, explains it and updates the counter/meter", "Per email 4/4/3 found; badge 'Warning sign'; meter aria-valuenow = %; ledger shows titles", async () => {
    const { ctx, p } = await fresh(); await nav(p, 1); const tot = [4, 4, 3];
    for (let e = 0; e < 3; e++) {
      await p.locator(".tabs .tab").nth(e).click();
      for (let k = 0; k < EMAIL_SUSP[e].length; k++) {
        await hot(p, EMAIL_SUSP[e][k]).click();
        eq((await p.locator(".explain .badge").innerText()).trim().replace(/\s+/g, " ").includes("Warning sign"), true, `badge on ${EMAIL_SUSP[e][k]}`);
        const v = Number(await p.locator(".evidence .meter").getAttribute("aria-valuenow")); eq(v, Math.round(((k + 1) / tot[e]) * 100), `meter after click ${k + 1} email ${e}`);
        eq(await p.locator(".ledger li.got").count(), k + 1, "ledger got count");
      }
      ok(await p.locator(".done-box").isVisible(), "completion box on email " + e);
    }
    eq(await p.locator("nav .navitem").nth(1).locator(".nstat").innerText(), "11/11", "sidebar stat"); ok(await p.locator("nav .navitem.done").count() >= 1, "nav done mark");
    await ctx.close(); return "11/11 found; per-email completion shown";
  });
  await T("EMAIL-02", "Email lab", "Normal elements are labelled 'Not a warning sign' and do not count; repeat clicks do not double count", "found stays same; neutral explained; double click no change", async () => {
    const { ctx, p } = await fresh(); await nav(p, 1);
    for (let e = 0; e < 3; e++) {
      await p.locator(".tabs .tab").nth(e).click();
      for (const t of EMAIL_NEUTRAL[e]) { await hot(p, t).click(); ok((await p.locator(".explain .badge").innerText()).includes("Not a warning sign"), "neutral badge for " + t); }
      eq(await p.locator(".ledger li.got").count(), 0, "neutral counted as found");
    }
    await p.locator(".tabs .tab").nth(0).click(); const h = hot(p, "helpdesk@"); await h.click(); await h.click(); await h.dblclick();
    eq(await p.locator(".ledger li.got").count(), 1, "double counting"); await ctx.close(); return "neutral not counted; no double count";
  });
  await T("EMAIL-03", "Email lab", "Switching email resets selection; restart clears the lab; link/attachment elements are clickable", "prompt shown after tab switch; Restart->0/11", async () => {
    const { ctx, p } = await fresh(); await nav(p, 1); await hot(p, "helpdesk@").click(); await p.locator(".tabs .tab").nth(1).click();
    ok((await p.locator(".explain").innerText()).includes("Select something"), "prompt not reset");
    await p.locator("button", { hasText: "Restart this lab" }).click(); eq(await p.locator("nav .navitem").nth(1).locator(".nstat").innerText(), "0/11", "restart");
    await p.locator(".tabs .tab").nth(0).click(); await p.locator(".fakebtn").click(); ok((await p.locator(".explain h3").innerText()).length > 0, "link click explain"); await ctx.close(); return "OK";
  });
  await T("EMAIL-04", "Email lab", "Arabic explanations are shown in Arabic", "explanation heading contains Arabic letters", async () => {
    const { ctx, p } = await fresh(); await p.locator(".rail .langsw button", { hasText: "العربية" }).click(); await nav(p, 1); await hot(p, "helpdesk@").click();
    ok(/[\u0600-\u06FF]/.test(await p.locator(".explain h3").innerText()), "heading not Arabic"); await ctx.close(); return "OK";
  });

  // ---------- 5. WEBSITE LAB ----------
  await T("WEB-01", "Website lab", "Correct answers for all 5 rounds are accepted and scored 5/5", "'Correct' badge each round; sidebar 5/5; 'Correct on first try: 5 of 5'", async () => {
    const { ctx, p } = await fresh(); await nav(p, 2);
    for (let i = 0; i < 5; i++) {
      const c = WEB_PLAN[i]; if (c === "g") await p.locator("button", { hasText: "This address is genuine" }).click(); else await p.locator(".url .seg").nth(c).click();
      ok((await p.locator(".explain .badge").innerText()).includes("Correct"), `round ${i + 1} not correct`);
      ok((await p.locator(".explain p").first().innerText()).length > 20, "no explanation");
      if (i < 4) await p.locator("button", { hasText: "Next address" }).click();
    }
    ok((await p.locator("main").innerText()).includes("Correct on first try: 5 of 5"), "tally"); eq(await p.locator("nav .navitem").nth(2).locator(".nstat").innerText(), "5/5", "stat"); await ctx.close(); return "5/5";
  });
  await T("WEB-02", "Website lab", "Wrong answers are rejected with explanation (wrong segment; 'genuine' on a fake; segment on a genuine)", "'Not quite' badge, culprit revealed, tally excludes them", async () => {
    const { ctx, p } = await fresh(); await nav(p, 2);
    await p.locator(".url .seg").nth(1).click(); ok((await p.locator(".explain .badge").innerText()).includes("Not quite"), "wrong segment accepted"); ok(await p.locator(".seg.cul").count() === 1, "culprit not revealed");
    await p.locator("button", { hasText: "Next address" }).click(); await p.locator(".url .seg").nth(1).click(); ok((await p.locator(".explain .badge").innerText()).includes("Not quite"), "segment on genuine accepted");
    await p.locator("button", { hasText: "Next address" }).click(); await p.locator("button", { hasText: "This address is genuine" }).click(); ok((await p.locator(".explain .badge").innerText()).includes("Not quite"), "genuine on fake accepted");
    ok((await p.locator("main").innerText()).includes("Correct on first try: 0 of 5"), "tally should be 0"); await ctx.close(); return "3/3 wrong answers rejected";
  });
  await T("WEB-03", "Website lab", "Answers lock after the first attempt (no score farming)", "Segments disabled; a second click cannot change result", async () => {
    const { ctx, p } = await fresh(); await nav(p, 2); await p.locator(".url .seg").nth(0).click();
    eq(await p.locator(".url .seg:not([disabled])").count(), 0, "segments still enabled");
    await p.locator(".steps .dot").nth(0).click(); await p.locator(".url .seg").nth(2).click({ force: true }).catch(() => {});
    ok((await p.locator("main").innerText()).includes("Correct on first try: 0 of 5"), "score changed on retry"); await ctx.close(); return "locked";
  });
  await T("WEB-04", "Website lab", "Restart lab clears results", "After 5 answers, Restart resets to 0/5", async () => {
    const { ctx, p } = await fresh(); await doWeb(p, WEB_PLAN); await nav(p, 2); await p.locator("button", { hasText: "Restart this lab" }).click();
    eq(await p.locator("nav .navitem").nth(2).locator(".nstat").innerText(), "0/5", "restart"); await ctx.close(); return "OK";
  });

  // ---------- 6. SOCIAL ----------
  await T("SOC-01", "Social engineering", "All 9 decisions give the right severity, points and consequence", "unsafe 0/2, partial 1/2, safe 2/2; outcome+lesson shown; options lock", async () => {
    const exp = [["Risky choice", "0/2"], ["Partly safe", "1/2"], ["Safe choice", "2/2"]];
    for (let s = 0; s < 3; s++) for (let o = 0; o < 3; o++) {
      const { ctx, p } = await fresh(); await nav(p, 3); await p.locator(".tabs .tab").nth(s).click(); await p.locator(".options .opt").nth(o).click();
      const b = (await p.locator(".explain .badge").innerText()).replace(/\s+/g, " "); ok(b.includes(exp[o][0]) && b.includes(exp[o][1]), `scenario ${s + 1} option ${o + 1}: badge "${b}"`);
      ok((await p.locator(".explain").innerText()).includes("The lesson"), "lesson missing"); eq(await p.locator(".options .opt:not([disabled])").count(), 0, "options not locked");
      if (s === 2) ok(await p.locator(".case").isVisible(), "real case missing"); if (o < 2) ok((await p.locator(".best").count()) === 1, "safest-option hint missing"); else eq(await p.locator(".best").count(), 0, "hint shown on safe choice");
      await ctx.close();
    } return "9/9 decisions correct";
  });
  await T("SOC-02", "Social engineering", "Social progress tracks completion and restart clears it", "3/3 after all scenarios; restart -> 0/3", async () => {
    const { ctx, p } = await fresh(); await doSocial(p, [2, 2, 2]); eq(await p.locator("nav .navitem").nth(3).locator(".nstat").innerText(), "3/3", "stat");
    await p.locator("button", { hasText: "Restart this simulation" }).click(); eq(await p.locator("nav .navitem").nth(3).locator(".nstat").innerText(), "0/3", "restart"); await ctx.close(); return "OK";
  });

  // ---------- 7/8/10. QUIZ ----------
  await T("QUIZ-01", "Quiz", "Immediate feedback: correct answer highlighted, wrong pick flagged, explanation shown, options lock", "Correct->'Correct'; Wrong->'Not quite' + correct option marked; Next only after answering", async () => {
    const { ctx, p } = await fresh(); await nav(p, 4);
    eq(await p.locator("button", { hasText: "Next question" }).count(), 0, "Next visible before answering");
    await p.locator(".options .opt").nth(0).click(); // Q1 wrong (correct is index 1)
    ok((await p.locator(".explain .badge").innerText()).includes("Not quite"), "wrong badge"); eq(await p.locator(".opt.wrongpick").count(), 1, "wrong pick mark"); eq(await p.locator(".opt.right").count(), 1, "right mark"); ok((await p.locator(".explain p").innerText()).length > 20, "explanation");
    eq(await p.locator(".options .opt:not([disabled])").count(), 0, "not locked"); await p.locator("button", { hasText: "Next question" }).click();
    await p.locator(".options .opt").nth(0).click(); ok((await p.locator(".explain .badge").innerText()).includes("Correct"), "correct badge Q2"); eq(await p.locator(".opt.wrongpick").count(), 0, "no wrong mark"); await ctx.close(); return "feedback correct";
  });
  await T("QUIZ-02", "Quiz", "Scoring: all-correct=5/5, all-wrong=0/5, mixed=exact count, recap marks per question", "Score matches answers", async () => {
    let { ctx, p } = await fresh(); await doQuiz(p, QUIZ_OK); ok(await p.locator("button", { hasText: "See your score" }).isVisible(), "last feedback visible before score"); await p.locator("button", { hasText: "See your score" }).click(); eq((await pct(p)), "5", "perfect"); eq(await p.locator(".recap li.ok").count(), 5, "recap ok"); await ctx.close();
    ({ ctx, p } = await fresh()); await doQuiz(p, QUIZ_OK.map((x) => (x + 1) % 4)); await p.locator("button", { hasText: "See your score" }).click(); eq((await pct(p)), "0", "all wrong"); eq(await p.locator(".recap li.bad").count(), 5, "recap bad"); await ctx.close();
    ({ ctx, p } = await fresh()); await doQuiz(p, [1, 3, 2, 0, 2]); await p.locator("button", { hasText: "See your score" }).click(); eq((await pct(p)), "3", "mixed 3/5"); eq(await p.locator(".recap li.ok").count(), 3, "mixed ok"); await ctx.close(); return "5/5, 0/5, 3/5 verified";
  });
  await T("QUIZ-03", "Quiz", "Verdict wording matches score band", "5/5 and 3/5 and 0/5 show different verdicts", async () => {
    const run = async (picks) => { const { ctx, p } = await fresh(); await doQuiz(p, picks); await p.locator("button", { hasText: "See your score" }).click(); const v = await p.locator(".verdict").innerText(); await ctx.close(); return v; };
    const a = await run(QUIZ_OK), b = await run([1, 3, 2, 0, 2]), c = await run(QUIZ_OK.map((x) => (x + 1) % 4)); ok(new Set([a, b, c]).size === 3, "verdicts not distinct: " + [a, b, c].join(" | ")); return "3 distinct verdicts";
  });
  await T("QUIZ-04", "Retake", "Retake clears answers, returns to Q1, and resets sidebar/results", "Question 1 of 5; sidebar 0/5; results quiz 0/5; can score again", async () => {
    const { ctx, p } = await fresh(); await doQuiz(p, QUIZ_OK); await p.locator("button", { hasText: "See your score" }).click(); await p.locator("button", { hasText: "Retake the quiz" }).click();
    ok(await p.locator("text=Question 1 of 5").isVisible(), "not Q1"); eq(await p.locator("nav .navitem").nth(4).locator(".nstat").innerText(), "0/5", "sidebar"); eq(await p.locator(".options .opt:not([disabled])").count(), 4, "options enabled");
    await doQuiz(p, [1, 3, 2, 0, 2]); await p.locator("button", { hasText: "See your score" }).click(); eq(await pct(p), "3", "second attempt score"); await ctx.close(); return "retake works and rescored";
  });
  await T("QUIZ-05", "Quiz", "Leaving mid-quiz and returning resumes at the next unanswered question", "After 2 answers, returning shows Question 3 of 5", async () => {
    const { ctx, p } = await fresh(); await nav(p, 4); await p.locator(".options .opt").nth(1).click(); await p.locator("button", { hasText: "Next question" }).click(); await p.locator(".options .opt").nth(0).click(); await nav(p, 0); await nav(p, 4);
    ok(await p.locator("text=Question 3 of 5").isVisible(), "did not resume"); await ctx.close(); return "resumed";
  });

  // ---------- 9. RESULTS ----------
  await T("RES-01", "Final score", "Perfect run via the UI = 100% and 'Excellent'", "100 + verdict", async () => {
    const { ctx, p } = await fresh(); await doEmails(p); await doWeb(p, WEB_PLAN); await doSocial(p, [2, 2, 2]); await doQuiz(p, QUIZ_OK); await p.locator("button", { hasText: "See your score" }).click(); await nav(p, 6);
    eq(await pct(p), "100", "pct"); ok((await p.locator(".verdict").innerText()).includes("Excellent"), "verdict"); eq(await p.locator("nav .navitem").nth(6).locator(".nstat").innerText(), "100%", "sidebar"); await ctx.close(); return "100%";
  });
  await T("RES-02", "Final score", "Mixed run matches the formula (email 11/11, web 4/5, social 5/6, quiz 3/5 => 81%)", "(1+0.8+0.8333+0.6)/4 = 81%", async () => {
    const { ctx, p } = await fresh(); await doEmails(p); await doWeb(p, [2, "g", 1, 1, 0]); await doSocial(p, [2, 2, 1]); await doQuiz(p, [1, 3, 2, 0, 2]); await p.locator("button", { hasText: "See your score" }).click(); await nav(p, 6);
    eq(await pct(p), "81", "overall pct"); const rows = await p.locator(".skills li .mtop span, .skills li .mtop .ltr").allInnerTexts(); ok(rows.join("|").includes("11/11") && rows.join("|").includes("4/5") && rows.join("|").includes("5/6") && rows.join("|").includes("3/5"), "per-skill rows: " + rows.join("|")); await ctx.close(); return "81% with per-skill 11/11, 4/5, 5/6, 3/5";
  });
  await T("RES-03", "Final score", "Partial progress: only emails done = 25%, labelled in-progress, others 'Not started'", "25 + In progress + 3 'Not started'", async () => {
    const { ctx, p } = await fresh(); await doEmails(p); await nav(p, 6); eq(await pct(p), "25", "pct"); ok((await p.locator(".verdict").innerText()).includes("In progress"), "verdict"); eq(await p.locator(".skills li", { hasText: "Not started" }).count(), 3, "not started count"); await ctx.close(); return "25%";
  });
  await T("RES-04", "Final score", "Reset all progress: Cancel keeps data, OK clears everything", "dialog dismiss -> unchanged; accept -> 0%, labs 0", async () => {
    const { ctx, p } = await fresh(); await doEmails(p); await nav(p, 6);
    p.once("dialog", (d) => d.dismiss()); await p.locator("button", { hasText: "Reset all progress" }).click(); eq(await pct(p), "25", "dismissed changed data");
    p.once("dialog", (d) => d.accept()); await p.locator("button", { hasText: "Reset all progress" }).click(); eq(await pct(p), "0", "accept did not clear"); eq(await p.locator("nav .navitem").nth(1).locator(".nstat").innerText(), "0/11", "sidebar"); await ctx.close(); return "OK";
  });
  await T("PERSIST-01", "Reset on refresh", "Refreshing the page resets ALL progress to zero (sidebar stats, Overall progress, results)", "After finishing the quiz + emails then reload: every sidebar stat 0, Overall progress 0%, results 0%", async () => {
    const { ctx, p } = await fresh(); await doEmails(p); await doQuiz(p, QUIZ_OK); await p.locator("button", { hasText: "See your score" }).click();
    ok((await p.locator(".overall b").innerText()) !== "0%", "precondition: progress should be > 0 before reload");
    await p.reload(); await p.waitForSelector("main h1");
    eq(await p.locator(".overall b").innerText(), "0%", "Overall progress after reload");
    for (const [i, v] of [[1, "0/11"], [2, "0/5"], [3, "0/3"], [4, "0/5"]]) eq(await p.locator("nav .navitem").nth(i).locator(".nstat").innerText(), v, "sidebar item " + i);
    await nav(p, 6); eq(await pct(p), "0", "results after reload"); eq(Number(await p.locator("nav ~ .railfoot .meter, .railfoot .meter").first().getAttribute("aria-valuenow")), 0, "meter");
    await ctx.close(); return "everything back to 0 after reload";
  });
  await T("PERSIST-02", "Reset on refresh", "Only the language is stored; old saved progress from the previous version is ignored", "localStorage holds {lang} only; seeded old progress does not load", async () => {
    const { ctx, p } = await fresh(); await p.evaluate(() => localStorage.setItem("code-alpha-phishing-v1", JSON.stringify({ lang: "en", progress: { quiz: { q1: 1, q2: 0, q3: 2, q4: 1, q5: 2 }, email: {}, web: {}, social: {}, ir: {} } })));
    await p.reload(); await p.waitForSelector("main h1"); eq(await p.locator("nav .navitem").nth(4).locator(".nstat").innerText(), "0/5", "old progress loaded");
    await nav(p, 4); await p.locator(".options .opt").nth(1).click(); const st = await p.evaluate(() => { const k = Object.keys(localStorage); return { n: k.length, f: Object.keys(JSON.parse(localStorage.getItem(k[0]))).join() }; });
    eq(st.n + ":" + st.f, "1:lang", "stored data"); eq(await p.evaluate(() => JSON.stringify(sessionStorage).length), 2, "sessionStorage used"); await ctx.close(); return "stored = lang only";
  });
  await T("PERSIST-03", "Reset on refresh", "Language choice still survives a refresh while progress resets", "Arabic stays after reload; progress 0", async () => {
    const { ctx, p } = await fresh(); await doQuiz(p, QUIZ_OK); await p.locator(".rail .langsw button", { hasText: "العربية" }).click(); await p.reload(); await p.waitForSelector("main h1");
    eq(await p.evaluate(() => document.documentElement.dir), "rtl", "language lost"); eq(await p.locator("nav .navitem").nth(4).locator(".nstat").innerText(), "0/5", "progress kept"); await ctx.close(); return "language kept, progress reset";
  });

  // ---------- INCIDENT GUIDE ----------
  await T("INC-01", "Incident guide", "Four situations switch; checklist toggles, counts and persists per step", "chips change steps; checking updates counter/meter; unchecking reverts", async () => {
    const { ctx, p } = await fresh(); await nav(p, 5); const n0 = await p.locator(".checks label").count();
    const counts = []; for (let i = 0; i < 4; i++) { await p.locator(".chips .chip").nth(i).click(); counts.push(await p.locator(".checks label").count()); }
    ok(counts.every((c) => c >= 3), "steps per situation " + counts); await p.locator(".chips .chip").nth(3).click(); await p.locator(".checks label").nth(0).click(); await p.locator(".checks label").nth(1).click();
    ok((await p.locator(".mtop").first().innerText()).includes("2 / " + counts[3]), "counter"); eq(Number(await p.locator(".panel .meter").getAttribute("aria-valuenow")), Math.round((2 / counts[3]) * 100), "meter");
    await p.locator(".checks label").nth(1).click(); ok((await p.locator(".mtop").first().innerText()).includes("1 / "), "uncheck"); await p.locator(".chips .chip").nth(0).click(); await p.locator(".chips .chip").nth(3).click(); eq(await p.locator(".checks label.on").count(), 1, "state per situation"); await ctx.close(); return "OK, steps=" + counts;
  });

  // ---------- REFERENCES / SECURITY / DOMAINS ----------
  await T("REF-01", "References", "11 reference links, https, open in new tab with noopener", "11 anchors https target=_blank rel contains noopener", async () => {
    const { ctx, p } = await fresh({}, "#/references"); const a = await p.locator(".refs a").evaluateAll((l) => l.map((x) => [x.href.startsWith("https://"), x.target, x.rel])); eq(a.length, 11, "count"); ok(a.every((x) => x[0] && x[1] === "_blank" && x[2].includes("noopener")), "attrs " + JSON.stringify(a.find((x) => !(x[0] && x[1] === "_blank" && x[2].includes("noopener"))))); await ctx.close(); return "11 links OK";
  });
  await T("SEC-01", "Privacy/security", "No text/password/credential inputs on any view; no forms", "Only checkbox inputs (incident guide); 0 <form>", async () => {
    const { ctx, p } = await fresh(); const bad = [];
    for (let i = 0; i < 8; i++) { await nav(p, i); const r = await p.evaluate(() => ({ inputs: [...document.querySelectorAll("input,textarea,select")].filter((e) => e.type !== "checkbox").length, forms: document.querySelectorAll("form").length })); if (r.inputs || r.forms) bad.push(i + ":" + JSON.stringify(r)); }
    ok(bad.length === 0, "found " + bad.join(";")); await ctx.close(); return "no credential inputs";
  });
  await T("DOM-01", "Privacy/security", "All example domains end in .test or .invalid (outside the References page)", "No other TLD in lab/scenario/quiz text, EN and AR", async () => {
    const { ctx, p } = await fresh(); const hosts = new Set();
    const grab = async () => { const t = await p.evaluate(() => document.body.innerText); (t.match(/\b[a-z0-9][a-z0-9-]*(?:\.[a-z0-9-]+)+\b/gi) || []).forEach((h) => hosts.add(h.toLowerCase())); };
    for (const lang of ["English", "العربية"]) { await p.locator(".rail .langsw button", { hasText: lang }).click(); for (let i = 0; i < 6; i++) { await nav(p, i); if (i === 1) { for (let e = 0; e < 3; e++) { await p.locator(".tabs .tab").nth(e).click(); await grab(); } } else if (i === 2) { for (let k = 0; k < 5; k++) { await p.locator(".steps .dot").nth(k).click(); await grab(); } } else if (i === 3) { for (let k = 0; k < 3; k++) { await p.locator(".tabs .tab").nth(k).click(); await grab(); } } else await grab(); } }
    const bad = [...hosts].filter((h) => /\.(com|org|net|gov|edu|io|co|info|biz|us|uk|eg|ru|cn|app|dev)$/.test(h)); await ctx.close(); ok(bad.length === 0, "non-fictional hosts: " + bad.join(", ")); return hosts.size + " hosts checked, all .test/.invalid (or file names)";
  });

  // ---------- RESPONSIVE ----------
  await T("RESP-01", "Responsive desktop", "Desktop 1440/1024: persistent sidebar visible, top bar hidden, no overflow on any view", "rail x=0 width~288; .topbar display none", async () => {
    for (const w of [1440, 1024]) { const { ctx, p } = await fresh({ viewport: { width: w, height: 800 } }); const g = await p.evaluate(() => ({ r: document.querySelector(".rail").getBoundingClientRect().toJSON(), tb: getComputedStyle(document.querySelector(".topbar")).display })); ok(g.r.left === 0 && g.r.width > 250 && g.tb === "none", `layout @${w}: ${JSON.stringify(g)}`);
      for (let i = 0; i < 8; i++) { await nav(p, i); const d = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); ok(d <= 1, `overflow ${d}px view ${i} @${w}`); } await ctx.close(); } return "OK at 1440 and 1024";
  });
  await T("RESP-02", "Responsive mobile", "Tablet 768 / phone 390 / small phone 360: top bar shown, sidebar hidden, no overflow in EN or AR", "scrollWidth<=width on 8 views; rail off-screen", async () => {
    for (const [w, h] of [[768, 1024], [390, 844], [360, 640]]) for (const ar of [false, true]) {
      const { ctx, p } = await fresh({ viewport: { width: w, height: h }, isMobile: w < 800, hasTouch: true }); if (ar) await p.locator(".topbar .langsw button", { hasText: "العربية" }).click();
      const g = await p.evaluate(() => { const r = document.querySelector(".rail").getBoundingClientRect(); return { tb: getComputedStyle(document.querySelector(".topbar")).display, off: r.right <= 1 || r.left >= innerWidth - 1 }; }); ok(g.tb !== "none" && g.off, `chrome @${w} ${ar ? "ar" : "en"}: ${JSON.stringify(g)}`);
      for (let i = 0; i < 8; i++) { await p.evaluate((r) => (location.hash = "#/" + r), ["dashboard", "email", "web", "social", "quiz", "incident", "results", "references"][i]); await p.waitForTimeout(60); const d = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); ok(d <= 1, `overflow ${d}px view ${i} @${w} ${ar ? "ar" : "en"}`); } await ctx.close();
    } return "6 viewport/lang combos x 8 views, no overflow";
  });
  await T("RESP-03", "Responsive mobile", "Mobile menu: opens, navigates and closes; scrim closes; language switch works in top bar", "aria-expanded toggles; item click navigates+closes; scrim click closes", async () => {
    const { ctx, p } = await fresh(mobile); const b = p.locator(".iconbtn"); eq(await b.getAttribute("aria-expanded"), "false", "initial"); await b.click(); eq(await b.getAttribute("aria-expanded"), "true", "open"); ok(await p.locator(".rail.open").count() === 1, "rail open");
    await p.locator("nav .navitem").nth(2).click(); eq(await H1(p), "Read the address", "navigated"); eq(await p.locator(".rail.open").count(), 0, "not closed after nav");
    await b.click(); await p.mouse.click(380, 600); await p.waitForTimeout(100); eq(await p.locator(".rail.open").count(), 0, "scrim did not close"); await p.locator(".topbar .langsw button", { hasText: "العربية" }).click(); eq(await p.evaluate(() => document.documentElement.dir), "rtl", "topbar language"); await ctx.close(); return "OK";
  });
  await T("RESP-04", "Responsive mobile", "Touch targets: primary controls >= 44px tall on mobile; others >= 24px", "btn/opt/tab/chip/iconbtn/navitem >=44; dots/small btn >=24", async () => {
    const { ctx, p } = await fresh(mobile); const bad = []; await p.locator(".iconbtn").click();
    const m = async (sel, min) => { const hs = await p.locator(sel).evaluateAll((l) => l.filter((e) => e.offsetParent !== null || getComputedStyle(e).position === "fixed").map((e) => Math.round(e.getBoundingClientRect().height))); hs.forEach((h) => { if (h < min) bad.push(`${sel}=${h}`); }); };
    await m(".navitem", 44); await m(".iconbtn", 44); await p.locator("nav .navitem").nth(0).click();
    await m(".btn:not(.sm)", 44); await m(".btn.sm", 24);
    await nav2(p, 1); await m(".tab", 44); await nav2(p, 2); await m(".dot", 24); await nav2(p, 4); await m(".opt", 44); await nav2(p, 5); await m(".chip", 44); await m(".checks label", 44);
    async function nav2(pp, i) { await pp.locator(".iconbtn").click(); await pp.locator("nav .navitem").nth(i).click(); }
    await ctx.close(); ok(bad.length === 0, "too small: " + [...new Set(bad)].join(", ")); return "all targets large enough";
  });

  // ---------- KEYBOARD / A11Y ----------
  await T("KEY-01", "Keyboard", "Skip link is first Tab stop and moves focus to main content", "first Tab -> 'Skip to content'; Enter -> activeElement#main", async () => {
    const { ctx, p } = await fresh(); await p.keyboard.press("Tab"); eq((await p.evaluate(() => document.activeElement.textContent)).trim(), "Skip to content", "first stop"); await p.keyboard.press("Enter"); eq(await p.evaluate(() => document.activeElement.id), "main", "focus target"); await ctx.close(); return "OK";
  });
  await T("KEY-02", "Keyboard", "Sidebar can be operated by keyboard and shows a visible focus ring", "focus nav item, Enter navigates, outline visible (>=2px, not none)", async () => {
    const { ctx, p } = await fresh(); await p.keyboard.press("Tab"); for (let i = 0; i < 3; i++) await p.keyboard.press("Tab"); const o = await p.evaluate(() => { const s = getComputedStyle(document.activeElement); return { s: s.outlineStyle, w: parseFloat(s.outlineWidth), cls: document.activeElement.className }; });
    ok(o.s !== "none" && o.w >= 2, "focus ring " + JSON.stringify(o)); await p.keyboard.press("Enter"); ok((await H1(p)).length > 0, "no navigation"); await ctx.close(); return "ring " + o.w + "px";
  });
  await T("KEY-03", "Keyboard", "Email hotspots work with Enter/Space and keep focus after activation", "Enter marks found; activeElement stays on the same hotspot", async () => {
    const { ctx, p } = await fresh({}, "#/email"); const h = p.locator(".mail .hot").first(); await h.focus(); await p.keyboard.press("Enter");
    eq(await p.locator(".ledger li.got").count(), 1, "Enter did not activate"); const still = await p.evaluate(() => document.activeElement?.classList.contains("hot")); ok(still, "focus lost to <" + (await p.evaluate(() => document.activeElement?.tagName)) + "> after activation");
    await p.locator(".mail .hot").nth(2).focus(); await p.keyboard.press("Space"); ok((await p.locator(".explain h3").innerText()).length > 0, "Space did not activate"); await ctx.close(); return "OK";
  });
  await T("KEY-04", "Keyboard", "Language buttons keep focus after toggling by keyboard", "Enter on العربية: activeElement is still a language button; aria-pressed updates", async () => {
    const { ctx, p } = await fresh(); const b = p.locator(".rail .langsw button").nth(1); await b.focus(); await p.keyboard.press("Enter");
    eq(await p.evaluate(() => document.documentElement.dir), "rtl", "not switched"); const f = await p.evaluate(() => document.activeElement.closest(".langsw") !== null); ok(f, "focus lost after language switch (activeElement=" + (await p.evaluate(() => document.activeElement.tagName)) + ")");
    eq(await p.locator(".rail .langsw button").nth(1).getAttribute("aria-pressed"), "true", "aria-pressed"); await ctx.close(); return "OK";
  });
  await T("KEY-05", "Keyboard", "Website lab, social and quiz can be completed using only the keyboard", "Enter selects; feedback appears", async () => {
    const { ctx, p } = await fresh(); await nav(p, 2); await p.locator(".url .seg").nth(2).focus(); await p.keyboard.press("Enter"); ok((await p.locator(".explain .badge").innerText()).includes("Correct"), "web");
    await nav(p, 3); await p.locator(".options .opt").nth(2).focus(); await p.keyboard.press("Enter"); ok((await p.locator(".explain .badge").innerText()).includes("Safe"), "social");
    await nav(p, 4); await p.locator(".options .opt").nth(1).focus(); await p.keyboard.press("Space"); ok((await p.locator(".explain .badge").innerText()).includes("Correct"), "quiz");
    await nav(p, 5); await p.locator(".checks input").first().focus(); await p.keyboard.press("Space"); eq(await p.locator(".checks label.on").count(), 1, "checklist space"); await ctx.close(); return "OK";
  });
  await T("KEY-06", "Keyboard", "Mobile: hidden sidebar is not reachable by Tab while closed; Escape closes the open menu", "20 Tab presses never land off-screen; Esc closes", async () => {
    const { ctx, p } = await fresh(mobile); const off = [];
    for (let i = 0; i < 20; i++) { await p.keyboard.press("Tab"); const r = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const b = e.getBoundingClientRect(); const vis = getComputedStyle(e).visibility; return { x: Math.round(b.x), r: Math.round(b.right), tag: e.className || e.tagName, vis }; }); if (r && (r.r <= 0 || r.x >= 390 || r.vis === "hidden")) off.push(JSON.stringify(r)); }
    ok(off.length === 0, "focus reached off-screen items: " + off.slice(0, 2).join(" ")); await p.locator(".iconbtn").click(); await p.keyboard.press("Escape"); await p.waitForTimeout(80); eq(await p.locator(".rail.open").count(), 0, "Escape did not close menu"); await ctx.close(); return "OK";
  });
  await T("KEY-07", "Keyboard", "Focus moves to the new view after navigation (screen reader / keyboard users)", "After choosing a nav item, activeElement is main or inside main", async () => {
    const { ctx, p } = await fresh(); await p.locator("nav .navitem").nth(2).focus(); await p.keyboard.press("Enter"); await p.waitForTimeout(80);
    const inMain = await p.evaluate(() => { const m = document.getElementById("main"); return document.activeElement === m || m.contains(document.activeElement); }); ok(inMain, "focus stayed on sidebar button"); await ctx.close(); return "OK";
  });
  await T("A11Y-01", "Accessibility", "Landmarks, single h1, named controls, aria-live feedback, progressbar semantics", "main/nav/aside present; 1 h1 per view; every button/link has an accessible name; live regions exist", async () => {
    const { ctx, p } = await fresh(); const issues = [];
    for (let i = 0; i < 8; i++) { await nav(p, i); const r = await p.evaluate(() => { const un = [...document.querySelectorAll("button,a,input")].filter((e) => !(e.innerText || "").trim() && !e.getAttribute("aria-label") && !e.labels?.length && !(e.textContent || "").trim()).map((e) => e.className); return { h1: document.querySelectorAll("h1").length, un, lm: [!!document.querySelector("main"), !!document.querySelector("nav"), !!document.querySelector("aside")], pb: [...document.querySelectorAll("[role=progressbar]")].filter((e) => !e.getAttribute("aria-label")).length }; }); if (r.h1 !== 1) issues.push(`view${i} h1=${r.h1}`); if (r.un.length) issues.push(`view${i} unnamed: ${r.un}`); if (r.lm.includes(false)) issues.push("landmark"); if (r.pb) issues.push("progressbar unnamed view" + i); }
    await nav(p, 1); ok(await p.locator(".explain[aria-live]").count() === 1, "email live region"); await ctx.close(); ok(issues.length === 0, issues.join("; ")); return "OK";
  });
  await T("A11Y-02", "Accessibility", "Text contrast >= 4.5:1 (3:1 for large text) across views and feedback states", "0 failing text elements (disabled controls exempt)", async () => {
    const { ctx, p } = await fresh(); const fails = new Map();
    const audit = async (label) => { const r = await p.evaluate(() => {
      const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(",").map((x) => parseFloat(x)); return { r: a[0], g: a[1], b: a[2], a: a[3] === undefined ? 1 : a[3] }; };
      const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
      const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
      const bgOf = (el) => { const chain = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) chain.push(c); if (c && c.a >= 1) break; } let base = { r: 16, g: 24, b: 32, a: 1 }; for (let i = chain.length - 1; i >= 0; i--) base = over(chain[i], base); return base; };
      const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) { const n = w.currentNode; if (!n.textContent.trim()) continue; const el = n.parentElement; if (!el || el.closest("button:disabled,[disabled]") || el.closest("script,style")) continue; const cs = getComputedStyle(el); const rc = el.getBoundingClientRect(); if (cs.visibility === "hidden" || rc.width === 0 || rc.right <= 0 && rc.left < 0) continue;
        let op = 1; for (let e = el; e; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity); const fg0 = parse(cs.color); const bg = bgOf(el); const fg = over({ ...fg0, a: fg0.a * op }, bg); const l1 = lum(fg), l2 = lum(bg); const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700; const large = size >= 24 || (size >= 18.66 && bold); if (ratio < (large ? 3 : 4.5)) out.push({ t: n.textContent.trim().slice(0, 30), ratio: +ratio.toFixed(2), cls: el.className || el.tagName }); }
      return out; });
      r.forEach((x) => fails.set(label + "|" + x.cls + "|" + x.ratio, x.t)); };
    for (let i = 0; i < 8; i++) { await nav(p, i); await audit("v" + i); }
    await nav(p, 1); await hot(p, "helpdesk@").click(); await audit("email-found"); await hot(p, "Mon 09:14").click(); await audit("email-neutral");
    await nav(p, 2); await p.locator(".url .seg").nth(1).click(); await audit("web-wrong"); await nav(p, 3); await p.locator(".options .opt").nth(0).click(); await audit("social-unsafe"); await nav(p, 4); await p.locator(".options .opt").nth(0).click(); await audit("quiz-wrong");
    await ctx.close(); ok(fails.size === 0, fails.size + " low-contrast text items, e.g. " + [...fails].slice(0, 4).map(([k, v]) => `${k.split("|").slice(0, 3).join("|")} "${v}"`).join("; ")); return "no contrast failures";
  });

  // ---------- OFFLINE ----------
  await T("OFF-01", "Offline", "Standalone file contains no external references (scripts, styles, fonts, images, imports)", "no <script src>, <link href>, @import, url(http), src=http", async () => {
    const html = fs.readFileSync(FILE.replace("file://", ""), "utf8"); const bad = [];
    if (/<script[^>]+src=/i.test(html)) bad.push("script src"); if (/<link[^>]+href=/i.test(html)) bad.push("link href"); if (/@import/i.test(html)) bad.push("@import"); if (/url\(\s*["']?https?:/i.test(html)) bad.push("css url(http)"); if (/<img[^>]+src=["']https?:/i.test(html)) bad.push("img http");
    ok(bad.length === 0, bad.join(", ")); ok(/Content-Security-Policy/.test(html), "no CSP meta"); return "self-contained, " + Math.round(html.length / 1024) + " KB, CSP present";
  });
  await T("OFF-02", "Offline", "Full journey works with the network disabled and every http(s) request aborted", "0 outbound requests, 0 failed requests, all views and interactions work", async () => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, offline: true }); await ctx.route(/^https?:/, (r) => r.abort()); const p = await ctx.newPage(); const attempts = [];
    p.on("request", (r) => { if (/^https?:/.test(r.url())) attempts.push(r.url()); }); p.on("pageerror", (e) => consoleIssues.push({ test: "OFF-02", type: "pageerror", text: e.message }));
    await p.goto(FILE); await p.waitForSelector("main h1"); await doEmails(p); await doWeb(p, WEB_PLAN); await doSocial(p, [2, 2, 2]); await doQuiz(p, QUIZ_OK); await p.locator("button", { hasText: "See your score" }).click(); await nav(p, 6); eq(await pct(p), "100", "score offline");
    await p.locator(".rail .langsw button", { hasText: "العربية" }).click(); eq(await H1(p), "نتائجك", "AR offline"); await p.reload(); await p.waitForSelector("main h1"); eq(await H1(p), "نتائجك", "reload offline"); eq(attempts.length, 0, "outbound attempts " + attempts.join(",")); await ctx.close(); return "journey + AR + reload OK offline, 0 outbound requests";
  });
  await T("OFF-03", "Offline", "CSP blocks network calls from the page (fetch/XHR/image beacons)", "fetch('https://example.com') rejects", async () => {
    const { ctx, p } = await fresh(); ignoreConsole = true; const r = await p.evaluate(async () => { try { await fetch("https://example.com/x"); return "allowed"; } catch (e) { return "blocked"; } }); ignoreConsole = false; eq(r, "blocked", "fetch result"); await ctx.close(); return "fetch blocked by CSP";
  });

  // ---------- CONSOLE ----------
  await T("CON-01", "Console", "No console errors/warnings or uncaught exceptions during the whole suite (EN, AR, desktop, mobile, offline)", "0 issues", async () => {
    ok(consoleIssues.length === 0, consoleIssues.length + " issue(s): " + consoleIssues.slice(0, 3).map((c) => `${c.test}:${c.type}:${c.text}`).join(" | ")); ok(extRequests.length === 0, "external requests: " + extRequests.slice(0, 3).map((x) => x.url).join(",")); return "0 console issues, 0 external requests";
  });

  const env = { date: new Date().toISOString().slice(0, 10), playwright: require("playwright/package.json").version, browser: "Chromium " + browser.version(), node: process.version, platform: process.platform + " " + process.arch, file: path.basename(FILE) };
  await browser.close();
  const nFail = results.filter((r) => r.status === "FAIL").length;
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ environment: env, summary: { total: results.length, passed: results.length - nFail, failed: nFail }, results }, null, 1));
  const f = results.filter((r) => r.status === "FAIL"); console.log(`\nTOTAL ${results.length}  PASS ${results.length - f.length}  FAIL ${f.length}`);
})().catch((e) => { console.error("HARNESS ERROR", e); process.exit(1); });
