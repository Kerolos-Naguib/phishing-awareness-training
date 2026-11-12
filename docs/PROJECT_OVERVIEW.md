# Project overview

## Purpose

Phishing is one of the most common ways attackers gain access to accounts and money, and it succeeds by exploiting trust and urgency rather than technical flaws. This project provides a compact, practical training that builds three habits: **stop** before acting on an unexpected request, **verify** through a channel you already trust, and **report** quickly.

It was developed as a cybersecurity-training portfolio project. It combines an instructor-led presentation with a self-paced interactive module so the same content can be delivered in a session or studied alone.

## Target audience

- Employees and general computer users who receive email, text messages and calls at work (the presentation is written for "every employee").
- Trainers and cybersecurity students who need ready material they can adapt.

No technical background is assumed.

## Learning objectives

1. Define phishing and its two main uses: obtaining login credentials and deploying malware.
2. Identify warning signs in emails, web addresses, phone calls, texts and chat messages.
3. Distinguish real warning signs from normal elements that only look suspicious.
4. Read a web address to find the real domain.
5. Apply Stop, Verify, Report.
6. Know the first steps after a mistake (clicked, opened an attachment, entered a password, paid).

## Main components

| Component | What it contains |
|---|---|
| Presentation (18 slides) | Why it matters; what phishing is; anatomy of a phish; email and website examples; why smart people click; a real case study; Stop-Verify-Report; incident response; layers of defense; five quiz slides; references. English slides, Arabic speaker notes, about 15 to 20 minutes |
| Interactive module | Dashboard; Email Inspection Lab (3 emails, 11 warning signs); Fake Website Detection (5 addresses); Social Engineering Simulation (3 scenarios); Quiz (5 questions); Incident Response Guide (4 situations); Final Score; References. English and Arabic with RTL |
| Documentation | Overview, references with verification status, QA report, design system, third-party notices |
| Tests | Playwright suite (54 tests), HTTP smoke test, deck-versus-module consistency checks, recorded results |

The two training deliverables share one visual identity (see [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)), the same fictional scenarios, the same five quiz questions and the same 11 references.

## Scope

**In scope:** awareness of phishing across email, web, phone, text and chat; a documented real-world business email compromise case; basic incident response steps for individual employees.

**Out of scope:** technical defenses for administrators (mail filtering, DMARC, SOC procedures), malware analysis, and legal guidance.

## Limitations

- **Sources.** The FBI IC3 2025 figures come from press coverage; the primary report was not opened. CISA's incident-response steps (audit account access, isolate the workstation) were confirmed through a secondary summary of the guide. Details in [REFERENCES.md](REFERENCES.md).
- **Geography.** Statistics and reporting channels are U.S.-based (FBI IC3, FTC). The module tells learners outside the U.S. to use their country's equivalent. No local channels are listed.
- **Simplified model.** The presentation shows a 2x2 simplification of NIST's 3x3 Phish Scale.
- **General practice points.** Some teaching points (second approver for payments, the `@` trick in web addresses, double file extensions, enabling content in documents) are standard awareness practice and not attributed to any agency source.
- **Testing scope.** Chromium only, emulated mobile, no screen reader testing, no PowerPoint playback test for the quiz animation. See [QA_REPORT.md](QA_REPORT.md).
- **Language.** Arabic text has not had a native-speaker review.
- **Progress is not stored.** The module intentionally resets on refresh and has no certificates or learner tracking.
- **Not a deployed service.** The repository has not been published to GitHub Pages.
