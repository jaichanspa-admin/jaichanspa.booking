import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { notifyCustomerConfirmed } from "@/lib/line-messaging";
import type { BookingWithRelations } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: { accept: boolean } = await request.json();
  const supabase = await createServiceClient();

  const { data: existing } = await supabase
    .from("bookings")
    .select("status, proposed_date, proposed_time, proposed_end_time")
    .eq("id", id)
    .single();

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.status !== "proposed_new_time") {
    return NextResponse.json({ error: "No pending proposal" }, { status: 422 });
  }

  if (body.accept) {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        requested_date: existing.proposed_date,
        requested_time: existing.proposed_time,
        requested_end_time: existing.proposed_end_time,
        proposed_date: null,
        proposed_time: null,
        proposed_end_time: null,
      })
      .eq("id", id)
      .select("*, customer:customers(*), service:services(*)")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await notifyCustomerConfirmed(data as BookingWithRelations).catch(console.error);
    return NextResponse.json(data);
  } else {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  }
}
