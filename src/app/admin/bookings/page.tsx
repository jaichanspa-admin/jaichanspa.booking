"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { BookingWithRelations, BookingStatus } from "@/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDate, formatTime, formatPrice } from "@/lib/booking-utils";
import { Search, RefreshCw, ChevronRight } from "lucide-react";

const STATUSES: { value: string; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "proposed_new_time", label: "New Time Proposed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (dateFilter) params.set("date", dateFilter);
    if (search) params.set("search", search);

    const res = await fetch(`/api/bookings?${params.toString()}`);
    const data = await res.json();
    setBookings(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [status, dateFilter, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Bookings</h1>
          {pendingCount > 0 && (
            <p className="text-sm text-amber-700 mt-1">
              {pendingCount} pending booking{pendingCount > 1 ? "s" : ""} need attention
            </p>
          )}
        </div>
        <button
          onClick={fetchBookings}
          className="btn-secondary flex items-center gap-2 !py-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-light-brown" />
          <input
            type="text"
            className="input pl-9"
            placeholder="Search name / phone / booking code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-48"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="input sm:w-44"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="card p-8 text-center text-brand-light-brown">
          Loading bookings…
        </div>
      ) : bookings.length === 0 ? (
        <div className="card p-8 text-center text-brand-light-brown">
          No bookings found.
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 border-b border-brand-border">
                <tr>
                  {[
                    "Code",
                    "Customer",
                    "Service",
                    "Date & Time",
                    "Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-brand-light-brown font-medium text-xs uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-brand-brown">
                      {b.booking_code}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-dark">
                        {b.customer?.first_name} {b.customer?.last_name}
                      </p>
                      <p className="text-xs text-brand-light-brown">
                        {b.customer?.nationality} · {b.customer?.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-brand-dark">{b.service_name_snapshot}</p>
                      <p className="text-xs text-brand-light-brown">
                        {b.duration_minutes} mins · {formatPrice(b.price_snapshot)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-brand-dark">
                        {formatDate(b.requested_date, "en")}
                      </p>
                      <p className="text-xs text-brand-light-brown">
                        {formatTime(b.requested_time)} – {formatTime(b.requested_end_time)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status as BookingStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="flex items-center gap-1 text-brand-gold hover:text-brand-brown text-sm font-medium"
                      >
                        View
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-brand-border">
            {bookings.map((b) => (
              <Link
                key={b.id}
                href={`/admin/bookings/${b.id}`}
                className="block p-4 hover:bg-cream-50 active:bg-cream-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-brand-dark">
                      {b.customer?.first_name} {b.customer?.last_name}
                    </p>
                    <p className="text-xs text-brand-light-brown font-mono">
                      {b.booking_code}
                    </p>
                  </div>
                  <StatusBadge status={b.status as BookingStatus} />
                </div>
                <p className="text-sm text-brand-dark">{b.service_name_snapshot}</p>
                <p className="text-xs text-brand-light-brown mt-1">
                  {formatDate(b.requested_date, "en")} · {formatTime(b.requested_time)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
