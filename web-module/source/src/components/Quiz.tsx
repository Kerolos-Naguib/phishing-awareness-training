import { useApp, scores } from "../state";
import { QUIZ } from "../data/quiz";
import { Icon, PageHead } from "./ui";
import { useState } from "react";

export default function Quiz() {
  const { t, tr, lang, progress, dispatch, go } = useApp();
  const LET = lang === "ar" ? ["أ", "ب", "ج", "د"] : ["A", "B", "C", "D"];
  const answeredCount = Object.keys(progress.quiz).length;
  const [i, setI] = useState(Math.min(answeredCount, QUIZ.length - 1));
  const [showScore, setShowScore] = useState(answeredCount === QUIZ.length);
  const sc = scores(progress).quiz;
  const finished = sc.complete && showScore;
  const q = QUIZ[i];
  const ch = progress.quiz[q.id];
  if (finished) {
    const pct = Math.round(sc.pct * 100);
    return (
      <div className="view">
        <PageHead kicker={t("Module 5 · Knowledge quiz", "الوحدة 5 · اختبار المعرفة")} title={t("Quiz complete", "اكتمل الاختبار")} lede={t("Here is how you did on the five questions.", "هذه نتيجتك في الأسئلة الخمسة.")} />
        <section className="panel scorecard">
          <div className="big" aria-label={`${sc.ok}/${sc.total}`}><b>{sc.ok}</b><span>/ {sc.total}</span></div>
          <p className="verdict">{pct >= 80 ? t("Strong result. You're spotting what matters.", "نتيجة قوية. أنت تلتقط ما يهم.") : pct >= 60 ? t("Good start. Review the explanations below and try again.", "بداية جيدة. راجع الشروحات أدناه وحاول مجددًا.") : t("Worth another pass. The explanations below show where to focus.", "تستحق محاولة أخرى. الشروحات أدناه توضح أين تركّز.")}</p>
          <ul className="recap">
            {QUIZ.map((x, n) => { const ok = progress.quiz[x.id] === x.correct; return <li key={x.id} className={ok ? "ok" : "bad"}><span className="rm">{ok ? <Icon n="check" size={14} /> : <Icon n="x" size={14} />}</span><div><b>{n + 1}. {tr(x.q)}</b><p>{tr(x.why)}</p></div></li>; })}
          </ul>
          <div className="actions">
            <button className="btn primary" onClick={() => { dispatch({ type: "quiz-reset" }); setI(0); setShowScore(false); }}><Icon n="retry" size={16} /> {t("Retake the quiz", "أعد الاختبار")}</button>
            <button className="btn" onClick={() => go("incident")}>{t("Next: incident guide", "التالي: دليل الاستجابة")}</button>
          </div>
        </section>
      </div>
    );
  }
  return (
    <div className="view">
      <PageHead kicker={t("Module 5 · Knowledge quiz", "الوحدة 5 · اختبار المعرفة")} title={t("Check what stuck", "اختبر ما ترسّخ")} lede={t("Five questions. You get feedback right after each answer.", "خمسة أسئلة. ستحصل على تغذية راجعة بعد كل إجابة مباشرة.")} />
      <div className="steps">{QUIZ.map((x, n) => <span key={x.id} className={"dot static" + (n === i ? " on" : "") + (x.id in progress.quiz ? (progress.quiz[x.id] === x.correct ? " ok" : " bad") : "")}>{n + 1}</span>)}</div>
      <section className="panel qcard">
        <p className="chan">{t(`Question ${i + 1} of ${QUIZ.length}`, `السؤال ${i + 1} من ${QUIZ.length}`)}</p>
        <h2 className="q">{tr(q.q)}</h2>
        <div className="options" role="group">
          {q.opts.map((o, n) => {
            const state = ch === undefined ? "" : n === q.correct ? " right" : n === ch ? " wrongpick" : " dim";
            return <button key={n} className={"opt" + state} disabled={ch !== undefined} onClick={() => dispatch({ type: "quiz", id: q.id, choice: n })}>
              <span className="ol">{ch !== undefined && n === q.correct ? <Icon n="check" size={14} /> : ch === n ? <Icon n="x" size={14} /> : LET[n]}</span><span>{tr(o)}</span></button>;
          })}
        </div>
        <div className="explain" aria-live="polite">
          {ch !== undefined && <><span className={"badge " + (ch === q.correct ? "cyan" : "red")}>{ch === q.correct ? t("Correct", "صحيح") : t("Not quite", "ليس تمامًا")}</span><p>{tr(q.why)}</p></>}
        </div>
        {ch !== undefined && <div className="actions">
          {i < QUIZ.length - 1 ? <button className="btn primary" onClick={() => setI(i + 1)}>{t("Next question", "السؤال التالي")}<Icon n="arrow" flip /></button>
            : <button className="btn primary" onClick={() => setShowScore(true)}>{t("See your score", "اعرض نتيجتك")}<Icon n="arrow" flip /></button>}
        </div>}
      </section>
    </div>
  );
}
