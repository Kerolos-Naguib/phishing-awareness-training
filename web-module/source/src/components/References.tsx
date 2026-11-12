import { useApp } from "../state";
import { REFS } from "../data/references";
import { Ltr, PageHead } from "./ui";

export default function References() {
  const { t, tr } = useApp();
  return (
    <div className="view">
      <PageHead kicker={t("Module 8 · References", "الوحدة 8 · المراجع")} title={t("Sources", "المصادر")}
        lede={t("Statistics and guidance come from these public sources. Links open in your browser and need an internet connection.", "الإحصاءات والإرشادات مأخوذة من هذه المصادر العامة. تُفتح الروابط في المتصفح وتتطلب اتصالًا بالإنترنت.")} />
      <ol className="refs">
        {REFS.map((r) => <li key={r.url}>
          <span className="org">{r.org}</span>
          <a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a>
          <p>{tr(r.used)}</p>
          <small><Ltr>{r.shown ?? r.url}</Ltr></small>
        </li>)}
      </ol>
      <p className="fine pad">{t("All example organizations, people and addresses in this module are fictional.", "جميع المؤسسات والأشخاص والعناوين الواردة كأمثلة في هذه الوحدة خيالية.")}</p>
    </div>
  );
}
