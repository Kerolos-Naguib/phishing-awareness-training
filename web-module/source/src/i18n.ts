export type Lang = "en" | "ar";
export type L = { en: string; ar: string };
export const l = (en: string, ar: string): L => ({ en, ar });
