# QA report

This report separates **what was executed** from **what was not**. A test is listed as passed only if it ran and passed. Results come from the JSON files in [`tests/test-results/`](../tests/test-results/), produced by the scripts in [`tests/`](../tests/).

## Environment

| Item | Value |
|---|---|
| Test date | 2026-11-09 |
| Browser | Chromium 141.0.7390.37 (via Playwright 1.56.0) |
| Node.js | v22.22.2 |
| OS | linux x64 (container) |
| Viewports used | 1440x900 and 1024x800 (desktop), 768x1024 (tablet), 390x844 and 360x640 (phone, Chromium device emulation with touch) |
| Other tools | python-pptx 1.0.2, LibreOffice 24.2.7.2 (rendering and file validation) |
| File under test | `web-module/index.html` (the final standalone build, opened through `file://`) |

## Summary

| Suite | Executed | Passed | Failed |
|---|---|---|---|
| Playwright suite (`tests/qa.js`) | 54 | 54 | 0 |
| Local HTTP smoke test (`tests/http-smoke.js`) | 6 | 6 | 0 |
| Deck-versus-module checks (`tests/cross_check.py`) | 9 | 9 | 0 |
| PowerPoint file checks (see below) | 4 | 4 | 0 |
| Repository hygiene checks (see below) | 7 | 7 | 0 |

## Executed and not executed

| Area | Status |
|---|---|
| Navigation, language switching, Arabic RTL, all labs, quiz, final score, retake, reset on refresh | **Executed** (Playwright) |
| Desktop and emulated phone/tablet layouts | **Executed** |
| Keyboard operation, focus handling, contrast (computed from rendered styles), console errors, offline behavior | **Executed** |
| Loading over HTTP under a project sub-path | **Executed** locally. **Not** a GitHub Pages deployment |
| Deck opens, validates, has notes on all slides | **Executed** |
| Browsers other than Chromium (Firefox, Safari) | **Not executed** |
| Real phones and tablets | **Not executed** |
| Screen readers (NVDA, VoiceOver, TalkBack) | **Not executed** |
| Playing the quiz click-to-reveal animation inside PowerPoint | **Not executed** (structure validated, static render checked) |
| Fresh `npm install` and `npm run build` on a networked machine; `npm run typecheck` | **Not executed** (no network or type packages in the build environment) |
| Deployment to GitHub Pages | **Not executed** |
| Native-speaker review of the Arabic text | **Not executed** |

## Playwright suite results

| ID | Area | Test | Expected | Actual | Result |
|---|---|---|---|---|---|
| NAV-01 | Navigation | Each of the 8 sidebar items opens its view | h1 matches the module and aria-current moves to the item | 8/8 views opened with correct heading | **PASS** |
| NAV-02 | Navigation | Dashboard buttons and queue buttons route correctly | Start training->Email lab; queue Start buttons->their lab; 'I think I clicked'->Incident guide | 6/6 dashboard buttons routed correctly | **PASS** |
| NAV-03 | Navigation | 'Next' buttons chain through the learning path | Email->Website->Social->Quiz; Social last->Quiz; hash updates | Next chain works; hash=#/.. | **PASS** |
| NAV-04 | Navigation | Deep link and hash change open the right view | Loading #/results shows Your results; changing hash to #/quiz switches view | deep link + hashchange OK | **PASS** |
| LANG-01 | Language | Switch EN->AR->EN updates lang, dir, title and nav labels | html lang/dir flip; labels translate; title translates | lang/dir/title/labels switch both ways | **PASS** |
| LANG-02 | Language | Language choice persists after reload | Arabic still active after page reload | persisted | **PASS** |
| LANG-03 | Language | Every view has an Arabic heading | 8 Arabic h1 values match | 8/8 Arabic headings | **PASS** |
| LANG-04 | Language | No untranslated English UI text in Arabic mode (all views, incl. feedback states) | Only brand names, acronyms, addresses and source titles remain Latin | no leftovers | **PASS** |
| RTL-01 | Arabic RTL | Layout mirrors: sidebar on the right, number nodes right of labels, text aligned right | rail.left > main.left; node.x > label.x; heading text-align resolves to right | mirrored correctly | **PASS** |
| RTL-02 | Arabic RTL | Addresses/emails stay left-to-right inside Arabic text; arrows flip | bdi.ltr computed direction ltr; .ic.flip has scaleX(-1) | ltr spans=3, arrow mirrored | **PASS** |
| RTL-03 | Arabic RTL | Arabic mode has no horizontal overflow on any view (desktop and mobile) | scrollWidth <= viewport width on 8 views x 2 viewports | no overflow | **PASS** |
| EMAIL-01 | Email lab | Clicking each suspicious element marks it found, explains it and updates the counter/meter | Per email 4/4/3 found; badge 'Warning sign'; meter aria-valuenow = %; ledger shows titles | 11/11 found; per-email completion shown | **PASS** |
| EMAIL-02 | Email lab | Normal elements are labelled 'Not a warning sign' and do not count; repeat clicks do not double count | found stays same; neutral explained; double click no change | neutral not counted; no double count | **PASS** |
| EMAIL-03 | Email lab | Switching email resets selection; restart clears the lab; link/attachment elements are clickable | prompt shown after tab switch; Restart->0/11 | OK | **PASS** |
| EMAIL-04 | Email lab | Arabic explanations are shown in Arabic | explanation heading contains Arabic letters | OK | **PASS** |
| WEB-01 | Website lab | Correct answers for all 5 rounds are accepted and scored 5/5 | 'Correct' badge each round; sidebar 5/5; 'Correct on first try: 5 of 5' | 5/5 | **PASS** |
| WEB-02 | Website lab | Wrong answers are rejected with explanation (wrong segment; 'genuine' on a fake; segment on a genuine) | 'Not quite' badge, culprit revealed, tally excludes them | 3/3 wrong answers rejected | **PASS** |
| WEB-03 | Website lab | Answers lock after the first attempt (no score farming) | Segments disabled; a second click cannot change result | locked | **PASS** |
| WEB-04 | Website lab | Restart lab clears results | After 5 answers, Restart resets to 0/5 | OK | **PASS** |
| SOC-01 | Social engineering | All 9 decisions give the right severity, points and consequence | unsafe 0/2, partial 1/2, safe 2/2; outcome+lesson shown; options lock | 9/9 decisions correct | **PASS** |
| SOC-02 | Social engineering | Social progress tracks completion and restart clears it | 3/3 after all scenarios; restart -> 0/3 | OK | **PASS** |
| QUIZ-01 | Quiz | Immediate feedback: correct answer highlighted, wrong pick flagged, explanation shown, options lock | Correct->'Correct'; Wrong->'Not quite' + correct option marked; Next only after answering | feedback correct | **PASS** |
| QUIZ-02 | Quiz | Scoring: all-correct=5/5, all-wrong=0/5, mixed=exact count, recap marks per question | Score matches answers | 5/5, 0/5, 3/5 verified | **PASS** |
| QUIZ-03 | Quiz | Verdict wording matches score band | 5/5 and 3/5 and 0/5 show different verdicts | 3 distinct verdicts | **PASS** |
| QUIZ-04 | Retake | Retake clears answers, returns to Q1, and resets sidebar/results | Question 1 of 5; sidebar 0/5; results quiz 0/5; can score again | retake works and rescored | **PASS** |
| QUIZ-05 | Quiz | Leaving mid-quiz and returning resumes at the next unanswered question | After 2 answers, returning shows Question 3 of 5 | resumed | **PASS** |
| RES-01 | Final score | Perfect run via the UI = 100% and 'Excellent' | 100 + verdict | 100% | **PASS** |
| RES-02 | Final score | Mixed run matches the formula (email 11/11, web 4/5, social 5/6, quiz 3/5 => 81%) | (1+0.8+0.8333+0.6)/4 = 81% | 81% with per-skill 11/11, 4/5, 5/6, 3/5 | **PASS** |
| RES-03 | Final score | Partial progress: only emails done = 25%, labelled in-progress, others 'Not started' | 25 + In progress + 3 'Not started' | 25% | **PASS** |
| RES-04 | Final score | Reset all progress: Cancel keeps data, OK clears everything | dialog dismiss -> unchanged; accept -> 0%, labs 0 | OK | **PASS** |
| PERSIST-01 | Reset on refresh | Refreshing the page resets ALL progress to zero (sidebar stats, Overall progress, results) | After finishing the quiz + emails then reload: every sidebar stat 0, Overall progress 0%, results 0% | everything back to 0 after reload | **PASS** |
| PERSIST-02 | Reset on refresh | Only the language is stored; old saved progress from the previous version is ignored | localStorage holds {lang} only; seeded old progress does not load | stored = lang only | **PASS** |
| PERSIST-03 | Reset on refresh | Language choice still survives a refresh while progress resets | Arabic stays after reload; progress 0 | language kept, progress reset | **PASS** |
| INC-01 | Incident guide | Four situations switch; checklist toggles, counts and persists per step | chips change steps; checking updates counter/meter; unchecking reverts | OK, steps=4,3,4,3 | **PASS** |
| REF-01 | References | 11 reference links, https, open in new tab with noopener | 11 anchors https target=_blank rel contains noopener | 11 links OK | **PASS** |
| SEC-01 | Privacy/security | No text/password/credential inputs on any view; no forms | Only checkbox inputs (incident guide); 0 <form> | no credential inputs | **PASS** |
| DOM-01 | Privacy/security | All example domains end in .test or .invalid (outside the References page) | No other TLD in lab/scenario/quiz text, EN and AR | 13 hosts checked, all .test/.invalid (or file names) | **PASS** |
| RESP-01 | Responsive desktop | Desktop 1440/1024: persistent sidebar visible, top bar hidden, no overflow on any view | rail x=0 width~288; .topbar display none | OK at 1440 and 1024 | **PASS** |
| RESP-02 | Responsive mobile | Tablet 768 / phone 390 / small phone 360: top bar shown, sidebar hidden, no overflow in EN or AR | scrollWidth<=width on 8 views; rail off-screen | 6 viewport/lang combos x 8 views, no overflow | **PASS** |
| RESP-03 | Responsive mobile | Mobile menu: opens, navigates and closes; scrim closes; language switch works in top bar | aria-expanded toggles; item click navigates+closes; scrim click closes | OK | **PASS** |
| RESP-04 | Responsive mobile | Touch targets: primary controls >= 44px tall on mobile; others >= 24px | btn/opt/tab/chip/iconbtn/navitem >=44; dots/small btn >=24 | all targets large enough | **PASS** |
| KEY-01 | Keyboard | Skip link is first Tab stop and moves focus to main content | first Tab -> 'Skip to content'; Enter -> activeElement#main | OK | **PASS** |
| KEY-02 | Keyboard | Sidebar can be operated by keyboard and shows a visible focus ring | focus nav item, Enter navigates, outline visible (>=2px, not none) | ring 2px | **PASS** |
| KEY-03 | Keyboard | Email hotspots work with Enter/Space and keep focus after activation | Enter marks found; activeElement stays on the same hotspot | OK | **PASS** |
| KEY-04 | Keyboard | Language buttons keep focus after toggling by keyboard | Enter on العربية: activeElement is still a language button; aria-pressed updates | OK | **PASS** |
| KEY-05 | Keyboard | Website lab, social and quiz can be completed using only the keyboard | Enter selects; feedback appears | OK | **PASS** |
| KEY-06 | Keyboard | Mobile: hidden sidebar is not reachable by Tab while closed; Escape closes the open menu | 20 Tab presses never land off-screen; Esc closes | OK | **PASS** |
| KEY-07 | Keyboard | Focus moves to the new view after navigation (screen reader / keyboard users) | After choosing a nav item, activeElement is main or inside main | OK | **PASS** |
| A11Y-01 | Accessibility | Landmarks, single h1, named controls, aria-live feedback, progressbar semantics | main/nav/aside present; 1 h1 per view; every button/link has an accessible name; live regions exist | OK | **PASS** |
| A11Y-02 | Accessibility | Text contrast >= 4.5:1 (3:1 for large text) across views and feedback states | 0 failing text elements (disabled controls exempt) | no contrast failures | **PASS** |
| OFF-01 | Offline | Standalone file contains no external references (scripts, styles, fonts, images, imports) | no <script src>, <link href>, @import, url(http), src=http | self-contained, 330 KB, CSP present | **PASS** |
| OFF-02 | Offline | Full journey works with the network disabled and every http(s) request aborted | 0 outbound requests, 0 failed requests, all views and interactions work | journey + AR + reload OK offline, 0 outbound requests | **PASS** |
| OFF-03 | Offline | CSP blocks network calls from the page (fetch/XHR/image beacons) | fetch('https://example.com') rejects | fetch blocked by CSP | **PASS** |
| CON-01 | Console | No console errors/warnings or uncaught exceptions during the whole suite (EN, AR, desktop, mobile, offline) | 0 issues | 0 console issues, 0 external requests | **PASS** |

## Local HTTP smoke test

The repository was served by a local Node HTTP server under `/phishing-awareness-training/` to mimic a GitHub Pages project URL. This verifies that nothing depends on a local path. It is not a deployment.

| Test | Result | Detail |
|---|---|---|
| Loads over HTTP from a project sub-path | **PASS** | HTTP 200 |
| No additional files or external hosts requested (relative paths not needed) | **PASS** | only index.html was requested |
| All 8 views open | **PASS** | 8 views |
| Language switch to Arabic sets RTL | **PASS** | dir=rtl |
| Quiz answer gives feedback | **PASS** | Correct badge shown for the right answer |
| No console errors or warnings | **PASS** | 0 issues |

## Deck-versus-module checks

| Check | Result | Detail |
|---|---|---|
| Palette: 6 core colors in deck theme and HTML CSS | **PASS** | missing in deck=[] html=[] |
| Typography: deck theme font equals first HTML font | **PASS** | deck={'Calibri'} html-first=Calibri |
| Quiz parity: 5 questions, options and correct answers identical in deck and HTML | **PASS** | 5/5 identical |
| Arabic speaker notes: all 18 slides present, >=300 chars, mostly Arabic | **PASS** | 18/18 complete |
| No placeholder text (deck text, notes, alt text, HTML source) | **PASS** | none found |
| Reference lists identical (deck hyperlinks vs HTML references) | **PASS** | deck=11 html=11 only_deck=[] only_html=[] |
| Key statistics present in both (84%, 13%, $120M, 60 months) | **PASS** | consistent |
| Corrected claims: no unsupported wording remains | **PASS** | none |
| Deck example domains use only .test/.invalid (real reporting/source names excluded) | **PASS** | example domains=['nile-logistics-it.invalid', 'nilelogistics.test'] unexpected=[] |

## PowerPoint file checks

| Check | Result |
|---|---|
| Opens with python-pptx: 18 slides, notes longer than 300 characters on all 18, 11 hyperlinks | **PASS** |
| Structural validation with the PPTX validator (`validate.py`) | **PASS** ("All validations PASSED") |
| Converts to PDF with LibreOffice (18 pages, 1280x720 renders) | **PASS** |
| Visual review of slides for overflow, alignment and readability | **PASS** (done on renders in earlier phases and again on every slide changed in the final review). These are LibreOffice renders, not PowerPoint |

## Repository hygiene checks (this phase)

| Check | Result |
|---|---|
| Relative links and image paths in all Markdown files resolve to existing files; anchors exist | **PASS** (re-run after this report was generated) |
| README images exist; screenshots are real captures (desktop 1440x900, phone 390x844 at 2x, slides 1280x720) | **PASS** |
| Secret-pattern scan (API keys, tokens, private keys, passwords) | **PASS**: no secrets found. Two keyword hits were the words "secrets" in a `.gitignore` comment and in a prompt description |
| Local absolute paths in repository files and in the bundle | **PASS**: none |
| Personal data | **PASS**: the only e-mail addresses are fictional (`.test`, `.invalid`) and the public reporting address `reportphishing@apwg.org`. The only personal-looking name is the fictional vendor contact "Hana Mostafa" in the sample email (consider replacing it) |
| Empty folders, temp files, logs, `node_modules`, `dist` | **PASS**: none present |
| Large files | **PASS**: no file is larger than 1 MB |

## History of defects found and fixed (earlier phases, all re-tested)

The Playwright suite was run four times during development (36 of 52 passed at first; 54 of 54 at the end). Nine product bugs and seven test-script mistakes were found and fixed:

| Test | Type | Problem and fix |
|---|---|---|
| KEY-03 | Product | Email hotspot buttons were re-created on each click, dropping keyboard focus. Moved to a stable component |
| KEY-04 | Product | The language switch was re-created on each render, dropping focus. Moved out of the app component |
| KEY-06 | Product | The closed mobile sidebar was reachable with Tab. It is now hidden when closed, and Escape closes the open menu |
| KEY-07 | Product | Focus stayed on the sidebar after navigation. Focus now moves to the main content |
| RESP-02 | Product | The sidebar swept across the screen when switching language on phones and tablets. Transitions are suspended during a language switch |
| EMAIL-03 | Product | A stale explanation flashed when switching emails. Selection now clears immediately |
| LANG-04 | Product | Answer labels were Latin A to D in Arabic mode. They are now Arabic letters |
| DOM-01 | Product | A developer file path was shown to learners in the incident guide. Replaced by plain text and an optional contact setting |
| A11Y-02 | Product | Text on blue buttons was 4.39:1 and 3.98:1. Darkened to above 4.5:1 |
| RTL-03, EMAIL-01, RES-01 to RES-04, OFF-02 | Test script | Wrong selector for the email link button and an undefined variable. The script was corrected; no product change |
| PERSIST tests | Requirement change | Progress now resets on refresh; the tests were rewritten |

In the final content review, several statements that the sources do not support were corrected in both deliverables (see [REFERENCES.md](REFERENCES.md#corrections-made-during-review)), and the full suite was re-run on the final file.

## Unresolved issues and limitations

| # | Issue | Severity | Note |
|---|---|---|---|
| 1 | The primary FBI IC3 2025 report was not opened; figures come from press coverage | Medium | Confirm at ic3.gov before presenting |
| 2 | The quiz animation was not played in PowerPoint | Medium | Open slide 13 in slideshow mode and confirm one click reveals the answer |
| 3 | Only Chromium was tested; no real devices or screen readers | Medium | Test Firefox, Safari and a phone before wide release |
| 4 | A fresh `npm install` and `npm run typecheck` have not been run | Medium | The build was verified with a pre-installed toolchain |
| 5 | Arabic text has not had a native-speaker review | Medium | Wording, not layout, is unverified |
| 6 | On a 390 px phone, in the dashboard's "Try it" sample message, the closing `>` of the sender address wraps onto its own line | Low (cosmetic) | Seen in the screenshot `07-mobile-dashboard-en.png`; not covered by a test and not changed, because the tested build was kept as is |
| 7 | The bundle does not carry the license comments of React; license texts are in `THIRD_PARTY_NOTICES.md` | Low | Decide whether to rebuild with `legalComments: "eof"` and rerun the tests |
| 8 | Font Awesome icons in the deck need CC BY 4.0 attribution, which is not yet on a slide | Low | See `THIRD_PARTY_NOTICES.md` |
| 9 | No project license chosen | Decision needed | See the README |
| 10 | The deck generator script is not in the repository because it depends on a local helper that is not available outside the build environment | Low | Edit the `.pptx` directly |
| 11 | Slide screenshots are LibreOffice renders, so fonts and spacing can differ slightly from PowerPoint | Low | |
