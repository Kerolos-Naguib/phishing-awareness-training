import { createContext, useContext, useEffect, useMemo, useReducer, useState, useCallback, ReactNode } from "react";
import type { Lang, L } from "./i18n";
import { EMAILS } from "./data/emails";
import { ROUNDS } from "./data/websites";
import { SCENARIOS } from "./data/social";
import { QUIZ } from "./data/quiz";

export type Route = "dashboard" | "email" | "web" | "social" | "quiz" | "incident" | "results" | "references";
export const ROUTES: Route[] = ["dashboard", "email", "web", "social", "quiz", "incident", "results", "references"];

export interface Progress {
  email: Record<string, { found: string[]; wrong: string[] }>;
  web: Record<string, boolean>;      // first-attempt correctness per round
  social: Record<string, number>;    // chosen option index per scenario
  quiz: Record<string, number>;      // chosen option per question
  ir: Record<string, boolean>;
}
const EMPTY: Progress = { email: {}, web: {}, social: {}, quiz: {}, ir: {} };

type Action =
  | { type: "email"; email: string; clue: string; suspicious: boolean }
  | { type: "web"; id: string; ok: boolean }
  | { type: "social"; id: string; choice: number }
  | { type: "quiz"; id: string; choice: number }
  | { type: "quiz-reset" } | { type: "web-reset" } | { type: "email-reset" } | { type: "social-reset" }
  | { type: "ir"; id: string } | { type: "reset" };

function reducer(s: Progress, a: Action): Progress {
  switch (a.type) {
    case "email": {
      const cur = s.email[a.email] ?? { found: [], wrong: [] };
      if (cur.found.includes(a.clue) || cur.wrong.includes(a.clue)) return s;
      const next = a.suspicious ? { ...cur, found: [...cur.found, a.clue] } : { ...cur, wrong: [...cur.wrong, a.clue] };
      return { ...s, email: { ...s.email, [a.email]: next } };
    }
    case "web": return a.id in s.web ? s : { ...s, web: { ...s.web, [a.id]: a.ok } };
    case "social": return a.id in s.social ? s : { ...s, social: { ...s.social, [a.id]: a.choice } };
    case "quiz": return a.id in s.quiz ? s : { ...s, quiz: { ...s.quiz, [a.id]: a.choice } };
    case "quiz-reset": return { ...s, quiz: {} };
    case "web-reset": return { ...s, web: {} };
    case "email-reset": return { ...s, email: {} };
    case "social-reset": return { ...s, social: {} };
    case "ir": return { ...s, ir: { ...s.ir, [a.id]: !s.ir[a.id] } };
    case "reset": return EMPTY;
  }
}

/** Scores: each is { done, total, pct } */
export function scores(p: Progress) {
  const eTotal = EMAILS.reduce((n, e) => n + e.clues.filter((c) => c.suspicious).length, 0);
  const eFound = EMAILS.reduce((n, e) => n + (p.email[e.id]?.found.length ?? 0), 0);
  const eWrong = EMAILS.reduce((n, e) => n + (p.email[e.id]?.wrong.length ?? 0), 0);
  const wDone = Object.keys(p.web).length, wOk = Object.values(p.web).filter(Boolean).length;
  const sDone = Object.keys(p.social).length;
  const sPts = SCENARIOS.reduce((n, sc) => n + (p.social[sc.id] !== undefined ? sc.options[p.social[sc.id]].points : 0), 0);
  const qDone = Object.keys(p.quiz).length;
  const qOk = QUIZ.reduce((n, q) => n + (p.quiz[q.id] === q.correct ? 1 : 0), 0);
  const emailPct = eTotal ? eFound / eTotal : 0;
  const webPct = ROUNDS.length ? wOk / ROUNDS.length : 0;
  const socialPct = SCENARIOS.length ? sPts / (SCENARIOS.length * 2) : 0;
  const quizPct = QUIZ.length ? qOk / QUIZ.length : 0;
  return {
    email: { done: eFound, total: eTotal, wrong: eWrong, pct: emailPct, complete: eFound === eTotal },
    web: { done: wDone, ok: wOk, total: ROUNDS.length, pct: webPct, complete: wDone === ROUNDS.length },
    social: { done: sDone, pts: sPts, total: SCENARIOS.length, pct: socialPct, complete: sDone === SCENARIOS.length },
    quiz: { done: qDone, ok: qOk, total: QUIZ.length, pct: quizPct, complete: qDone === QUIZ.length },
    overall: (emailPct + webPct + socialPct + quizPct) / 4,
  };
}

interface Ctx {
  lang: Lang; setLang: (l: Lang) => void;
  t: (en: string, ar: string) => string; tr: (x: L) => string;
  route: Route; go: (r: Route) => void;
  progress: Progress; dispatch: (a: Action) => void;
  menu: boolean; setMenu: (b: boolean) => void;
}
const C = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(C);

const KEY = "code-alpha-phishing-v1"; // stores ONLY the language preference. Progress is kept in memory and resets on every page refresh.
const load = (): { lang: Lang; progress: Progress } => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const j = JSON.parse(raw); return { lang: j.lang === "ar" ? "ar" : "en", progress: EMPTY }; } // any older saved progress is ignored
  } catch { /* storage unavailable: continue in memory */ }
  return { lang: (navigator.language || "").toLowerCase().startsWith("ar") ? "ar" : "en", progress: EMPTY };
};
const fromHash = (): Route => { const h = location.hash.replace("#/", "") as Route; return ROUTES.includes(h) ? h : "dashboard"; };

export function AppProvider({ children }: { children: ReactNode }) {
  const init = useMemo(load, []);
  const [lang, setLangRaw] = useState<Lang>(init.lang);
  const setLang = useCallback((l: Lang) => { const h = document.documentElement; h.classList.add("no-anim"); setLangRaw(l); requestAnimationFrame(() => requestAnimationFrame(() => h.classList.remove("no-anim"))); }, []);
  const [progress, dispatch] = useReducer(reducer, init.progress);
  const [route, setRoute] = useState<Route>(fromHash());
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = lang === "ar" ? "التدريب على التوعية بالتصيّد الاحتيالي · كود ألفا" : "Phishing Awareness Training · Code Alpha";
  }, [lang]);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ lang })); } catch { /* ignore */ } }, [lang]);
  useEffect(() => { const f = () => setRoute(fromHash()); window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
  const go = useCallback((r: Route) => { setMenu(false); try { location.hash = "#/" + r; } catch { /* ignore */ } setRoute(r); window.scrollTo({ top: 0 }); }, []);
  const t = useCallback((en: string, ar: string) => (lang === "ar" ? ar : en), [lang]);
  const tr = useCallback((x: L) => x[lang], [lang]);
  const value = useMemo(() => ({ lang, setLang, t, tr, route, go, progress, dispatch, menu, setMenu }), [lang, t, tr, route, go, progress, menu]);
  return <C.Provider value={value}>{children}</C.Provider>;
}
