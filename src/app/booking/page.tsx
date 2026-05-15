"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Service, Language } from "@/types";
import { t } from "@/lib/i18n";
import { formatDate, formatTime, formatPrice } from "@/lib/booking-utils";
import { LanguageSwitcher } from "@/components/booking/LanguageSwitcher";
import { ServiceSelector } from "@/components/booking/ServiceSelector";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import { CustomerForm } from "@/components/booking/CustomerForm";
import { Logo } from "@/components/ui/Logo";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SERVICE_SEED_DATA } from "@/data/services";

interface ServiceSelection {
  service: Service;
  durationMinutes: number;
  price: number;
}

interface CustomerValues {
  firstName: string;
  lastName: string;
  nationality: string;
  phone: string;
}

type Step = 1 | 2 | 3 | 4;

const STEPS = [1, 2, 3, 4] as const;

export default function BookingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>("en");
  const [step, setStep] = useState<Step>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [selectedService, setSelectedService] =
    useState<ServiceSelection | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customer, setCustomer] = useState<CustomerValues>({
    firstName: "",
    lastName: "",
    nationality: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerValues, string>>>({});
  const [lineProfile, setLineProfile] = useState<{
    userId: string;
    displayName: string;
    pictureUrl?: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const tr = t(lang);

  // Detect LINE LIFF
  useEffect(() => {
    const liff = (window as any).liff;
    if (!liff) return;
    liff
      .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID ?? "" })
      .then(() => {
        if (liff.isLoggedIn()) {
          liff.getProfile().then((profile: any) => {
            setLineProfile({
              userId: profile.userId,
              displayName: profile.displayName,
              pictureUrl: profile.pictureUrl,
            });
            const lang = liff.getLanguage?.() ?? "en";
            if (lang.startsWith("th")) setLang("th");
            else if (lang.startsWith("zh")) setLang("cn");
          });
        }
      })
      .catch(() => {
        // Not in LINE — continue as web
      });
  }, []);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && data.length > 0 ? setServices(data) : fallbackToStatic())
      .catch(() => fallbackToStatic())
      .finally(() => setLoadingServices(false));

    function fallbackToStatic() {
      const staticServices = SERVICE_SEED_DATA.map((s, i) => ({
        ...s,
        id: `static-${i}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })) as Service[];
      setServices(staticServices);
    }
  }, []);

  function validateCustomer(): boolean {
    const errs: Partial<Record<keyof CustomerValues, string>> = {};
    if (!customer.firstName.trim()) errs.firstName = tr.required;
    if (!customer.lastName.trim()) errs.lastName = tr.required;
    if (!customer.nationality) errs.nationality = tr.required;
    if (!customer.phone.trim()) errs.phone = tr.required;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function canAdvance(): boolean {
    if (step === 1) return !!selectedService;
    if (step === 2) return !!selectedDate && !!selectedTime;
    if (step === 3) {
      return (
        !!customer.firstName.trim() &&
        !!customer.lastName.trim() &&
        !!customer.nationality &&
        !!customer.phone.trim()
      );
    }
    return true;
  }

  function handleNext() {
    if (step === 3 && !validateCustomer()) return;
    if (step < 4) setStep((step + 1) as Step);
  }

  function handleBack() {
    if (step > 1) setStep((step - 1) as Step);
  }

  async function handleSubmit() {
    if (!selectedService || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    try {
      const payload = {
        service_id: selectedService.service.id,
        duration_minutes: selectedService.durationMinutes,
        price: selectedService.price,
        requested_date: selectedDate,
        requested_time: selectedTime,
        first_name: customer.firstName,
        last_name: customer.lastName,
        nationality: customer.nationality,
        phone: customer.phone,
        preferred_language: lang,
        ...(lineProfile && {
          line_user_id: lineProfile.userId,
          line_display_name: lineProfile.displayName,
          line_picture_url: lineProfile.pictureUrl,
        }),
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Booking failed");
      const booking = await res.json();
      router.push(
        `/booking/success?code=${booking.booking_code}&lang=${lang}`
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const stepLabels = [
    tr.selectService,
    tr.selectDateTime,
    tr.yourInfo,
    tr.reviewSubmit,
  ];

  function getName(s: Service) {
    if (lang === "th") return s.name_th;
    if (lang === "cn") return s.name_cn;
    return s.name_en;
  }

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-cream-200 border-b border-brand-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" variant="dark" />
          <LanguageSwitcher current={lang} onChange={setLang} />
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-cream-50 border-b border-brand-border">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-[10px] font-semibold shrink-0 transition-all tracking-wide ${
                      s < step
                        ? "bg-brand-terracotta text-cream-50"
                        : s === step
                        ? "bg-brand-dark text-cream-50"
                        : "bg-cream-300 text-brand-light-brown"
                    }`}
                    style={{ fontFamily: '"Josefin Sans", system-ui, sans-serif' }}
                  >
                    {s < step ? "✓" : s}
                  </div>
                  <span
                    className={`text-[10px] hidden sm:block truncate tracking-widest uppercase ${
                      s === step ? "text-brand-dark font-semibold" : "text-brand-light-brown"
                    }`}
                    style={{ fontFamily: '"Josefin Sans", system-ui, sans-serif' }}
                  >
                    {stepLabels[i]}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px flex-1 ${
                      s < step ? "bg-brand-terracotta" : "bg-brand-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="card p-6">
          <h2
            className="text-xs font-semibold mb-6 tracking-brand-wide uppercase text-brand-brown"
            style={{ fontFamily: '"Josefin Sans", system-ui, sans-serif' }}
          >
            {stepLabels[step - 1]}
          </h2>

          {/* Step 1: Service selection */}
          {step === 1 && (
            <div>
              {loadingServices ? (
                <div className="text-center py-12 text-brand-light-brown">
                  Loading services…
                </div>
              ) : (
                <ServiceSelector
                  services={services}
                  lang={lang}
                  value={selectedService}
                  onChange={setSelectedService}
                />
              )}
            </div>
          )}

          {/* Step 2: Date & time */}
          {step === 2 && selectedService && (
            <div>
              <div className="mb-6 p-4 bg-cream-200 border border-brand-border">
                <p className="label">Selected Service</p>
                <p className="font-medium text-brand-dark text-sm">
                  {getName(selectedService.service)}
                </p>
                <p className="text-xs text-brand-brown mt-1 tracking-wide">
                  {selectedService.durationMinutes} {tr.minutes} ·{" "}
                  {formatPrice(selectedService.price)}
                </p>
              </div>
              <DateTimePicker
                lang={lang}
                durationMinutes={selectedService.durationMinutes}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
              />
            </div>
          )}

          {/* Step 3: Customer info */}
          {step === 3 && (
            <CustomerForm
              lang={lang}
              values={customer}
              errors={errors}
              onChange={(field, val) =>
                setCustomer((prev) => ({ ...prev, [field]: val }))
              }
              lineDisplayName={lineProfile?.displayName}
            />
          )}

          {/* Step 4: Review & submit */}
          {step === 4 && selectedService && (
            <div className="space-y-4">
              <div className="p-5 bg-cream-200 border border-brand-border space-y-3">
                <Row label={tr.service} value={getName(selectedService.service)} />
                <Row label={tr.duration} value={`${selectedService.durationMinutes} ${tr.minutes}`} />
                <Row label={tr.price} value={formatPrice(selectedService.price)} />
                <div className="h-px bg-brand-border" />
                <Row label={tr.date} value={formatDate(selectedDate, lang)} />
                <Row label={tr.time} value={`${formatTime(selectedTime)} (${selectedService.durationMinutes} mins)`} />
                <div className="h-px bg-brand-border" />
                <Row label={tr.customer} value={`${customer.firstName} ${customer.lastName}`} />
                <Row label={tr.nationality} value={customer.nationality} />
                <Row label={tr.phone} value={customer.phone} />
              </div>

              <p
                className="text-[10px] text-brand-light-brown text-center tracking-widest uppercase"
                style={{ fontFamily: '"Josefin Sans", system-ui, sans-serif' }}
              >
                {lang === "th"
                  ? "เราจะตรวจสอบคิวและแจ้งผลผ่าน LINE ของคุณ"
                  : lang === "cn"
                  ? "我们将确认时间并通过 LINE 通知您。"
                  : "We will verify availability and notify you via LINE."}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-border">
            <button
              type="button"
              onClick={handleBack}
              className={`btn-secondary flex items-center gap-2 ${
                step === 1 ? "invisible" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canAdvance()}
                className="btn-primary flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary min-w-[180px] justify-center"
              >
                {submitting ? tr.submitting : tr.submit}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span
        className="text-[10px] text-brand-light-brown uppercase tracking-widest shrink-0"
        style={{ fontFamily: '"Josefin Sans", system-ui, sans-serif' }}
      >
        {label}
      </span>
      <span className="text-xs text-brand-dark font-medium text-right">{value}</span>
    </div>
  );
}
