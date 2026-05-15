"use client";

import { useState, useEffect, useCallback } from "react";
import type { Service, ServiceCategory, ServiceDuration } from "@/types";
import { formatPrice } from "@/lib/booking-utils";
import {
  ToggleLeft,
  ToggleRight,
  Edit2,
  Trash2,
  Plus,
  X,
  Check,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EditForm = {
  category: ServiceCategory;
  name_th: string;
  name_en: string;
  name_cn: string;
  description_th: string;
  description_en: string;
  description_cn: string;
  durations: ServiceDuration[];
  sort_order: number;
  is_active: boolean;
};

const EMPTY_FORM: EditForm = {
  category: "signatures",
  name_th: "",
  name_en: "",
  name_cn: "",
  description_th: "",
  description_en: "",
  description_cn: "",
  durations: [{ minutes: 60, price: 0 }],
  sort_order: 99,
  is_active: true,
};

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: "signatures", label: "JAI CHAN Signatures" },
  { value: "siam_touch", label: "Siam Touch Therapy" },
  { value: "beauty", label: "Beauty Service" },
  { value: "packages", label: "Package" },
  { value: "membership", label: "Membership" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // modal state
  const [modal, setModal] = useState<"edit" | "add" | null>(null);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [form, setForm] = useState<EditForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/services?all=true");
    const data = await res.json();
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Toggle active ──────────────────────────────────────────────────────────
  async function toggleActive(service: Service) {
    setToggling(service.id);
    await fetch(`/api/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !service.is_active }),
    });
    await fetchAll();
    setToggling(null);
  }

  // ── Open edit modal ────────────────────────────────────────────────────────
  function openEdit(service: Service) {
    setEditTarget(service);
    setForm({
      category: service.category,
      name_th: service.name_th,
      name_en: service.name_en,
      name_cn: service.name_cn,
      description_th: service.description_th,
      description_en: service.description_en,
      description_cn: service.description_cn,
      durations: service.durations.map((d) => ({ ...d })),
      sort_order: service.sort_order,
      is_active: service.is_active,
    });
    setError(null);
    setModal("edit");
  }

  // ── Open add modal ─────────────────────────────────────────────────────────
  function openAdd() {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, durations: [{ minutes: 60, price: 0 }] });
    setError(null);
    setModal("add");
  }

  function closeModal() {
    setModal(null);
    setEditTarget(null);
    setError(null);
  }

  // ── Save (create or update) ────────────────────────────────────────────────
  async function saveService() {
    if (!form.name_en.trim()) {
      setError("Service name (EN) is required.");
      return;
    }
    if (form.durations.length === 0) {
      setError("At least one duration is required.");
      return;
    }
    for (const d of form.durations) {
      if (!d.minutes || d.price < 0) {
        setError("All durations must have valid minutes and price.");
        return;
      }
    }
    setSaving(true);
    setError(null);

    const payload = { ...form };
    let res: Response;

    if (modal === "edit" && editTarget) {
      res = await fetch(`/api/services/${editTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Save failed.");
      setSaving(false);
      return;
    }

    await fetchAll();
    setSaving(false);
    closeModal();
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function deleteService(id: string) {
    setDeleting(id);
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    await fetchAll();
    setDeleting(null);
  }

  // ── Duration helpers ───────────────────────────────────────────────────────
  function updateDuration(i: number, field: keyof ServiceDuration, value: number) {
    setForm((f) => {
      const durations = f.durations.map((d, idx) =>
        idx === i ? { ...d, [field]: value } : d
      );
      return { ...f, durations };
    });
  }

  function addDuration() {
    setForm((f) => ({
      ...f,
      durations: [...f.durations, { minutes: 60, price: 0 }],
    }));
  }

  function removeDuration(i: number) {
    setForm((f) => ({
      ...f,
      durations: f.durations.filter((_, idx) => idx !== i),
    }));
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Services</h1>
          <p className="text-sm text-brand-light-brown mt-0.5">
            Manage service availability, content, and pricing
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white text-sm rounded-lg hover:bg-brand-brown transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="card p-8 text-center text-brand-light-brown">
          Loading services…
        </div>
      ) : (
        <div className="space-y-8">
          {CATEGORIES.map(({ value: cat, label }) => {
            const catServices = services.filter((s) => s.category === cat);
            if (catServices.length === 0) return null;
            return (
              <div key={cat}>
                <h2 className="text-xs uppercase tracking-widest text-brand-light-brown font-medium mb-3">
                  {label}
                </h2>
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-cream-100 border-b border-brand-border">
                      <tr>
                        {["Service", "Durations & Prices", "Active", ""].map((h) => (
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
                      {catServices.map((s) => (
                        <tr
                          key={s.id}
                          className={`transition-colors ${!s.is_active ? "opacity-50" : ""}`}
                        >
                          {/* Name */}
                          <td className="px-4 py-3 w-60">
                            <p className="font-medium text-brand-dark leading-snug">
                              {s.name_en}
                            </p>
                            <p className="text-xs text-brand-light-brown mt-0.5">
                              {s.name_th}
                            </p>
                            <p className="text-xs text-brand-light-brown line-clamp-1 mt-0.5 max-w-[220px]">
                              {s.description_en}
                            </p>
                          </td>

                          {/* Durations */}
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1.5">
                              {s.durations.map((d) => (
                                <span
                                  key={d.minutes}
                                  className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-cream-100 rounded border border-brand-border text-brand-brown"
                                >
                                  {d.minutes} min · {formatPrice(d.price)}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Toggle */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleActive(s)}
                              disabled={toggling === s.id}
                              className="transition-colors"
                              title={s.is_active ? "Disable" : "Enable"}
                            >
                              {toggling === s.id ? (
                                <Loader2 className="w-5 h-5 animate-spin text-brand-light-brown" />
                              ) : s.is_active ? (
                                <ToggleRight className="w-6 h-6 text-green-600" />
                              ) : (
                                <ToggleLeft className="w-6 h-6 text-gray-400" />
                              )}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEdit(s)}
                                className="p-1.5 rounded hover:bg-cream-100 text-brand-light-brown hover:text-brand-dark transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              {deleteConfirm === s.id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => deleteService(s.id)}
                                    disabled={deleting === s.id}
                                    className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                    title="Confirm delete"
                                  >
                                    {deleting === s.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Check className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="p-1.5 rounded hover:bg-cream-100 text-brand-light-brown transition-colors"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(s.id)}
                                  className="p-1.5 rounded hover:bg-red-50 text-brand-light-brown hover:text-red-500 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Edit / Add Modal ───────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
              <h2 className="text-lg font-semibold text-brand-dark">
                {modal === "add" ? "Add New Service" : "Edit Service"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-cream-100 text-brand-light-brown transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-6">
              {/* Category + Sort */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-brand-light-brown uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category: e.target.value as ServiceCategory,
                      }))
                    }
                    className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-light-brown uppercase tracking-wider mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        sort_order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  />
                </div>
              </div>

              {/* Names */}
              <div>
                <p className="text-xs font-medium text-brand-light-brown uppercase tracking-wider mb-2">
                  Service Name
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {(["en", "th", "cn"] as const).map((lang) => (
                    <div key={lang} className="flex items-center gap-2">
                      <span className="text-xs text-brand-light-brown w-6 uppercase font-medium">
                        {lang}
                      </span>
                      <input
                        type="text"
                        value={form[`name_${lang}`]}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            [`name_${lang}`]: e.target.value,
                          }))
                        }
                        placeholder={`Name (${lang.toUpperCase()})`}
                        className="flex-1 border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <p className="text-xs font-medium text-brand-light-brown uppercase tracking-wider mb-2">
                  Description
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {(["en", "th", "cn"] as const).map((lang) => (
                    <div key={lang} className="flex items-start gap-2">
                      <span className="text-xs text-brand-light-brown w-6 uppercase font-medium mt-2.5">
                        {lang}
                      </span>
                      <textarea
                        value={form[`description_${lang}`]}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            [`description_${lang}`]: e.target.value,
                          }))
                        }
                        placeholder={`Description (${lang.toUpperCase()})`}
                        rows={2}
                        className="flex-1 border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Durations */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-brand-light-brown uppercase tracking-wider">
                    Durations & Prices
                  </p>
                  <button
                    onClick={addDuration}
                    className="text-xs flex items-center gap-1 text-brand-gold hover:text-brand-brown transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Duration
                  </button>
                </div>
                <div className="space-y-2">
                  {form.durations.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="number"
                          value={d.minutes}
                          min={1}
                          onChange={(e) =>
                            updateDuration(i, "minutes", parseInt(e.target.value) || 0)
                          }
                          className="w-24 border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                        />
                        <span className="text-xs text-brand-light-brown">min</span>
                        <input
                          type="number"
                          value={d.price}
                          min={0}
                          step={50}
                          onChange={(e) =>
                            updateDuration(i, "price", parseInt(e.target.value) || 0)
                          }
                          className="flex-1 border border-brand-border rounded-lg px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                        />
                        <span className="text-xs text-brand-light-brown">THB</span>
                      </div>
                      {form.durations.length > 1 && (
                        <button
                          onClick={() => removeDuration(i)}
                          className="p-1.5 rounded hover:bg-red-50 text-brand-light-brown hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                  className="transition-colors"
                >
                  {form.is_active ? (
                    <ToggleRight className="w-7 h-7 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-gray-400" />
                  )}
                </button>
                <span className="text-sm text-brand-dark">
                  {form.is_active ? "Active (visible to customers)" : "Inactive (hidden)"}
                </span>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-brand-border">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-brand-light-brown hover:text-brand-dark transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-brand-dark text-white text-sm rounded-lg hover:bg-brand-brown transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {modal === "add" ? "Create Service" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
