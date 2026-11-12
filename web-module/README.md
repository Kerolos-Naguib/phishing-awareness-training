# Interactive learning module

`index.html` is the finished module: a **single standalone file** (about 330 KB) that contains all code and styles. It needs no installation, no server and no internet connection.

## Use it

Double-click `index.html`, or serve the repository with any static server (for example `python3 -m http.server` from the repository root and open `/web-module/index.html`).

Sections: Dashboard, Email Inspection Lab, Fake Website Detection, Social Engineering Simulation, Knowledge Quiz, Incident Response Guide, Final Score and Results, References. Use the language switch (English or Arabic) in the sidebar, or in the top bar on small screens.

**Behavior to know about**

- Progress is held in memory and **resets to zero when the page is refreshed**. Only the language choice is saved in the browser.
- The page makes no network requests and its Content-Security-Policy blocks them. Links on the References page open external sites and need internet.
- The simulated login page has no input fields. All example domains end in `.test` or `.invalid`.

Screenshots of the running module are in `screenshots/`.

## Source code (`source/`)

React 19 and TypeScript, bundled by esbuild into one HTML file.

```
source/
├── index.html        HTML template (the build inlines the compiled JS and CSS into it)
├── build.cjs         build script
├── package.json
├── tsconfig.json
└── src/
    ├── main.tsx, App.tsx, state.tsx, i18n.ts, styles.css
    ├── components/   one file per section, plus shared UI
    └── data/         all training content (English and Arabic)
```

**Edit the content** in `src/data/`:

| File | Content |
|---|---|
| `emails.ts` | Email lab messages, warning signs and explanations |
| `websites.ts` | Website lab addresses and explanations |
| `social.ts` | Social engineering scenarios, choices and consequences |
| `quiz.ts` | Quiz questions, options, correct answers and explanations |
| `incident.ts` | Incident response steps. Set `ORG_CONTACT_DETAILS` to show your own IT security contact (empty by default) |
| `references.ts` | Sources |

Every user-facing string exists in English and Arabic (`l("English", "العربية")`, or `t("English", "العربية")` inside components).

**Edit the look** in `src/styles.css` (design tokens are in `:root`; see `docs/DESIGN_SYSTEM.md`).

### Build

```bash
cd source
npm install
npm run build          # writes dist/index.html
cp dist/index.html ../index.html
```

Status of this procedure: the build script was run successfully with a pre-installed toolchain (esbuild 0.27.7, React 19.2.5). A fresh `npm install` could not be tested because the build environment had no network access. `npm run typecheck` has not been run, because the type packages were not available there. If either fails on your machine, please fix it and note the change in the QA report.

After rebuilding, rerun `node tests/qa.js` from the repository root.

## GitHub Pages

The module is one static file with no dependencies, so it should be hostable on GitHub Pages without changes. It has not been deployed, and the live site has not been tested. A local HTTP check under a project-style sub-path passed (`tests/http-smoke.js`).

1. Push the repository to GitHub.
2. In the repository, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and the `/ (root)` folder, and save.
4. After GitHub finishes publishing, the module should be at `https://<your-username>.github.io/<repository-name>/web-module/index.html`.

After deploying, open the URL, switch language, finish one lab and confirm there are no errors in the browser console.
