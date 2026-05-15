"use client";

import { useState } from "react";
import type { Service, Language } from "@/types";
import { t } from "@/lib/i18n";
import { formatPrice } from "@/lib/booking-utils";
import { cn } from "@/lib/cn";

interface ServiceSelection {
  service: Service;
  durationMinutes: number;
  price: number;
}

interface ServiceSelectorProps {
  services: Service[];
  lang: Language;
  value: ServiceSelection | null;
  onChange: (selection: ServiceSelection) => void;
}

type CategoryKey =
  | "all"
  | "signatures"
  | "siam_touch"
  | "beauty"
  | "packages"
  | "membership";

export function ServiceSelector({
  services,
  lang,
  value,
  onChange,
}: ServiceSelectorProps) {
  const tr = t(lang);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");

  const categories: { key: CategoryKey; label: string }[] = [
    { key: "all", label: tr.allCategories },
    { key: "signatures", label: tr.categories.signatures },
    { key: "siam_touch", label: tr.categories.siam_touch },
    { key: "beauty", label: tr.categories.beauty },
    { key: "packages", label: tr.categories.packages },
  ];

  const filtered =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  function getName(s: Service) {
    if (lang === "th") return s.name_th;
    if (lang === "cn") return s.name_cn;
    return s.name_en;
  }

  function getDesc(s: Service) {
    if (lang === "th") return s.description_th;
    if (lang === "cn") return s.description_cn;
    return s.description_en;
  }

  return (
    <div>
      {/* Category filter — CI: clean horizontal pill-tabs */}
      <div className="flex gap-2 flex-wrap mb-6 pb-4 border-b border-brand-border">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              "px-4 py-1.5 text-[10px] font-semibold border transition-all tracking-widest uppercase",
              activeCategory === cat.key
                ? "bg-brand-terracotta text-cream-50 border-brand-terracotta"
                : "border-brand-border text-brand-light-brown hover:border-brand-brown hover:text-brand-brown bg-transparent"
            )}
            style={{ fontFamily: '"Josefin Sans", system-ui, sans-serif' }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services list */}
      <div className="space-y-3">
        {filtered.map((service) => {
          const isSelected = value?.service.id === service.id;

          return (
            <div
              key={service.id}
              className={cn(
                "p-4 cursor-pointer transition-all duration-200 border",
                isSelected
                  ? "border-brand-terracotta bg-cream-200"
                  : "border-brand-border bg-cream-50 hover:border-brand-brown"
              )}
            >
              {/* Service header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "font-semibold text-sm leading-snug tracking-wide",
                      isSelected ? "text-brand-terracotta" : "text-brand-dark"
                    )}
                    style={{ fontFamily: '"Josefin Sans", system-ui, sans-serif' }}
                  >
                    {getName(service)}
                  </h3>
                  <p className="text-xs text-brand-light-brown mt-1 leading-relaxed line-clamp-2">
                    {getDesc(service)}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 bg-brand-terracotta shrink-0 mt-0.5 flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Duration options */}
              <div className="flex flex-wrap gap-2 mt-3">
                {service.durations.map((dur) => {
                  const isActiveDur =
                    isSelected && value?.durationMinutes === dur.minutes;
                  return (
                    <button
                      key={dur.minutes}
                      type="button"
                      onClick={() =>
                        onChange({
                          service,
                          durationMinutes: dur.minutes,
                          price: dur.price,
                        })
                      }
                      className={cn(
                        "px-3 py-1.5 border text-[10px] font-semibold transition-all tracking-wider uppercase",
                        isActiveDur
                          ? "bg-brand-dark text-cream-50 border-brand-dark"
                          : "border-brand-border text-brand-brown hover:border-brand-dark bg-white"
                      )}
                      style={{ fontFamily: '"Josefin Sans", system-ui, sans-serif' }}
                    >
                      {dur.minutes} {tr.minutes} · {formatPrice(dur.price)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
