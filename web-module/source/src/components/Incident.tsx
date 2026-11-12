import { useState } from "react";
import { useApp } from "../state";
import { SITUATIONS, ORG_CONTACT, ORG_CONTACT_DETAILS } from "../data/incident";
import { Icon, Ltr, Meter, PageHead } from "./ui";

export default function Incident() {
  const { t, tr, progress, dispatch } = useApp();
  const [id, setId] = useState(SITUATIONS[0].id);
  const s = SITUATIONS.find((x) => x.id === id)!;
  const done = s.steps.filter((x) => progress.ir[x.id]).length;
  return (
    <div className="view">
      <PageHead kicker={t("Module 6 · Incident response guide", "الوحدة 6 · دليل الاستجابة للحوادث")} title={t("If something went wrong", "إذا حدث خطأ")}
        lede={t("Mistakes happen. What matters is how fast you tell someone. Pick what happened and work through the steps.", "الأخطاء تحدث. المهم سرعة إبلاغك. اختر ما حدث وتابع الخطوات.")} />
      <div className="callout"><Icon n="alert" size={18} /><p><b>{t("Tell IT or security first.", "أبلِغ تقنية المعلومات أو الأمن أولًا.")}</b> {tr(ORG_CONTACT)} {tr(ORG_CONTACT_DETAILS) && <b className="ltr">{tr(ORG_CONTACT_DETAILS)}</b>}</p></div>
      <div className="chips" role="tablist">{SITUATIONS.map((x) => <button key={x.id} role="tab" aria-selected={x.id === id} className={"chip" + (x.id === id ? " on" : "")} onClick={() => setId(x.id)}>{tr(x.title)}</button>)}</div>
      <section className="panel">
        <div className="mtop"><h2>{tr(s.title)}</h2><Ltr>{done} / {s.steps.length}</Ltr></div>
        <Meter value={done / s.steps.length} label={tr(s.title)} />
        <ul className="checks">
          {s.steps.map((st, n) => <li key={st.id}><label className={progress.ir[st.id] ? "on" : ""}>
            <input type="checkbox" checked={!!progress.ir[st.id]} onChange={() => dispatch({ type: "ir", id: st.id })} />
            <span className="cb">{progress.ir[st.id] && <Icon n="check" size={14} />}</span>
            <span className="ct"><em>{n + 1}</em>{tr(st.text)}{st.src && <small className="srcb">{st.src}</small>}</span></label></li>)}
        </ul>
        <p className="fine">{t("Steps marked CISA, FTC or FBI follow those agencies' published guidance. Reporting channels differ by country.", "الخطوات الموسومة CISA أو FTC أو FBI تتبع إرشادات تلك الجهات المنشورة. تختلف قنوات الإبلاغ من بلد لآخر.")}</p>
      </section>
    </div>
  );
}
