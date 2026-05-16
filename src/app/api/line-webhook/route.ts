import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import {
  notifyCustomerConfirmed,
  notifyCustomerRejected,
  replyActionResult,
} from "@/lib/line-messaging";
import type { BookingWithRelations } from "@/types";

// LINE sends a POST to this endpoint for all events (messages, postbacks, follows, etc.)
// We only care about `postback` events from the action buttons in the Flex Message.

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const events = (body.events as Array<Record<string, unknown>>) ?? [];

  await Promise.allSettled(events.map(handleEvent));

  // LINE requires a 200 response quickly
  return NextResponse.json({ ok: true });
}

// LINE verifies the webhook with a GET (challenge)
export async function GET() {
  return NextResponse.json({ ok: true });
}

// ─── Event handler ─────────────────────────────────────────────────────────

async function handleEvent(event: Record<string, unknown>) {
  // ── Auto-reply Group ID when anyone sends "groupid" in the group ────────────
  if (event.type === "message") {
    const source = event.source as Record<string, string> | undefined;
    const msg = event.message as Record<string, string> | undefined;
    const replyToken = event.replyToken as string;
    const groupId = source?.groupId ?? "";
    const text = (msg?.text ?? "").toLowerCase().trim();

    if (groupId && text === "groupid") {
      const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "";
      await fetch("https://api.line.me/v2/bot/message/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          replyToken,
          messages: [{ type: "text", text: `Group ID:\n${groupId}` }],
        }),
      });
    }
    return;
  }

  if (event.type !== "postback") return;

  const replyToken = event.replyToken as string;
  const postback = event.postback as { data: string } | undefined;
  if (!postback?.data) return;

  // Parse query string: action=confirm&id=<uuid>
  const params = new URLSearchParams(postback.data);
  const action = params.get("action");
  const bookingId = params.get("id");

  if (!action || !bookingId) return;

  const supabase = await createServiceClient();

  if (action === "confirm") {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", bookingId)
      .select("*, customer:customers(*), service:services(*)")
      .single();

    if (error) {
      await replyActionResult(replyToken, `❌ เกิดข้อผิดพลาด: ${error.message}`);
      return;
    }

    const booking = data as BookingWithRelations;
    await Promise.allSettled([
      replyActionResult(
        replyToken,
        `✅ ยืนยันแล้ว!\n\n📋 ${booking.booking_code}\n👤 ${booking.customer.first_name} ${booking.customer.last_name}\n📅 ${booking.requested_date}  ${booking.requested_time}\n💆 ${booking.service_name_snapshot}`
      ),
      notifyCustomerConfirmed(booking),
    ]);
    return;
  }

  if (action === "reject") {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "rejected",
        rejection_reason: "คิวเต็ม / Fully booked",
      })
      .eq("id", bookingId)
      .select("*, customer:customers(*), service:services(*)")
      .single();

    if (error) {
      await replyActionResult(replyToken, `❌ เกิดข้อผิดพลาด: ${error.message}`);
      return;
    }

    const booking = data as BookingWithRelations;
    await Promise.allSettled([
      replyActionResult(
        replyToken,
        `❌ ปฏิเสธแล้ว\n\n📋 ${booking.booking_code}\n👤 ${booking.customer.first_name} ${booking.customer.last_name}\n\nลูกค้าได้รับแจ้งเหตุผลแล้ว`
      ),
      notifyCustomerRejected(booking),
    ]);
    return;
  }
}
