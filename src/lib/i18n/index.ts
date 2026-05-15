import { translations } from "./translations";
import type { Language } from "@/types";

export { translations };

export function t(lang: Language): (typeof translations)["en"] {
  return translations[lang] ?? translations.en;
}

export function getLanguageFromBrowser(): Language {
  if (typeof window === "undefined") return "en";
  const nav = navigator.language?.toLowerCase() ?? "";
  if (nav.startsWith("th")) return "th";
  if (nav.startsWith("zh") || nav.startsWith("cn")) return "cn";
  return "en";
}

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "cn", label: "中文", flag: "🇨🇳" },
];
