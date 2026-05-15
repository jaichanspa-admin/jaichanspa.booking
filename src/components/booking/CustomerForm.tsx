"use client";

import type { Language } from "@/types";
import { t } from "@/lib/i18n";
import { NATIONALITY_OPTIONS } from "@/data/services";
import { CheckCircle, Smartphone } from "lucide-react";

interface CustomerFormValues {
  firstName: string;
  lastName: string;
  nationality: string;
  phone: string;
}

interface CustomerFormProps {
  lang: Language;
  values: CustomerFormValues;
  errors: Partial<Record<keyof CustomerFormValues, string>>;
  onChange: (field: keyof CustomerFormValues, value: string) => void;
  lineDisplayName?: string;
}

export function CustomerForm({
  lang,
  values,
  errors,
  onChange,
  lineDisplayName,
}: CustomerFormProps) {
  const tr = t(lang);

  return (
    <div className="space-y-5">
      {/* LINE connection indicator */}
      {lineDisplayName ? (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          <span className="text-sm text-green-800">
            {tr.lineConnected}: <strong>{lineDisplayName}</strong>
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-3 bg-cream-100 border border-brand-border rounded-lg">
          <Smartphone className="w-4 h-4 text-brand-light-brown shrink-0" />
          <span className="text-sm text-brand-light-brown">{tr.lineNotConnected}</span>
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">{tr.firstName} *</label>
          <input
            type="text"
            className="input"
            value={values.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            autoComplete="given-name"
          />
          {errors.firstName && (
            <p className="error-msg">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="label">{tr.lastName} *</label>
          <input
            type="text"
            className="input"
            value={values.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            autoComplete="family-name"
          />
          {errors.lastName && (
            <p className="error-msg">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Nationality */}
      <div>
        <label className="label">{tr.nationality} *</label>
        <select
          className="input"
          value={values.nationality}
          onChange={(e) => onChange("nationality", e.target.value)}
        >
          <option value="">—</option>
          {NATIONALITY_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {errors.nationality && (
          <p className="error-msg">{errors.nationality}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="label">{tr.phone} *</label>
        <input
          type="tel"
          className="input"
          value={values.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="+66 XX XXX XXXX"
          autoComplete="tel"
        />
        {errors.phone && <p className="error-msg">{errors.phone}</p>}
        <p className="text-xs text-brand-light-brown mt-1">
          International format: +66, +86, +81, +82, +1…
        </p>
      </div>
    </div>
  );
}
