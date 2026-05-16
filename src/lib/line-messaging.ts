import type { BookingWithRelations } from "@/types";
import { formatTime, formatPrice } from "./booking-utils";

const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "";
const GROUP_ID = process.env.LINE_RECEPTION_GROUP_ID ?? "";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://jai-chan-booking.vercel.app";

const IS_MOCK = !TOKEN;

// ─── Core push helper ─────────────────────────────────────────────────────────

async function pushMessage(to: string, messages: object[]): Promise<void> {
  if (IS_MOCK || !to || to.startsWith("MOCK")) {
    console.log("[LINE MOCK] push →", to, JSON.stringify(messages, null, 2));
    return;
  }
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ to, messages }),
  });
  if (!res.ok) {
    console.error("[LINE] push failed:", await res.text());
  }
}

async function replyMessage(replyToken: string, messages: object[]): Promise<void> {
  if (!TOKEN) return;
  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
  if (!res.ok) {
    console.error("[LINE] reply failed:", await res.text());
  }
}

// ─── Flex Message builders ─────────────────────────────────────────────────────

function infoRow(label: string, value: string) {
  return {
    type: "box",
    layout: "horizontal",
    spacing: "sm",
    contents: [
      {
        type: "text",
        text: label,
        size: "xs",
        color: "#999999",
        flex: 3,
      },
      {
        type: "text",
        text: value,
        size: "xs",
        color: "#333333",
        flex: 7,
        wrap: true,
        weight: "bold",
      },
    ],
  };
}

function buildNewBookingFlex(booking: BookingWithRelations) {
  const adminUrl = `${APP_URL}/admin/bookings/${booking.id}`;
  const customerName = `${booking.customer.first_name} ${booking.customer.last_name}`;
  const dateTime = `${booking.requested_date}  ${formatTime(booking.requested_time)} – ${formatTime(booking.requested_end_time)}`;

  return {
    type: "flex",
    altText: `🔔 การจองใหม่ ${booking.booking_code} — ${customerName}`,
    contents: {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#1a1a1a",
        paddingAll: "16px",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "text",
                text: "🔔  การจองใหม่",
                color: "#d4a855",
                size: "sm",
                weight: "bold",
                flex: 1,
              },
              {
                type: "text",
                text: booking.booking_code,
                color: "#888888",
                size: "xs",
                align: "end",
              },
            ],
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        paddingAll: "16px",
        contents: [
          infoRow("ลูกค้า", `${customerName} (${booking.customer.nationality})`),
          infoRow("โทร", booking.customer.phone),
          infoRow("บริการ", `${booking.service_name_snapshot} ${booking.duration_minutes} นาที`),
          infoRow("วัน/เวลา", dateTime),
          infoRow("ราคา", formatPrice(booking.price_snapshot)),
          {
            type: "separator",
            margin: "md",
          },
          {
            type: "text",
            text: "⏳ รอการยืนยัน",
            size: "xs",
            color: "#e67700",
            margin: "md",
            weight: "bold",
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        paddingAll: "12px",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            spacing: "sm",
            contents: [
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "✅ ยืนยัน",
                  data: `action=confirm&id=${booking.id}`,
                  displayText: `✅ ยืนยันการจอง ${booking.booking_code}`,
                },
                style: "primary",
                color: "#2d7d2d",
                height: "sm",
                flex: 1,
              },
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "❌ ปฏิเสธ",
                  data: `action=reject&id=${booking.id}`,
                  displayText: `❌ ปฏิเสธการจอง ${booking.booking_code}`,
                },
                style: "primary",
                color: "#cc3333",
                height: "sm",
                flex: 1,
              },
            ],
          },
          {
            type: "button",
            action: {
              type: "uri",
              label: "🕐 เสนอเวลาใหม่ / รายละเอียด",
              uri: adminUrl,
            },
            style: "secondary",
            height: "sm",
          },
        ],
      },
    },
  };
}

// ─── Exported notification functions ──────────────────────────────────────────

export async function notifyReceptionNewBooking(
  booking: BookingWithRelations
): Promise<void> {
  if (!GROUP_ID) {
    console.warn("[LINE] LINE_RECEPTION_GROUP_ID not set — skipping group notify");
    return;
  }
  await pushMessage(GROUP_ID, [buildNewBookingFlex(booking)]);
}

export async function notifyCustomerBookingReceived(
  booking: BookingWithRelations
): Promise<void> {
  if (!booking.customer.line_user_id) return;
  const texts: Record<string, string> = {
    en: `✅ Booking request received!\n\n📋 ${booking.booking_code}\n💆 ${booking.service_name_snapshot} — ${booking.duration_minutes} mins\n📅 ${booking.requested_date}  ${formatTime(booking.requested_time)}\n\nWe'll confirm your booking shortly via LINE.`,
    th: `✅ รับเรื่องการจองแล้ว!\n\n📋 ${booking.booking_code}\n💆 ${booking.service_name_snapshot} — ${booking.duration_minutes} นาที\n📅 ${booking.requested_date}  ${formatTime(booking.requested_time)}\n\nเราจะแจ้งผลการยืนยันผ่าน LINE เร็ว ๆ นี้`,
    cn: `✅ 预约请求已收到！\n\n📋 ${booking.booking_code}\n💆 ${booking.service_name_snapshot} — ${booking.duration_minutes}分钟\n📅 ${booking.requested_date}  ${formatTime(booking.requested_time)}\n\n我们将尽快通过LINE确认您的预约。`,
  };
  const lang = booking.customer.preferred_language ?? "en";
  await pushMessage(booking.customer.line_user_id, [
    { type: "text", text: texts[lang] ?? texts.en },
  ]);
}

export async function notifyCustomerConfirmed(
  booking: BookingWithRelations
): Promise<void> {
  if (!booking.customer.line_user_id) return;
  const texts: Record<string, string> = {
    en: `🎉 Booking Confirmed!\n\n📋 ${booking.booking_code}\n💆 ${booking.service_name_snapshot} — ${booking.duration_minutes} mins\n📅 ${booking.requested_date}  ${formatTime(booking.requested_time)} – ${formatTime(booking.requested_end_time)}\n💰 ${formatPrice(booking.price_snapshot)}\n\nSee you soon! Please arrive 5 minutes early.\n📍 JAI CHAN SPA, Siam Discovery`,
    th: `🎉 ยืนยันการจองแล้ว!\n\n📋 ${booking.booking_code}\n💆 ${booking.service_name_snapshot} — ${booking.duration_minutes} นาที\n📅 ${booking.requested_date}  ${formatTime(booking.requested_time)} – ${formatTime(booking.requested_end_time)}\n💰 ${formatPrice(booking.price_snapshot)}\n\nพบกันเร็ว ๆ นี้! กรุณามาก่อนเวลา 5 นาที\n📍 JAI CHAN SPA, สยามดิสคัฟเวอรี่`,
    cn: `🎉 预约已确认！\n\n📋 ${booking.booking_code}\n💆 ${booking.service_name_snapshot} — ${booking.duration_minutes}分钟\n📅 ${booking.requested_date}  ${formatTime(booking.requested_time)} – ${formatTime(booking.requested_end_time)}\n💰 ${formatPrice(booking.price_snapshot)}\n\n期待您的光临！请提前5分钟到达。\n📍 JAI CHAN SPA，Siam Discovery`,
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
  const proposed = `${booking.proposed_date}  ${formatTime(booking.proposed_time!)} – ${formatTime(booking.proposed_end_time!)}`;
  const texts: Record<string, string> = {
    en: `⏰ New Time Proposed\n\n📋 ${booking.booking_code}\nYour original time is unavailable. We propose:\n\n📅 ${proposed}\n💆 ${booking.service_name_snapshot}\n\nAccept or decline: ${respondUrl}`,
    th: `⏰ เสนอวันเวลาใหม่\n\n📋 ${booking.booking_code}\nเวลาเดิมไม่ว่าง ทีมงานขอเสนอเวลาใหม่:\n\n📅 ${proposed}\n💆 ${booking.service_name_snapshot}\n\nกรุณาตอบรับหรือปฏิเสธ: ${respondUrl}`,
    cn: `⏰ 提议新时间\n\n📋 ${booking.booking_code}\n您所请求的时间不可用，我们提议：\n\n📅 ${proposed}\n💆 ${booking.service_name_snapshot}\n\n请接受或拒绝：${respondUrl}`,
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
  const reason = booking.rejection_reason ?? "คิวเต็ม / Fully booked";
  const texts: Record<string, string> = {
    en: `😔 Booking Unavailable\n\n📋 ${booking.booking_code}\n${booking.service_name_snapshot}\n\nReason: ${reason}\n\nPlease contact us to reschedule or walk in anytime.\n📍 JAI CHAN SPA, Siam Discovery`,
    th: `😔 ไม่สามารถรับจองได้\n\n📋 ${booking.booking_code}\n${booking.service_name_snapshot}\n\nเหตุผล: ${reason}\n\nติดต่อเราเพื่อนัดใหม่ หรือ walk-in ได้เลย\n📍 JAI CHAN SPA, สยามดิสคัฟเวอรี่`,
    cn: `😔 预约不可用\n\n📋 ${booking.booking_code}\n${booking.service_name_snapshot}\n\n原因：${reason}\n\n请联系我们重新安排或直接到店。\n📍 JAI CHAN SPA，Siam Discovery`,
  };
  const lang = booking.customer.preferred_language ?? "en";
  await pushMessage(booking.customer.line_user_id, [
    { type: "text", text: texts[lang] ?? texts.en },
  ]);
}

// ─── Reply to reception after action ─────────────────────────────────────────

export async function replyActionResult(
  replyToken: string,
  text: string
): Promise<void> {
  await replyMessage(replyToken, [{ type: "text", text }]);
}
