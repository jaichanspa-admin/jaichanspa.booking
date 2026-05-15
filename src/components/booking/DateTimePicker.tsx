"use client";

import type { Language } from "@/types";
import { t } from "@/lib/i18n";
import {
  generateTimeSlots,
  getTodayString,
  getMaxBookingDate,
  formatTime,
} from "@/lib/booking-utils";
import { cn } from "@/lib/cn";
import { Calendar, Clock } from "lucide-react";

interface DateTimePickerProps {
  lang: Language;
  durationMinutes: number;
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export function DateTimePicker({
  lang,
  durationMinutes,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: DateTimePickerProps) {
  const tr = t(lang);
  const today = getTodayString();
  const maxDate = getMaxBookingDate();
  const slots = generateTimeSlots(durationMinutes);

  return (
    <div className="space-y-6">
      {/* Date picker */}
      <div>
        <label className="label flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-gold" />
          {tr.selectDate}
        </label>
        <input
          type="date"
          min={today}
          max={maxDate}
          value={selectedDate}
          onChange={(e) => {
            onDateChange(e.target.value);
            onTimeChange("");
          }}
          className="input"
        />
        <p className="text-xs text-brand-light-brown mt-1.5">{tr.openingHours}</p>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <label className="label flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-gold" />
            {tr.selectTime}
          </label>

          {slots.length === 0 ? (
            <p className="text-sm text-brand-light-brown">{tr.noSlotsAvailable}</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onTimeChange(slot)}
                  className={cn(
                    "py-2 px-1 rounded-lg border text-sm font-medium transition-all",
                    selectedTime === slot
                      ? "bg-brand-dark text-white border-brand-dark"
                      : "border-brand-border text-brand-brown hover:border-brand-dark bg-white"
                  )}
                >
                  {formatTime(slot)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
