import { useState } from "react";
import { useApp } from "../state";
import { SCENARIOS, REAL_CASE } from "../data/social";
import { Icon, PageHead } from "./ui";

export default function Social() {
  const { t, tr, lang, progress, dispatch, go } = useApp();
  const LET = lang === "ar" ? ["أ", "ب", "ج", "د"] : ["A", "B", "C", "D"];
  const [idx, setIdx] = useState(0);
  const sc = SCENARIOS[idx];
  const chosen = progress.social[sc.id];
  const opt = chosen !== undefined ? sc.options[chosen] : null;
  const tone = (s: string) => (s === "safe" ? "cyan" : s === "partial" ? "neutral" : "red");
  const label = (s: string) => (s === "safe" ? t("Safe choice", "اختيار آمن") : s === "partial" ? t("Partly safe", "آمن جزئيًا") : t("Risky choice", "اختيار محفوف بالمخاطر"));
  return (
    <div className="view">
      <PageHead kicker={t("Module 4 · Social engineering simulation", "الوحدة 4 · محاكاة الهندسة الاجتماعية")} title={t("What would you do?", "ماذا ستفعل؟")}
        lede={t("Attackers don't only use email. Choose how you respond, then see what happens next.", "المهاجمون لا يستخدمون البريد فقط. اختر كيف ستتصرف ثم شاهد ما يحدث بعد ذلك.")} />
      <div className="tabs" role="tablist">
        {SCENARIOS.map((s, i) => <button key={s.id} role="tab" aria-selected={i === idx} className={"tab" + (progress.social[s.id] !== undefined ? " done" : "")} onClick={() => setIdx(i)}>
          <span className="tn">{progress.social[s.id] !== undefined ? <Icon n="check" size={14} /> : i + 1}</span><span>{tr(s.title)}</span></button>)}
      </div>
      <div className="lab">
        <section className="panel">
          <p className="chan">{tr(sc.channel)}</p>
          <div className="thread">
            {sc.beats.map((b, i) => <div key={i} className={"bubble " + (b.kind ?? "")}><span className="who">{tr(b.who)}</span><p>{tr(b.say)}</p></div>)}
          </div>
          <h2 className="q">{tr(sc.question)}</h2>
          <div className="options" role="group">
            {sc.options.map((o, i) => {
              const cls = "opt" + (chosen === i ? " picked " + tone(o.severity) : "") + (chosen !== undefined && chosen !== i ? " dim" : "");
              return <button key={i} className={cls} disabled={chosen !== undefined} onClick={() => dispatch({ type: "social", id: sc.id, choice: i })}><span className="ol">{LET[i]}</span><span>{tr(o.text)}</span></button>;
            })}
          </div>
        </section>
        <aside className="evidence">
          <div className="explain" aria-live="polite">
            {!opt && <p className="muted">{t("Pick a response to see the consequence.", "اختر ردًّا لترى النتيجة.")}</p>}
            {opt && <>
              <span className={"badge " + tone(opt.severity)}>{opt.severity === "unsafe" ? <Icon n="alert" size={14} /> : <Icon n="check" size={14} />} {label(opt.severity)} · {opt.points}/2</span>
              <h3>{t("What happens", "ماذا يحدث")}</h3><p>{tr(opt.outcome)}</p>
              <h3>{t("The lesson", "الدرس")}</h3><p>{tr(opt.lesson)}</p>
              {sc.options.some((o) => o.severity === "safe") && opt.severity !== "safe" && <p className="best"><b>{t("Safest option: ", "الخيار الأكثر أمانًا: ")}</b>{tr(sc.options.find((o) => o.severity === "safe")!.text)}</p>}</>}
          </div>
          {opt && sc.realCase && <div className="case"><h3>{tr(REAL_CASE.title)}</h3><p>{tr(REAL_CASE.body)}</p></div>}
          {opt && <div className="actions">{idx < SCENARIOS.length - 1
            ? <button className="btn primary" onClick={() => setIdx(idx + 1)}>{t("Next scenario", "السيناريو التالي")}<Icon n="arrow" flip /></button>
            : <button className="btn primary" onClick={() => go("quiz")}>{t("Next: quiz", "التالي: الاختبار")}<Icon n="arrow" flip /></button>}</div>}
          {SCENARIOS.every((s) => progress.social[s.id] !== undefined) && <p className="fine"><button className="link" onClick={() => { dispatch({ type: "social-reset" }); setIdx(0); }}>{t("Restart this simulation", "إعادة هذه المحاكاة")}</button></p>}
        </aside>
      </div>
    </div>
  );
}
