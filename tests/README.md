# Tests

Three scripts test the final deliverables. They test the **built** files (`web-module/index.html` and the `.pptx`), not the source code. Recorded results are in `test-results/`.

| Script | What it checks | Recorded result |
|---|---|---|
| `qa.js` | 54 Playwright tests on the standalone module: navigation, language switching, Arabic RTL, email and website labs, social engineering decisions, quiz scoring and retake, final score formula, reset on refresh, incident guide, references, no credential inputs, fictional domains, desktop and mobile layouts, keyboard access, contrast, console errors, offline behavior | `test-results/qa-results.json` |
| `http-smoke.js` | Serves the repository over local HTTP under a project sub-path (like `https://<user>.github.io/<repo>/`) and checks that the module loads, makes no extra requests, switches language and answers a quiz question. **This is not a GitHub Pages deployment** | `test-results/http-smoke-results.json` |
| `cross_check.py` | Deck versus module: palette, fonts, quiz questions and answers, reference lists, Arabic speaker notes on all 18 slides, placeholder text, fictional domains | `test-results/cross-check-results.json` |

## Running them

Playwright and Chromium must be available. The recorded results were produced with Playwright 1.56.0 and Chromium 141 on Linux. From the repository root:

```bash
node tests/qa.js                 # all 54 tests; writes tests/test-results/qa-results.json
node tests/http-smoke.js         # local HTTP check
python3 tests/cross_check.py     # needs python-pptx
```

`qa.js` accepts an optional path to a different HTML file: `node tests/qa.js path/to/index.html`.

Installing Playwright with `npm install playwright` and `npx playwright install chromium` is the usual route. That exact installation sequence was not run in this project, because the test environment already had Playwright installed.

## What is not covered

Browsers other than Chromium, real devices, screen readers, the PowerPoint quiz animation in PowerPoint itself, and a fresh `npm install` of the module's build dependencies. See `docs/QA_REPORT.md`.
