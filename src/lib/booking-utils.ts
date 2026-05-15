const OPEN_HOUR = 10 * 60; // 10:00 in minutes
const CLOSE_HOUR = 22 * 60; // 22:00 in minutes
const SLOT_INTERVAL = 30; // 30-minute slots

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function canBook(startTime: string, durationMinutes: number): boolean {
  const start = timeToMinutes(startTime);
  const end = start + durationMinutes;
  return start >= OPEN_HOUR && end <= CLOSE_HOUR;
}

export function getEndTime(startTime: string, durationMinutes: number): string {
  const start = timeToMinutes(startTime);
  return minutesToTime(start + durationMinutes);
}

export function generateTimeSlots(durationMinutes: number): string[] {
  const slots: string[] = [];
  let current = OPEN_HOUR;
  while (current + durationMinutes <= CLOSE_HOUR) {
    slots.push(minutesToTime(current));
    current += SLOT_INTERVAL;
  }
  return slots;
}

export function formatDate(dateStr: string, lang: string = "en"): string {
  const date = new Date(dateStr + "T00:00:00");
  const localeMap: Record<string, string> = {
    en: "en-US",
    th: "th-TH",
    cn: "zh-CN",
  };
  return date.toLocaleDateString(localeMap[lang] ?? "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("th-TH") + " THB";
}

export function generateBookingCode(): string {
  const prefix = "JCS";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getMaxBookingDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().split("T")[0];
}
