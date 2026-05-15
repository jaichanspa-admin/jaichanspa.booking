"use client";

import { LANGUAGES } from "@/lib/i18n";
import type { Language } from "@/types";
import { cn } from "@/lib/cn";

interface LanguageSwitcherProps {
  current: Language;
  onChange: (lang: Language) => void;
  className?: string;
}

export function LanguageSwitcher({
  current,
  onChange,
  className,
}: LanguageSwitcherProps) {
  return (
    <div
      className={cn("flex items-center gap-px border border-brand-border", className)}
    >
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => onChange(lang.code)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold transition-all duration-150 tracking-widest uppercase",
            current === lang.code
              ? "bg-brand-dark text-cream-50"
              : "bg-transparent text-brand-light-brown hover:text-brand-dark hover:bg-cream-200"
          )}
          style={{ fontFamily: '"Josefin Sans", system-ui, sans-serif' }}
        >
          <span className="text-xs">{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
