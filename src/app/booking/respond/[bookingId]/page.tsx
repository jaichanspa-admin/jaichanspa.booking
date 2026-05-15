"use client";

import { useState, useEffect, use } from "react";
import type { BookingWithRelations, Language } from "@/types";
import { t } from "@/lib/i18n";
import { Logo } from "@/components/ui/Logo";
import { formatDate, formatTime } from "@/lib/booking-utils";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function RespondPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  const [booking, setBooking] = useState<BookingWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"accepted" | "declined" | null>(null);
  const lang: Language =
    (booking?.customer?.preferred_language as Language) ?? "en";
  const tr = t(lang);

  useEffect(() => {
    fetch(`/api/bookings/${bookingId}`)
      .then((r) => r.json())
      .then(setBooking)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [bookingId]);

  async function handleRespond(accept: boolean) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });
      if (!res.ok) throw new Error("Failed");
      setResult(accept ? "accepted" : "declined");
    } catch {
      alert("Something went wrong. Please contact the shop.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <p className="text-brand-light-brown">Loading…</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
        <div className="card p-8 text-center max-w-sm w-full">
          <p className="text-brand-dark font-medium">Booking not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <header className="bg-white border-b border-brand-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-center">
          <Logo size="sm" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card p-8 max-w-md w-full">
          {result ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {result === "accepted" ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <XCircle className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <h2 className="text-xl font-bold text-brand-dark mb-2">
                {result === "accepted" ? tr.bookingAccepted : tr.bookingDeclined}
              </h2>
              {result === "declined" && (
                <p className="text-sm text-brand-light-brown mt-2">
                  {tr.contactShopText}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-brand-gold shrink-0" />
                <div>
                  <h1 className="text-xl font-bold text-brand-dark">
                    {tr.newTimeProposed}
                  </h1>
                  <p className="text-sm text-brand-light-brown mt-0.5">
                    {tr.receptionProposedTime}
                  </p>
                </div>
              </div>

              {booking.status !== "proposed_new_time" ? (
                <p className="text-brand-light-brown text-sm text-center py-4">
                  This proposal is no longer active. Status: {booking.status}
                </p>
              ) : (
                <>
                  <div className="space-y-4">
                    {/* Original */}
                    <div className="p-4 bg-cream-100 rounded-lg border border-brand-border">
                      <p className="text-xs text-brand-light-brown uppercase tracking-wider mb-2">
                        {tr.originalRequest}
                      </p>
                      <p className="font-medium text-brand-dark">
                        {booking.service_name_snapshot}
                      </p>
                      <p className="text-sm text-brand-brown mt-1">
                        {formatDate(booking.requested_date, lang)} ·{" "}
                        {formatTime(booking.requested_time)} –{" "}
                        {formatTime(booking.requested_end_time)}
                      </p>
                    </div>

                    {/* Proposed */}
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-xs text-amber-700 uppercase tracking-wider mb-2">
                        {tr.proposedTime}
                      </p>
                      <p className="font-medium text-brand-dark">
                        {booking.service_name_snapshot}
                      </p>
                      <p className="text-sm text-brand-brown mt-1">
                        {formatDate(booking.proposed_date!, lang)} ·{" "}
                        {formatTime(booking.proposed_time!)} –{" "}
                        {formatTime(booking.proposed_end_time!)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => handleRespond(true)}
                      disabled={submitting}
                      className="btn-primary w-full"
                    >
                      {tr.acceptNewTime}
                    </button>
                    <button
                      onClick={() => handleRespond(false)}
                      disabled={submitting}
                      className="btn-secondary w-full"
                    >
                      {tr.declineContactShop}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
