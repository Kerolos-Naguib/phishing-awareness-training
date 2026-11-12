import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useApp } from "../state";
import { EMAILS, Email } from "../data/emails";
import { Icon, Ltr, Meter, PageHead } from "./ui";

interface HotCtx { found: string[]; wrong: string[]; sel: string | null; pick: (id: string) => void }
const HotC = createContext<HotCtx>({ found: [], wrong: [], sel: null, pick: () => {} });
function Hot({ id, children, block }: { id: string; children: React.ReactNode; block?: boolean }) {
  const { found, wrong, sel, pick } = useContext(HotC);
  const cls = "hot" + (found.includes(id) ? " found" : "") + (wrong.includes(id) ? " neutral" : "") + (sel === id ? " sel" : "") + (block ? " blk" : "");
  return <button className={cls} onClick={() => pick(id)} aria-pressed={sel === id}>{children}</button>;
}

export default function EmailLab() {
  const { t, tr, progress, dispatch, go } = useApp();
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const fb = useRef<HTMLDivElement>(null);
  const em: Email = EMAILS[idx];
  const prog = progress.email[em.id] ?? { found: [], wrong: [] };
  const suspicious = em.clues.filter((c) => c.suspicious);
  const complete = prog.found.length === suspicious.length;
  const totalFound = EMAILS.reduce((n, e) => n + (progress.email[e.id]?.found.length ?? 0), 0);
  const totalAll = EMAILS.reduce((n, e) => n + e.clues.filter((c) => c.suspicious).length, 0);
  useEffect(() => setSel(null), [idx]);

  const click = (clueId: string) => {
    const clue = em.clues.find((c) => c.id === clueId);
    if (!clue) return;
    dispatch({ type: "email", email: em.id, clue: clueId, suspicious: clue.suspicious });
    setSel(clueId);
    if (window.matchMedia("(max-width: 900px)").matches) setTimeout(() => fb.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 30);
  };
  const clue = sel ? em.clues.find((c) => c.id === sel) : null;

  return (
    <div className="view">
      <PageHead kicker={t("Module 2 · Email inspection lab", "الوحدة 2 · مختبر فحص البريد")} title={t("Inspect the message", "افحص الرسالة")}
        lede={t("Tap any part of the email you think is suspicious. Some elements are normal, and learning to tell the difference is the skill.", "انقر على أي جزء تراه مشبوهًا في الرسالة. بعض العناصر طبيعية، وتعلّم التمييز بينها هو المهارة المطلوبة.")} />
      <div className="tabs" role="tablist" aria-label={t("Emails", "الرسائل")}>
        {EMAILS.map((e, i) => {
          const f = progress.email[e.id]?.found.length ?? 0, n = e.clues.filter((c) => c.suspicious).length;
          return <button key={e.id} role="tab" aria-selected={i === idx} className={"tab" + (f === n ? " done" : "")} onClick={() => { setIdx(i); setSel(null); }}>
            <span className="tn">{f === n ? <Icon n="check" size={14} /> : i + 1}</span><span>{tr(e.title)}</span><em>{f}/{n}</em></button>;
        })}
      </div>
      <div className="lab">
        <HotC.Provider value={{ found: prog.found, wrong: prog.wrong, sel, pick: click }}>
        <section className="mail" aria-label={tr(em.title)}>
          <div className="mhead">
            <div className="mrow"><span className="mk">{t("From", "من")}</span><span>{tr(em.from.name)} <Ltr>&lt;<Hot id={em.from.clue}>{em.from.addr}</Hot>&gt;</Ltr></span></div>
            <div className="mrow"><span className="mk">{t("To", "إلى")}</span><Ltr>{em.to}</Ltr></div>
            {em.cc && <div className="mrow"><span className="mk">{t("Cc", "نسخة")}</span><span>{em.cc.name} <Ltr>&lt;{em.cc.addr}&gt;</Ltr></span></div>}
            <div className="mrow"><span className="mk">{t("Subject", "الموضوع")}</span><Hot id={em.subject.clue}><b>{tr(em.subject.t)}</b></Hot></div>
            <div className="mrow"><span className="mk">{t("Date", "التاريخ")}</span><Hot id={em.date.clue}>{tr(em.date.t)}</Hot></div>
          </div>
          <div className="mbody">
            {em.body.map((p, i) => <p key={i}>{p.map((s, j) => s.clue ? <Hot key={j} id={s.clue}>{tr(s.t)}</Hot> : <span key={j}>{tr(s.t)}</span>)}</p>)}
            {em.link && <p className="linkrow"><Hot id={em.link.clue} block><span className="fakebtn">{tr(em.link.label)}</span></Hot><small className="dest">{t("Link destination:", "وجهة الرابط:")} <Ltr>{em.link.url}</Ltr></small></p>}
            {em.attachment && <p><Hot id={em.attachment.clue}><Icon n="mail" size={16} /> <Ltr>{em.attachment.name}</Ltr></Hot></p>}
            <p className="sig"><Hot id={em.signature.clue}>{tr(em.signature.t)}</Hot></p>
          </div>
        </section>
        </HotC.Provider>

        <aside className="evidence" ref={fb}>
          <div className="meterbox">
            <div className="mtop"><b>{t("Warning signs found", "علامات التحذير المكتشفة")}</b><Ltr>{prog.found.length} / {suspicious.length}</Ltr></div>
            <Meter value={prog.found.length / suspicious.length} label={t("Warning signs found", "علامات التحذير المكتشفة")} />
          </div>
          <div className="explain" aria-live="polite">
            {!clue && <p className="muted">{t("Select something in the email to inspect it.", "اختر عنصرًا في الرسالة لفحصه.")}</p>}
            {clue && <>
              <span className={"badge " + (clue.suspicious ? "red" : "neutral")}>{clue.suspicious ? <><Icon n="flag" size={14} /> {t("Warning sign", "علامة تحذير")}</> : <>{t("Not a warning sign", "ليست علامة تحذير")}</>}</span>
              <h3>{tr(clue.title)}</h3><p>{tr(clue.why)}</p></>}
          </div>
          <ul className="ledger">
            {suspicious.map((c, i) => <li key={c.id} className={prog.found.includes(c.id) ? "got" : ""}>
              <span className="lm">{prog.found.includes(c.id) ? <Icon n="flag" size={14} /> : i + 1}</span>
              <span>{prog.found.includes(c.id) ? tr(c.title) : t("Hidden warning sign", "علامة تحذير مخفية")}</span></li>)}
          </ul>
          {complete && <div className="done-box"><Icon n="check" size={18} /><div><b>{t("Message cleared.", "تم تحليل الرسالة.")}</b><p>{t("In real life: don't click, report it to IT, then delete it.", "في الواقع: لا تنقر، أبلغ فريق تقنية المعلومات، ثم احذفها.")}</p></div></div>}
          <div className="actions">
            {idx < EMAILS.length - 1 ? <button className="btn primary" onClick={() => { setIdx(idx + 1); setSel(null); }}>{t("Next email", "الرسالة التالية")}<Icon n="arrow" flip /></button>
              : <button className="btn primary" onClick={() => go("web")}>{t("Next: websites", "التالي: المواقع")}<Icon n="arrow" flip /></button>}
          </div>
          <p className="fine">{t(`Lab total: ${totalFound} of ${totalAll} found.`, `إجمالي المختبر: ${totalFound} من ${totalAll}.`)} {prog.wrong.length > 0 && t(`Normal elements inspected here: ${prog.wrong.length}.`, `عناصر طبيعية فحصتها هنا: ${prog.wrong.length}.`)}</p>
        </aside>
      </div>
      <p className="fine pad"><button className="link" onClick={() => { dispatch({ type: "email-reset" }); setSel(null); }}>{t("Restart this lab", "إعادة هذا المختبر")}</button> · {t("All addresses are fictional (.test / .invalid).", "جميع العناوين خيالية (.test / .invalid).")}</p>
    </div>
  );
}
