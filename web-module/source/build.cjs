// Bundles src/ into ONE offline HTML file (dist/index.html).
// Usage: npm install && npm run build
const fs = require("fs"), path = require("path");
const esbuild = require("esbuild");
(async () => {
  const out = await esbuild.build({
    entryPoints: ["src/main.tsx"], bundle: true, write: false, minify: true,
    format: "iife", target: ["es2019"], outdir: "dist", jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' }, legalComments: "none", logLevel: "warning", nodePaths: (process.env.NODE_PATH || "").split(":").filter(Boolean),
  });
  let js = "", css = "";
  for (const f of out.outputFiles) { if (f.path.endsWith(".js")) js = f.text; if (f.path.endsWith(".css")) css = f.text; }
  const tpl = fs.readFileSync("index.html", "utf8");
  const html = tpl.replace("/*__CSS__*/", () => css).replace("/*__JS__*/", () => js.replace(/<\/script/gi, "<\\/script"));
  fs.mkdirSync("dist", { recursive: true });
  fs.writeFileSync("dist/index.html", html);
  console.log("dist/index.html", (html.length / 1024).toFixed(0) + " KB");
})().catch((e) => { console.error(e); process.exit(1); });
