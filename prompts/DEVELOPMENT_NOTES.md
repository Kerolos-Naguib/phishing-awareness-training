# Development notes

## How this project was developed

This project was developed in a single working session with an AI assistant (Claude, by Anthropic), directed by the project owner through a series of requests. The assistant wrote the content, the presentation generator script, the module source code and the test suite, and the project owner specified the requirements, chose the visual direction and reviewed the results. Anyone reusing this project should treat it as AI-assisted work: the facts were checked against sources (see `docs/REFERENCES.md`), but the Arabic text in particular should be reviewed by a native speaker.

## Prompts used, in order

The requests below are **condensed** from the original conversation; they are not verbatim. The Arabic request in step 7 is translated.

---

## 1. Content blueprint (no files)

> Before creating any files, act as a cybersecurity researcher and instructional designer. Prepare the complete content blueprint for my Code Alpha Phishing Awareness Training project: a 12-slide outline, detailed slide content, Arabic speaker notes for each slide, five interactive quiz questions, three realistic educational phishing scenarios, one verified real-world case study, credible references from CISA, FBI, FTC and NIST, and a structured learning path for the HTML module. Use verified and up-to-date sources. Do not invent statistics, incidents or references. Presentation language English; speaker notes Arabic; HTML module Arabic and English. Do not generate the PowerPoint or HTML files yet.

*Note: the blueprint had 12 slides; the final deck was expanded to 18 as requested in step 4.*

## 2. Visual identity: theme selection

> Use the theme-factory skill. Show me the available theme showcase. I want a professional cybersecurity identity for both the PowerPoint and the HTML module: dark navy/black background, cyan and blue accents, red for security warnings, white for readable text, modern professional typography. Recommend the Tech Innovation theme. After I select the theme, create a shared design system (palette with HEX codes, fonts, typography hierarchy, button/navigation styles, diagram/chart styles, consistency guidelines). Do not start development yet.

## 3. Visual identity: change of direction

> Change the visual direction. The Tech Innovation palette feels too bright, saturated and neon-heavy. Create a new identity called **Dark Professional Cybersecurity** with this palette: Deep Navy #101820 (primary background), Slate Navy #1B2838 (cards and secondary surfaces), Muted Blue #3B82A0 (primary accents), Soft Cyan #75A9B8 (secondary accents), Off White #E6EAF0 (main text), Muted Red #C65D63 (security warnings). Requirements: dark backgrounds throughout; no neon or glow; blue and cyan used sparingly; excellent contrast; subtle borders, clean spacing, elegant hierarchy; red only for suspicious indicators, alerts and warnings; an enterprise cybersecurity product, not a gaming interface. Before developing anything, generate a theme preview showing a presentation slide, an HTML dashboard and an interactive phishing email analysis screen, and wait for my approval.

## 4. PowerPoint presentation

> Use the create-deck skill. Create the PowerPoint using the approved content blueprint and design system. 18 professional slides; English slide content; detailed Arabic speaker notes; clear cybersecurity diagrams; professional email mockups; fake website identification examples; the real-world documented case study; five interactive audience quiz questions; references with clickable source URLs. Do not overcrowd the slides; each slide communicates one main idea; use visual illustrations; suitable for a 15 to 20 minute session. Save as `Phishing_Awareness_Training.pptx`. After creating it, review every slide for text overflow, alignment, readability and missing speaker notes.

*Tooling notes: built with pptxgenjs from a scripted deck; icons from react-icons; the click-to-reveal quiz animation was added by editing the slide XML after generation.*

## 5. Interactive learning module

> Use the frontend-design and web-artifacts-builder skills. Build a professional bilingual learning application with these sections: Dashboard; Email Inspection Lab; Fake Website Detection Lab; Social Engineering Simulation; Interactive Knowledge Quiz; Incident Response Guide; Final Score and Results; References. Email lab: fictional phishing emails, clickable suspicious elements, explanations, completion indicator. Website lab: fictional addresses, identify suspicious domains, explain the answer. Social engineering: realistic educational scenarios, choose a response, explain consequences. Quiz: five multiple-choice questions, immediate feedback, explanations, final score, retake. English and Arabic with complete RTL support and a functional language switcher. React and TypeScript, no backend, no credential collection, fictional domains ending in .test or .invalid, core functionality working offline, all assets bundled locally, one standalone HTML file plus the editable source project. Desktop and mobile. Avoid generic AI-generated dashboard layouts; make it feel like a professional cybersecurity training product.

*Tooling notes: the environment had no network access, so the Vite/Parcel/shadcn toolchain of web-artifacts-builder could not be installed. The app was bundled with esbuild into one HTML file instead. Design direction: an analyst-workstation concept (sequential triage queue, tap-to-inspect evidence ledger) rather than a card-grid dashboard.*

## 6. Quality assurance

> Use the webapp-testing skill to perform a complete QA review of the actual HTML application. Test navigation buttons, language switching, Arabic RTL layout, the email lab, the website lab, social engineering decisions, quiz scoring logic, correct and incorrect feedback, final score calculation, retake, responsive desktop and mobile layouts, keyboard accessibility, browser console errors and offline functionality. Use Playwright. Test the final standalone HTML file. Identify all bugs, fix them and rerun the failed tests. Provide a QA report with test name, expected result, actual result, pass/fail and fixes applied. Do not claim a feature works unless it was actually tested.

*Tooling note: no `webapp-testing` skill existed in the environment, so the Playwright suite was written directly.*

## 7. Requested change: reset on refresh

> (Translated from Arabic) Something bad is happening: the information stays saved permanently and I don't want that. As soon as I refresh the page, the Overall progress should return to zero so I can test myself again from scratch.

## 8. Final review and packaging

> Perform a final review of the entire Phishing Awareness Training project, covering both deliverables. Check that both use the same visual identity; the educational content is consistent; technical definitions are accurate; quiz questions match the training content; real-world examples are properly sourced; Arabic speaker notes are complete; no placeholder text remains; no broken source links exist; HTML functionality has passed testing. Create the final project structure (first as `Phishing_Awareness_Project/`, later reorganized as this repository), a ZIP package containing all deliverables, and a clear summary of the final files and any remaining limitations.

---

## 9. GitHub repository preparation

> Prepare the final GitHub repository: inspect the existing files first, treat them as the source of truth, create a professional structure with README, documentation, screenshots, tests, `.gitignore` and (only if rights are clear) a LICENSE; check for secrets; evaluate GitHub Pages compatibility; verify the final package; do not publish or push anything.

## Reusing these prompts

- Keep the **"do not invent statistics, incidents or references"** instruction. It made the later source check possible; it still turned up several wording problems (see `docs/REFERENCES.md`, "Corrections made in the final review").
- Ask for source verification **before** building the deck and module, not after.
- To change the palette, edit the six color values in `web-module/source/src/styles.css` (`:root`) and in the deck's theme.

## Engineering notes

- **Why one HTML file.** The module has to work offline and be easy to hand to learners, so everything is bundled into `web-module/index.html`. The editable React and TypeScript project is in `web-module/source/`.
- **Why esbuild.** The build environment had no network access, so the Vite and shadcn toolchain could not be installed. esbuild bundles React and the app code into one file.
- **Progress reset.** Progress is kept in memory on purpose; refreshing the page returns everything to zero. Only the language choice is stored (in `localStorage`).
- **Tests.** The Playwright suite was written directly (no `webapp-testing` skill was available) and is run against the built `index.html`, not the source.
- **Source checking.** Verifying claims against the live sources late in the project corrected several statements (listed in `docs/REFERENCES.md`). Verify sources before building, not after.
