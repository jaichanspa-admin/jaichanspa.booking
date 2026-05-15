import type { BookingWithRelations } from "@/types";
import { formatDate, formatTime, formatPrice } from "./booking-utils";

const LINE_CHANNEL_ACCESS_TOKEN =
  process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "MOCK_TOKEN";
const LINE_RECEPTION_GROUP_ID =
  process.env.LINE_RECEPTION_GROUP_ID ?? "MOCK_GROUP_ID";

const IS_MOCK = !process.env.LINE_CHANNEL_ACCESS_TOKEN;

async function pushMessage(to: string, messages: object[]): Promise<void> {
  if (IS_MOCK) {
    console.log("[LINE MOCK] Push to:", to, JSON.stringify(messages, null, 2));
    return;
  }

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ to, messages }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("[LINE] Push failed:", error);
  }
}

function buildBookingText(booking: BookingWithRelations): string {
  return [
    `📋 Booking: ${booking.booking_code}`,
    `👤 ${booking.customer.first_name} ${booking.customer.last_name} (${booking.customer.nationality})`,
    `📞 ${booking.customer.phone}`,
    `💆 ${booking.service_name_snapshot} — ${booking.duration_minutes} mins`,
    `📅 ${booking.requested_date} ${formatTime(booking.requested_time)} - ${formatTime(booking.requested_end_time)}`,
    `💰 ${formatPrice(booking.price_snapshot)}`,
  ].join("\n");
}

export async function notifyReceptionNewBooking(
  booking: BookingWithRelations
): Promise<void> {
  const text = [
    "🔔 NEW BOOKING REQUEST",
    "",
    buildBookingText(booking),
    "",
    "⏳ Status: Pending",
    "Please check availability and confirm or propose a new time.",
  ].join("\n");

  await pushMessage(LINE_RECEPTION_GROUP_ID, [{ type: "text", text }]);
}

export async function notifyCustomerBookingReceived(
  booking: BookingWithRelations
): Promise<void> {
  if (!booking.customer.line_user_id) return;

  const texts: Record<string, string> = {
    en: `✅ Booking request received!\n\n${buildBookingText(booking)}\n\nStatus: Waiting for confirmation. We will notify you shortly.`,
    th: `✅ ส่งคำขอจองสำเร็จ!\n\n${buildBookingText(booking)}\n\nสถานะ: รอเจ้าหน้าที่ตรวจสอบ เราจะแจ้งผลให้เร็ว ๆ นี้`,
    cn: `✅ 预约请求已收到！\n\n${buildBookingText(booking)}\n\n状态：等待确认，我们将尽快通知您。`,
  };

  const lang = booking.customer.preferred_language ?? "en";
  const text = texts[lang] ?? texts.en;

  await pushMessage(booking.customer.line_user_id, [{ type: "text", text }]);
}

export async function notifyCustomerConfirmed(
  booking: BookingWithRelations
): Promise<void> {
  if (!booking.customer.line_user_id) return;

  const texts: Record<string, string> = {
    en: `🎉 Booking Confirmed!\n\n${buildBookingText(booking)}\n\nWe look forward to welcoming you. Please arrive 5 minutes early.\n\n📍 JAI CHAN SPA, Siam Discovery`,
    th: `🎉 ยืนยันการจองแล้ว!\n\n${buildBookingText(booking)}\n\nยินดีต้อนรับคุณ กรุณามาก่อนเวลา 5 นาที\n\n📍 JAI CHAN SPA, สยามดิสคัฟเวอรี่`,
    cn: `🎉 预约已确认！\n\n${buildBookingText(booking)}\n\n期待您的光临，请提前5分钟到达。\n\n📍 JAI CHAN SPA，Siam Discovery`,
  };

  const lang = booking.customer.preferred_language ?? "en";
  await pushMessage(booking.customer.line_user_id, [
    { type: "text", text: texts[lang] ?? texts.en },
  ]);
}

export async function notifyCustomerProposedTime(
  booking: BookingWithRelations,
  respondUrl: string
): Promise<void> {
  if (!booking.customer.line_user_id) return;

  const proposed = [
    `📅 ${booking.proposed_date} ${formatTime(booking.proposed_time!)} - ${formatTime(booking.proposed_end_time!)}`,
  ].join("\n");

  const texts: Record<string, string> = {
    en: `⏰ New Time Proposed\n\nYour requested time is unavailable. Our team proposes:\n\n${proposed}\n\nService: ${booking.service_name_snapshot}\n\nPlease respond: ${respondUrl}`,
    th: `⏰ เสนอวันเวลาใหม่\n\nเวลาที่คุณขอไม่ว่าง ทีมงานเสนอเวลาใหม่:\n\n${proposed}\n\nบริการ: ${booking.service_name_snapshot}\n\nกรุณาตอบรับ: ${respondUrl}`,
    cn: `⏰ 提议新时间\n\n您所请求的时间不可用，我们提议新时间：\n\n${proposed}\n\n服务：${booking.service_name_snapshot}\n\n请回复：${respondUrl}`,
  };

  const lang = booking.customer.preferred_language ?? "en";
  await pushMessage(booking.customer.line_user_id, [
    { type: "text", text: texts[lang] ?? texts.en },
  ]);
}

export async function notifyCustomerRejected(
  booking: BookingWithRelations
): Promise<void> {
  if (!booking.customer.line_user_id) return;

  const texts: Record<string, string> = {
    en: `😔 Booking Unavailable\n\nUnfortunately we cannot accommodate your booking at this time.\n\nReason: ${booking.rejection_reason ?? "Fully booked"}\n\nPlease contact us to reschedule: +66 XX XXX XXXX\n📍 JAI CHAN SPA, Siam Discovery`,
    th: `😔 ไม่สามารถรับจองได้\n\nขออภัย เราไม่สามารถรับการจองของคุณในขณะนี้\n\nเหตุผล: ${booking.rejection_reason ?? "คิวเต็ม"}\n\nกรุณาติดต่อเพื่อนัดหมายใหม่: +66 XX XXX XXXX\n📍 JAI CHAN SPA, สยามดิสคัฟเวอรี่`,
    cn: `😔 预约不可用\n\n很遗憾，我们目前无法接受您的预约。\n\n原因：${booking.rejection_reason ?? "已满"}\n\n请联系我们重新安排：+66 XX XXX XXXX\n📍 JAI CHAN SPA，Siam Discovery`,
  };

  const lang = booking.customer.preferred_language ?? "en";
  await pushMessage(booking.customer.line_user_id, [
    { type: "text", text: texts[lang] ?? texts.en },
  ]);
}
