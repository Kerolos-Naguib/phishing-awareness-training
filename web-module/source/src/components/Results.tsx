import { useApp, scores } from "../state";
import { Icon, Ltr, Meter, PageHead } from "./ui";

export default function Results() {
  const { t, go, progress, dispatch } = useApp();
  const s = scores(progress);
  const rows = [
    { r: "email" as const, en: "Email inspection", ar: "فحص البريد", d: s.email.complete || s.email.done > 0, v: s.email.pct, txt: `${s.email.done}/${s.email.total}`, tipEn: "Review the sender domain and the request, not the logo.", tipAr: "راجع نطاق المرسل والطلب وليس الشعار." },
    { r: "web" as const, en: "Website detection", ar: "كشف المواقع", d: s.web.done > 0, v: s.web.pct, txt: `${s.web.ok}/${s.web.total}`, tipEn: "Read the address right to left up to the first single slash.", tipAr: "اقرأ العنوان من اليمين إلى اليسار حتى أول شرطة مائلة منفردة." },
    { r: "social" as const, en: "Social engineering", ar: "الهندسة الاجتماعية", d: s.social.done > 0, v: s.social.pct, txt: `${s.social.pts}/${s.social.total * 2}`, tipEn: "Hang up or step away, then verify through a channel you know.", tipAr: "أنهِ المكالمة أو ابتعد ثم تحقق عبر قناة تعرفها." },
    { r: "quiz" as const, en: "Knowledge quiz", ar: "اختبار المعرفة", d: s.quiz.done > 0, v: s.quiz.pct, txt: `${s.quiz.ok}/${s.quiz.total}`, tipEn: "Remember: speed and reporting matter most.", tipAr: "تذكّر: السرعة والإبلاغ هما الأهم." },
  ];
  const all = s.email.complete && s.web.complete && s.social.complete && s.quiz.complete;
  const pct = Math.round(s.overall * 100);
  return (
    <div className="view">
      <PageHead kicker={t("Module 7 · Final score and results", "الوحدة 7 · النتيجة النهائية")} title={t("Your results", "نتائجك")}
        lede={all ? t("You've completed every module. Here is your summary.", "أكملت جميع الوحدات. هذا ملخص نتائجك.") : t("Finish every module to see your final score. Partial results are shown below.", "أكمل جميع الوحدات لترى نتيجتك النهائية. تظهر أدناه النتائج الجزئية.")} />
      <section className="panel scorecard">
        <div className="big"><b>{pct}</b><span>%</span></div>
        <p className="verdict">{all ? (pct >= 80 ? t("Excellent. You pause, verify and report.", "ممتاز. أنت تتوقف وتتحقق وتبلّغ.") : pct >= 60 ? t("Solid. Revisit the modules where you scored lower.", "جيد. عاود الوحدات التي كانت نتيجتك فيها أقل.") : t("Keep practicing. Retry the labs and the quiz.", "واصل التدريب. أعد المختبرات والاختبار.")) : t("In progress", "قيد التقدم")}</p>
        <ul className="skills">
          {rows.map((r) => <li key={r.r}><div className="mtop"><b>{t(r.en, r.ar)}</b>{r.d ? <Ltr>{r.txt}</Ltr> : <span>{t("Not started", "لم يبدأ")}</span>}</div><Meter value={r.v} label={t(r.en, r.ar)} /><p className="fine">{t(r.tipEn, r.tipAr)}</p>
            <button className="link" onClick={() => go(r.r)}>{r.d ? t("Review", "مراجعة") : t("Start", "ابدأ")}</button></li>)}
        </ul>
        <div className="actions">
          <button className="btn" onClick={() => go("quiz")}><Icon n="retry" size={16} /> {t("Retake the quiz", "أعد الاختبار")}</button>
          <button className="btn" onClick={() => { if (confirm(t("Reset all progress on this device?", "إعادة ضبط كل التقدّم على هذا الجهاز؟"))) dispatch({ type: "reset" }); }}>{t("Reset all progress", "إعادة ضبط كل التقدّم")}</button>
        </div>
        <p className="fine">{t("Your results stay on this page only. Refreshing the page resets everything to zero. Nothing is sent anywhere.", "نتائجك تبقى في هذه الصفحة فقط. تحديث الصفحة يعيد كل شيء إلى الصفر. لا يُرسَل أي شيء إلى أي جهة.")}</p>
      </section>
    </div>
  );
}
