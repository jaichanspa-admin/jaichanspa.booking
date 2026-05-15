"use client";

import { useState, useEffect } from "react";
import type { Service } from "@/types";
import { formatPrice } from "@/lib/booking-utils";
import { Plus, ToggleLeft, ToggleRight, Edit2 } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  async function fetchAll() {
    setLoading(true);
    const res = await fetch("/api/services?all=true");
    const data = await res.json();
    // Fetch all (not just active) — for admin we want all
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
  }, []);

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

  const categories = [
    "signatures",
    "siam_touch",
    "beauty",
    "packages",
    "membership",
  ];

  const categoryLabels: Record<string, string> = {
    signatures: "JAI CHAN Signatures",
    siam_touch: "Siam Touch Therapy",
    beauty: "Beauty Service",
    packages: "Package",
    membership: "Membership",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">Services</h1>
        <p className="text-sm text-brand-light-brown">
          Manage service availability and pricing
        </p>
      </div>

      {loading ? (
        <div className="card p-8 text-center text-brand-light-brown">
          Loading services…
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => {
            const catServices = services.filter((s) => s.category === cat);
            if (catServices.length === 0) return null;
            return (
              <div key={cat}>
                <h2 className="text-sm uppercase tracking-wider text-brand-light-brown font-medium mb-3">
                  {categoryLabels[cat]}
                </h2>
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-cream-100 border-b border-brand-border">
                      <tr>
                        {["Service", "Durations & Prices", "Active", ""].map(
                          (h) => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-brand-light-brown font-medium text-xs uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                      {catServices.map((s) => (
                        <tr
                          key={s.id}
                          className={`transition-colors ${
                            !s.is_active ? "opacity-50" : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-brand-dark">
                              {s.name_en}
                            </p>
                            <p className="text-xs text-brand-light-brown mt-0.5 line-clamp-1">
                              {s.description_en}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {s.durations.map((d) => (
                                <span
                                  key={d.minutes}
                                  className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-cream-100 rounded border border-brand-border text-brand-brown"
                                >
                                  {d.minutes} mins · {formatPrice(d.price)}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleActive(s)}
                              disabled={toggling === s.id}
                              className="text-brand-gold hover:text-brand-brown transition-colors"
                              title={s.is_active ? "Disable" : "Enable"}
                            >
                              {s.is_active ? (
                                <ToggleRight className="w-6 h-6 text-green-600" />
                              ) : (
                                <ToggleLeft className="w-6 h-6 text-gray-400" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-brand-light-brown">
                              #{s.sort_order}
                            </span>
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

      <div className="mt-6 p-4 bg-cream-50 border border-brand-border rounded-lg">
        <p className="text-sm text-brand-light-brown">
          To add or modify services, update the Supabase database directly or
          run the seed migration. Full service editor coming in next version.
        </p>
      </div>
    </div>
  );
}
