"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Language } from "@/types";
import { t } from "@/lib/i18n";
import { Logo } from "@/components/ui/Logo";
import { CheckCircle, Clock } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const code = params.get("code") ?? "";
  const lang = (params.get("lang") ?? "en") as Language;
  const tr = t(lang);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <header className="bg-white border-b border-brand-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-center">
          <Logo size="sm" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-brand-dark mb-2">
            {tr.bookingSubmitted}
          </h1>

          <div className="mt-6 p-4 bg-cream-50 rounded-lg border border-brand-border">
            <p className="text-xs text-brand-light-brown uppercase tracking-wider mb-1">
              {tr.bookingCode}
            </p>
            <p className="text-2xl font-bold text-brand-dark font-mono tracking-wider">
              {code}
            </p>
          </div>

          <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200 text-left">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">{tr.waitingConfirmation}</p>
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href={`/booking?lang=${lang}`}
              className="btn-secondary w-full block text-center"
            >
              {tr.bookAgain}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-100" />}>
      <SuccessContent />
    </Suspense>
  );
}
