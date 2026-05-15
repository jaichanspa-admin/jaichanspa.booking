import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { getEndTime, canBook } from "@/lib/booking-utils";
import { notifyCustomerProposedTime } from "@/lib/line-messaging";
import type { BookingWithRelations, ProposeTimePayload } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: ProposeTimePayload = await request.json();
  const supabase = await createServiceClient();

  if (!body.proposed_date || !body.proposed_time) {
    return NextResponse.json(
      { error: "proposed_date and proposed_time are required" },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("bookings")
    .select("status, duration_minutes")
    .eq("id", id)
    .single();

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.status === "cancelled") {
    return NextResponse.json({ error: "Cannot modify cancelled booking" }, { status: 422 });
  }

  if (!canBook(body.proposed_time, existing.duration_minutes)) {
    return NextResponse.json(
      { error: "Proposed time would exceed closing time (22:00)" },
      { status: 422 }
    );
  }

  const proposedEndTime = getEndTime(body.proposed_time, existing.duration_minutes);

  const { data, error } = await supabase
    .from("bookings")
    .update({
      status: "proposed_new_time",
      proposed_date: body.proposed_date,
      proposed_time: body.proposed_time,
      proposed_end_time: proposedEndTime,
      admin_note: body.admin_note ?? null,
    })
    .eq("id", id)
    .select("*, customer:customers(*), service:services(*)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const respondUrl = `${appUrl}/booking/respond/${id}`;
  await notifyCustomerProposedTime(data as BookingWithRelations, respondUrl).catch(
    console.error
  );

  return NextResponse.json(data);
}
