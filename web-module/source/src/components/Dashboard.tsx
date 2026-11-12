import { useState } from "react";
import { useApp, scores, Route } from "../state";
import { Icon, Meter, Ltr } from "./ui";

export default function Dashboard() {
  const { t, go, progress } = useApp();
  const sc = scores(progress);
  const [tried, setTried] = useState<null | "sender" | "other">(null);
  const rows: { r: Route; en: string; ar: string; dEn: string; dAr: string; s: { done: number; total: number; complete: boolean } }[] = [
    { r: "email", en: "Inspect three emails", ar: "افحص ثلاث رسائل بريد", dEn: "Find the warning signs hidden in realistic messages.", dAr: "اكتشف علامات التحذير المخفية في رسائل واقعية.", s: sc.email },
    { r: "web", en: "Read five web addresses", ar: "اقرأ خمسة عناوين مواقع", dEn: "Spot the lookalike domain, and the genuine one.", dAr: "اكتشف النطاق المزيّف وكذلك النطاق الحقيقي.", s: sc.web },
    { r: "social", en: "Handle three live situations", ar: "تعامل مع ثلاثة مواقف حيّة", dEn: "A call, a text and a chat. Choose, then see the consequence.", dAr: "مكالمة ورسالة نصية ومحادثة. اختر ثم شاهد النتيجة.", s: sc.social },
    { r: "quiz", en: "Check what stuck", ar: "اختبر ما ترسّخ لديك", dEn: "Five questions with instant feedback.", dAr: "خمسة أسئلة مع تغذية راجعة فورية.", s: sc.quiz },
  ];
  const next = rows.find((x) => !x.s.complete);
  return (
    <div className="view">
      <section className="hero">
        <div className="hero-text">
          <p className="kicker">{t("Security awareness training", "تدريب التوعية الأمنية")}</p>
          <h1>{t("Learn to read a message the way an analyst does.", "تعلّم أن تقرأ الرسالة كما يقرؤها محلّل أمني.")}</h1>
          <p className="lede">{t("Fictional messages, real habits. About 20 minutes. Everything runs on your device, and nothing is collected.", "رسائل خيالية وعادات حقيقية. نحو 20 دقيقة. كل شيء يعمل على جهازك ولا يُجمع أي شيء.")}</p>
          <div className="actions">
            {next ? <button className="btn primary" onClick={() => go(next.r)}>{next.s.done ? t("Continue training", "تابع التدريب") : t("Start training", "ابدأ التدريب")}<Icon n="arrow" flip /></button>
              : <button className="btn primary" onClick={() => go("results")}>{t("See your results", "اطّلع على نتيجتك")}<Icon n="arrow" flip /></button>}
            <button className="btn" onClick={() => go("incident")}>{t("I think I clicked something", "أظن أنني نقرت على شيء")}</button>
          </div>
        </div>
        <div className="hero-demo" aria-labelledby="try">
          <p id="try" className="demo-cap">{t("Try it: tap the part of this message that looks wrong.", "جرّب: انقر على الجزء الذي يبدو خاطئًا في هذه الرسالة.")}</p>
          <div className="mail mini"><div className="mhead">
            <div className="mrow"><span className="mk">{t("From", "من")}</span>
              <span>{t("Payroll Desk", "قسم الرواتب")} <Ltr>&lt;<button className={"hot" + (tried === "sender" ? " found" : "")} onClick={() => setTried("sender")}>payroll@nile-logistics-pay.invalid</button>&gt;</Ltr></span></div>
            <div className="mrow"><span className="mk">{t("Subject", "الموضوع")}</span>
              <button className="hot plain" onClick={() => setTried("other")}>{t("Confirm your direct-deposit details", "أكّد بيانات الإيداع المباشر الخاصة بك")}</button></div>
          </div></div>
          <div className="demo-fb" aria-live="polite">
            {tried === null && <p className="muted">{t("Your company's real domain is nilelogistics.test.", "نطاق شركتك الحقيقي هو nilelogistics.test.")}</p>}
            {tried === "sender" && <p><Icon n="flag" size={16} /> {t("That's it. The domain doesn't match nilelogistics.test. This is how every lab works: tap, then read why.", "أحسنت. النطاق لا يطابق nilelogistics.test. هكذا تعمل كل المختبرات: انقر ثم اقرأ السبب.")}</p>}
            {tried === "other" && <p>{t("Not quite. The subject is just the bait. Look at who actually sent it.", "ليس تمامًا. الموضوع مجرد طُعم. انظر إلى المرسل الفعلي.")}</p>}
          </div>
        </div>
      </section>

      <div className="grid2">
        <section className="panel">
          <h2>{t("Your triage queue", "قائمة مهامك")}</h2>
          <ol className="queue">
            {rows.map((x, i) => (
              <li key={x.r} className={x.s.complete ? "done" : ""}>
                <span className="qn">{x.s.complete ? <Icon n="check" size={16} /> : i + 1}</span>
                <div className="qb"><b>{t(x.en, x.ar)}</b><span>{t(x.dEn, x.dAr)}</span>
                  <Meter value={x.s.total ? x.s.done / x.s.total : 0} label={t(x.en, x.ar)} /></div>
                <button className="btn sm" onClick={() => go(x.r)}>{x.s.complete ? t("Review", "مراجعة") : x.s.done ? t("Continue", "متابعة") : t("Start", "ابدأ")}</button>
              </li>
            ))}
          </ol>
        </section>
        <section className="panel brief">
          <h2>{t("Threat brief", "موجز التهديد")}</h2>
          <p>{t("In CISA's phishing assessments, 84% of employees took the bait within the first 10 minutes of receiving a malicious email.", "في تقييمات CISA للتصيّد، وقع 84% من الموظفين في الفخ خلال أول 10 دقائق من وصول رسالة خبيثة.")}</p>
          <p>{t("Only 13% of the employees who were targeted reported it.", "ولم يُبلّغ سوى 13% من الموظفين المستهدفين.")}</p>
          <p className="take"><Icon n="shield" size={18} /> {t("Two habits matter most: pause before you act, and report fast.", "عادتان هما الأهم: توقّف قبل التصرف، وأبلِغ بسرعة.")}</p>
          <p className="src">{t("Source: CISA Phishing Infographic", "المصدر: إنفوغرافيك CISA عن التصيّد")}</p>
        </section>
      </div>
    </div>
  );
}
