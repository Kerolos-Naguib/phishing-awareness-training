import { useEffect, useRef } from "react";
import { useApp, ROUTES, Route, scores } from "./state";
import { Icon, Meter } from "./components/ui";
import Dashboard from "./components/Dashboard";
import EmailLab from "./components/EmailLab";
import WebLab from "./components/WebLab";
import Social from "./components/Social";
import Quiz from "./components/Quiz";
import Incident from "./components/Incident";
import Results from "./components/Results";
import References from "./components/References";

const NAV: Record<Route, { en: string; ar: string; icon: Parameters<typeof Icon>[0]["n"] }> = {
  dashboard: { en: "Dashboard", ar: "لوحة المتابعة", icon: "home" },
  email: { en: "Email inspection lab", ar: "مختبر فحص البريد", icon: "mail" },
  web: { en: "Fake website detection", ar: "كشف المواقع المزيفة", icon: "globe" },
  social: { en: "Social engineering simulation", ar: "محاكاة الهندسة الاجتماعية", icon: "chat" },
  quiz: { en: "Knowledge quiz", ar: "اختبار المعرفة", icon: "quiz" },
  incident: { en: "Incident response guide", ar: "دليل الاستجابة للحوادث", icon: "aid" },
  results: { en: "Final score and results", ar: "النتيجة النهائية", icon: "chart" },
  references: { en: "References", ar: "المراجع", icon: "book" },
};

export default function App() {
  const { lang, setLang, t, route, go, progress, menu, setMenu } = useApp();
  const sc = scores(progress);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } document.getElementById("main")?.focus({ preventScroll: true }); }, [route]);
  useEffect(() => {
    if (!menu) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(false); (document.querySelector(".iconbtn") as HTMLElement | null)?.focus(); } };
    document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k);
  }, [menu, setMenu]);
  const status = (r: Route): { text: string; done: boolean } => {
    switch (r) {
      case "email": return { text: `${sc.email.done}/${sc.email.total}`, done: sc.email.complete };
      case "web": return { text: `${sc.web.done}/${sc.web.total}`, done: sc.web.complete };
      case "social": return { text: `${sc.social.done}/${sc.social.total}`, done: sc.social.complete };
      case "quiz": return { text: `${sc.quiz.done}/${sc.quiz.total}`, done: sc.quiz.complete };
      case "results": return { text: Math.round(sc.overall * 100) + "%", done: sc.email.complete && sc.web.complete && sc.social.complete && sc.quiz.complete };
      default: return { text: "", done: false };
    }
  };
  const View = { dashboard: Dashboard, email: EmailLab, web: WebLab, social: Social, quiz: Quiz, incident: Incident, results: Results, references: References }[route];
  return (
    <div className="app">
      <a className="skip" href="#main">{t("Skip to content", "تخطَّ إلى المحتوى")}</a>
      <header className="topbar">
        <button className="iconbtn" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="rail" aria-label={t("Menu", "القائمة")}><Icon n={menu ? "close" : "menu"} /></button>
        <span className="brand-sm"><Icon n="shield" /> Code Alpha</span>
        <LangSwitch />
      </header>
      <aside id="rail" className={"rail" + (menu ? " open" : "")}>
        <div className="brand">
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><path d="M17 3l12 4.5v8.7c0 7-4.8 11.4-12 14.3C9.8 27.600 5 23.200 5 16.200V7.500z" fill="none" stroke="#75A9B8" strokeWidth="1.6" /><path d="M17 11v9a3.300 3.300 0 11-3.300-3.300" fill="none" stroke="#E6EAF0" strokeWidth="1.8" strokeLinecap="round" /></svg>
          <div><b>Code Alpha</b><span>{t("Phishing awareness", "التوعية بالتصيّد")}</span></div>
        </div>
        <nav aria-label={t("Modules", "الوحدات")}>
          <ol>
            {ROUTES.map((r, i) => {
              const s = status(r);
              return (
                <li key={r}>
                  <button className={"navitem" + (route === r ? " on" : "") + (s.done ? " done" : "")} onClick={() => go(r)} aria-current={route === r ? "page" : undefined}>
                    <span className="node">{s.done ? <Icon n="check" size={14} /> : i + 1}</span>
                    <span className="nlabel">{t(NAV[r].en, NAV[r].ar)}</span>
                    {s.text && <span className="nstat">{s.text}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="railfoot">
          <LangSwitch />
          <div className="overall"><span>{t("Overall progress", "التقدّم الكلي")}</span><b>{Math.round(((sc.email.done / sc.email.total + sc.web.done / sc.web.total + sc.social.done / sc.social.total + sc.quiz.done / sc.quiz.total) / 4) * 100)}%</b></div>
          <Meter value={(sc.email.done / sc.email.total + sc.web.done / sc.web.total + sc.social.done / sc.social.total + sc.quiz.done / sc.quiz.total) / 4} label={t("Overall progress", "التقدّم الكلي")} />
          <p className="fine">{t("Works offline. Nothing you do here is sent anywhere.", "يعمل دون اتصال. لا يُرسَل أي شيء من نشاطك إلى أي جهة.")}</p>
        </div>
      </aside>
      {menu && <div className="scrim" onClick={() => setMenu(false)} />}
      <main id="main" tabIndex={-1} lang={lang}><View /></main>
    </div>
  );
}

function LangSwitch() {
  const { lang, setLang, t } = useApp();
  return (
    <div className="langsw" role="group" aria-label={t("Language", "اللغة")}>
      <button aria-pressed={lang === "en"} onClick={() => setLang("en")} lang="en">English</button>
      <button aria-pressed={lang === "ar"} onClick={() => setLang("ar")} lang="ar">العربية</button>
    </div>
  );
}
