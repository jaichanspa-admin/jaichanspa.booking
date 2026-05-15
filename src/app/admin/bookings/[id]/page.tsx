"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { BookingWithRelations, BookingStatus } from "@/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDate, formatTime, formatPrice, generateTimeSlots, canBook, getEndTime, getTodayString } from "@/lib/booking-utils";
import { ChevronLeft, CheckCircle, Clock, XCircle, Ban, Phone, Flag, User, Calendar } from "lucide-react";

const REJECTION_PRESETS = [
  "Fully booked for that time slot",
  "Service not available on that date",
  "Insufficient therapist availability",
  "Customer information incomplete",
];

export default function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [booking, setBooking] = useState<BookingWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Modals
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  // Propose time
  const [proposeDate, setProposeDate] = useState("");
  const [proposeTime, setProposeTime] = useState("");

  // Reject
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function callAction(path: string, body: object) {
    setProcessing(true);
    try {
      const res = await fetch(`/api/bookings/${id}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "Action failed");
        return;
      }
      const updated = await res.json();
      setBooking(updated);
      setShowProposeModal(false);
      setShowRejectModal(false);
    } catch {
      alert("Network error");
    } finally {
      setProcessing(false);
    }
  }

  const proposeSlots = proposeDate
    ? generateTimeSlots(booking?.duration_minutes ?? 60)
    : [];

  if (loading) {
    return (
      <div className="text-center py-16 text-brand-light-brown">Loading…</div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-16">
        <p className="text-brand-dark font-medium mb-4">Booking not found.</p>
        <Link href="/admin/bookings" className="btn-secondary">
          Back to Bookings
        </Link>
      </div>
    );
  }

  const isActionable = !["cancelled", "rejected"].includes(booking.status);

  return (
    <div>
      {/* Back */}
      <Link
        href="/admin/bookings"
        className="flex items-center gap-2 text-brand-brown hover:text-brand-dark text-sm mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Bookings
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-brand-dark">
              {booking.booking_code}
            </h1>
            <StatusBadge status={booking.status as BookingStatus} />
          </div>
          <p className="text-sm text-brand-light-brown">
            Received{" "}
            {new Date(booking.created_at).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        {/* Action buttons */}
        {isActionable && (
          <div className="flex flex-wrap gap-2">
            {(booking.status === "pending" ||
              booking.status === "proposed_new_time") && (
              <button
                onClick={() =>
                  callAction("confirm", { admin_note: adminNote })
                }
                disabled={processing}
                className="btn-primary flex items-center gap-2 !py-2"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm
              </button>
            )}
            {booking.status !== "confirmed" && (
              <button
                onClick={() => setShowProposeModal(true)}
                disabled={processing}
                className="btn-secondary flex items-center gap-2 !py-2"
              >
                <Clock className="w-4 h-4" />
                Propose New Time
              </button>
            )}
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={processing}
              className="btn-danger flex items-center gap-2 !py-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={() => {
                if (confirm("Cancel this booking?"))
                  callAction("cancel", {});
              }}
              disabled={processing}
              className="btn-secondary flex items-center gap-2 !py-2 text-gray-600"
            >
              <Ban className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — main details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service */}
          <div className="card p-6">
            <h2 className="text-xs uppercase tracking-wider text-brand-light-brown mb-4">
              Service
            </h2>
            <p className="text-lg font-semibold text-brand-dark">
              {booking.service_name_snapshot}
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <Detail label="Duration" value={`${booking.duration_minutes} mins`} />
              <Detail label="Price" value={formatPrice(booking.price_snapshot)} />
              <Detail label="Category" value={booking.service?.category ?? "—"} />
            </div>
          </div>

          {/* Requested time */}
          <div className="card p-6">
            <h2 className="text-xs uppercase tracking-wider text-brand-light-brown mb-4">
              Requested Date & Time
            </h2>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-brand-gold" />
              <div>
                <p className="font-semibold text-brand-dark">
                  {formatDate(booking.requested_date, "en")}
                </p>
                <p className="text-sm text-brand-brown">
                  {formatTime(booking.requested_time)} –{" "}
                  {formatTime(booking.requested_end_time)}
                </p>
              </div>
            </div>
          </div>

          {/* Proposed time (if any) */}
          {booking.proposed_date && (
            <div className="card p-6 border-amber-200 bg-amber-50">
              <h2 className="text-xs uppercase tracking-wider text-amber-700 mb-4">
                Proposed New Time
              </h2>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-brand-dark">
                    {formatDate(booking.proposed_date, "en")}
                  </p>
                  <p className="text-sm text-brand-brown">
                    {formatTime(booking.proposed_time!)} –{" "}
                    {formatTime(booking.proposed_end_time!)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rejection reason */}
          {booking.rejection_reason && (
            <div className="card p-6 border-red-200 bg-red-50">
              <h2 className="text-xs uppercase tracking-wider text-red-600 mb-2">
                Rejection Reason
              </h2>
              <p className="text-sm text-red-800">{booking.rejection_reason}</p>
            </div>
          )}

          {/* Admin note */}
          <div className="card p-6">
            <h2 className="text-xs uppercase tracking-wider text-brand-light-brown mb-3">
              Admin Note
            </h2>
            {booking.admin_note ? (
              <p className="text-sm text-brand-dark">{booking.admin_note}</p>
            ) : (
              <p className="text-sm text-brand-light-brown italic">No note added</p>
            )}
          </div>
        </div>

        {/* Right — customer */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xs uppercase tracking-wider text-brand-light-brown mb-4">
              Customer
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-brand-gold shrink-0" />
                <div>
                  <p className="font-semibold text-brand-dark">
                    {booking.customer?.first_name} {booking.customer?.last_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Flag className="w-4 h-4 text-brand-gold shrink-0" />
                <p className="text-sm text-brand-dark">
                  {booking.customer?.nationality}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a
                  href={`tel:${booking.customer?.phone}`}
                  className="text-sm text-brand-gold hover:underline"
                >
                  {booking.customer?.phone}
                </a>
              </div>
              {booking.customer?.line_display_name && (
                <div className="flex items-center gap-3 text-sm text-brand-dark">
                  <span className="w-4 text-center text-green-600">L</span>
                  <span>{booking.customer.line_display_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* LINE User ID */}
          {booking.customer?.line_user_id && (
            <div className="card p-4">
              <p className="text-xs text-brand-light-brown uppercase tracking-wider mb-1">
                LINE User ID
              </p>
              <p className="text-xs font-mono text-brand-dark break-all">
                {booking.customer.line_user_id}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Propose New Time Modal */}
      {showProposeModal && (
        <Modal onClose={() => setShowProposeModal(false)}>
          <h2 className="text-lg font-bold text-brand-dark mb-4">
            Propose New Time
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">New Date</label>
              <input
                type="date"
                className="input"
                min={getTodayString()}
                value={proposeDate}
                onChange={(e) => {
                  setProposeDate(e.target.value);
                  setProposeTime("");
                }}
              />
            </div>
            {proposeDate && (
              <div>
                <label className="label">New Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {proposeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setProposeTime(slot)}
                      className={`py-2 px-1 rounded-lg border text-sm font-medium transition-all ${
                        proposeTime === slot
                          ? "bg-brand-dark text-white border-brand-dark"
                          : "border-brand-border text-brand-brown hover:border-brand-dark bg-white"
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
                {proposeTime && (
                  <p className="text-xs text-brand-light-brown mt-2">
                    End time:{" "}
                    {formatTime(
                      getEndTime(proposeTime, booking.duration_minutes)
                    )}
                  </p>
                )}
              </div>
            )}
            <div>
              <label className="label">Admin Note (optional)</label>
              <textarea
                className="input resize-none"
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Internal note…"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() =>
                callAction("propose", {
                  proposed_date: proposeDate,
                  proposed_time: proposeTime,
                  admin_note: adminNote,
                })
              }
              disabled={!proposeDate || !proposeTime || processing}
              className="btn-primary flex-1"
            >
              {processing ? "Sending…" : "Send Proposal"}
            </button>
            <button
              onClick={() => setShowProposeModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <Modal onClose={() => setShowRejectModal(false)}>
          <h2 className="text-lg font-bold text-brand-dark mb-4">
            Reject Booking
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Reason</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {REJECTION_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setRejectReason(p)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      rejectReason === p
                        ? "bg-red-600 text-white border-red-600"
                        : "border-brand-border text-brand-brown hover:border-red-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <textarea
                className="input resize-none"
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Or type a custom reason…"
              />
            </div>
            <div>
              <label className="label">Admin Note (optional)</label>
              <textarea
                className="input resize-none"
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() =>
                callAction("reject", {
                  rejection_reason: rejectReason,
                  admin_note: adminNote,
                })
              }
              disabled={!rejectReason.trim() || processing}
              className="btn-danger flex-1"
            >
              {processing ? "Rejecting…" : "Reject Booking"}
            </button>
            <button
              onClick={() => setShowRejectModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-brand-light-brown">{label}</p>
      <p className="font-medium text-brand-dark mt-0.5">{value}</p>
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-light-brown hover:text-brand-dark"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
