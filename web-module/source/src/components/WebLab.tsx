import { useState } from "react";
import { useApp } from "../state";
import { ROUNDS, KNOWN_DOMAIN } from "../data/websites";
import { Icon, Ltr, PageHead } from "./ui";

export default function WebLab() {
  const { t, tr, progress, dispatch, go } = useApp();
  const firstOpen = ROUNDS.findIndex((r) => !(r.id in progress.web));
  const [idx, setIdx] = useState(firstOpen === -1 ? 0 : firstOpen);
  const [picked, setPicked] = useState<number | "genuine" | null>(null);
  const r = ROUNDS[idx];
  const answered = r.id in progress.web || picked !== null;
  const answer = (choice: number | "genuine") => {
    if (answered) return;
    const ok = r.culprit === null ? choice === "genuine" : choice === r.culprit;
    setPicked(choice); dispatch({ type: "web", id: r.id, ok });
  };
  const ok = progress.web[r.id];
  const doneAll = ROUNDS.every((x) => x.id in progress.web);
  const next = () => { if (idx < ROUNDS.length - 1) { setIdx(idx + 1); setPicked(null); } else go("social"); };
  return (
    <div className="view">
      <PageHead kicker={t("Module 3 · Fake website detection", "الوحدة 3 · كشف المواقع المزيفة")} title={t("Read the address", "اقرأ العنوان")}
        lede={t(`Your bank's real domain is ${KNOWN_DOMAIN}. Tap the part of the address that gives the fake away, or confirm it's genuine.`, `النطاق الحقيقي لبنكك هو ${KNOWN_DOMAIN}. انقر على الجزء الذي يفضح الزيف في العنوان، أو أكّد أنه حقيقي.`)} />
      <div className="steps" aria-label={t("Progress", "التقدم")}>
        {ROUNDS.map((x, i) => <button key={x.id} className={"dot" + (i === idx ? " on" : "") + (x.id in progress.web ? (progress.web[x.id] ? " ok" : " bad") : "")} onClick={() => { setIdx(i); setPicked(null); }} aria-label={`${i + 1}`} aria-current={i === idx}>{i + 1}</button>)}
      </div>
      <div className="lab stack">
        <section className="panel">
          <p className="ctx">{tr(r.context)}</p>
          <div className="browser" role="group" aria-label={t("Browser window", "نافذة المتصفح")}>
            <div className="bbar"><i /><i /><i />
              <div className="url" dir="ltr">
                {r.segments.map((s, i) => {
                  const isPicked = picked === i || (answered && r.culprit === i);
                  const wrong = picked === i && r.culprit !== i;
                  return <button key={i} className={"seg" + (answered && r.culprit === i ? " cul" : "") + (wrong ? " wrong" : "") + (isPicked ? " sel" : "")} onClick={() => answer(i)} disabled={answered} aria-label={s}>{s}</button>;
                })}
              </div>
            </div>
            <div className="page" aria-hidden="true">
              <div className="logo"><Icon n="shield" size={28} /></div>
              <b>Delta Trust Bank</b>
              <div className="fld">{t("Email", "البريد الإلكتروني")}</div><div className="fld">{t("Password", "كلمة المرور")}</div>
              <div className="fbtn">{t("Sign in", "تسجيل الدخول")}</div>
            </div>
          </div>
          <p className="fine"><Icon n="lock" size={14} /> {t("Simulation only. This page has no inputs and nothing you do is collected.", "محاكاة فقط. هذه الصفحة لا تحتوي على حقول إدخال ولا يُجمع أي شيء مما تفعله.")}</p>
          {!answered && <div className="actions"><button className="btn" onClick={() => answer("genuine")}><Icon n="check" size={16} /> {t("This address is genuine", "هذا العنوان حقيقي")}</button></div>}
        </section>
        <aside className="evidence">
          <div className="explain" aria-live="polite">
            {!answered && <p className="muted">{t("Look at the whole address before you decide. Which part reveals where it really goes?", "انظر إلى العنوان كاملًا قبل أن تقرر. أي جزء يكشف الوجهة الحقيقية؟")}</p>}
            {answered && <>
              <span className={"badge " + (ok ? "cyan" : "red")}>{ok ? <><Icon n="check" size={14} /> {t("Correct", "صحيح")}</> : <><Icon n="x" size={14} /> {t("Not quite", "ليس تمامًا")}</>}</span>
              <h3>{tr(r.title)}</h3><p>{tr(r.explain)}</p>
              <p className="addr"><span>{r.culprit === null ? t("Verdict: genuine", "الحكم: حقيقي") : t("Verdict: suspicious", "الحكم: مشبوه")}</span> <Ltr>{r.segments.join("")}</Ltr></p></>}
          </div>
          {answered && <div className="actions"><button className="btn primary" onClick={next}>{idx < ROUNDS.length - 1 ? t("Next address", "العنوان التالي") : t("Next: social engineering", "التالي: الهندسة الاجتماعية")}<Icon n="arrow" flip /></button></div>}
          <p className="fine">{t(`Correct on first try: ${Object.values(progress.web).filter(Boolean).length} of ${ROUNDS.length}`, `صحيح من المحاولة الأولى: ${Object.values(progress.web).filter(Boolean).length} من ${ROUNDS.length}`)}</p>
          {doneAll && <p className="fine"><button className="link" onClick={() => { dispatch({ type: "web-reset" }); setIdx(0); setPicked(null); }}>{t("Restart this lab", "إعادة هذا المختبر")}</button></p>}
        </aside>
      </div>
    </div>
  );
}
