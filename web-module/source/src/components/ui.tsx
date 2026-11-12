import { ReactNode } from "react";

type IconName = "check" | "x" | "flag" | "mail" | "globe" | "chat" | "quiz" | "aid" | "chart" | "book" | "menu" | "arrow" | "retry" | "home" | "alert" | "lock" | "shield" | "close";
const P: Record<IconName, ReactNode> = {
  check: <path d="M4 12.5l5 5L20 6.5" />, x: <path d="M6 6l12 12M18 6L6 18" />, close: <path d="M6 6l12 12M18 6L6 18" />,
  flag: <path d="M6 21V4m0 0h11l-2 4 2 4H6" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></>,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  quiz: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 114 2c-.9.6-1.5 1-1.5 2.2M12 17h.01" /></>,
  aid: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" /></>,
  chart: <path d="M4 20V10m6 10V4m6 16v-7m4 7H3" />,
  book: <path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h11" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />, arrow: <path d="M5 12h14m-5-5l5 5-5 5" />,
  retry: <path d="M20 12a8 8 0 11-2.6-5.9M20 4v5h-5" />, home: <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />,
  alert: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18h.01" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 118 0v3" /></>,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
};
export function Icon({ n, flip, size = 20 }: { n: IconName; flip?: boolean; size?: number }) {
  return <svg className={"ic" + (flip ? " flip" : "")} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]}</svg>;
}
export const Ltr = ({ children, className }: { children: ReactNode; className?: string }) => <bdi dir="ltr" className={"ltr " + (className ?? "")}>{children}</bdi>;
export function Meter({ value, label, tone }: { value: number; label: string; tone?: "red" }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return <div className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={label}><i className={tone} style={{ width: pct + "%" }} /></div>;
}
export function PageHead({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return <header className="pagehead"><p className="kicker">{kicker}</p><h1>{title}</h1><p className="lede">{lede}</p></header>;
}
