import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { notifyCustomerRejected } from "@/lib/line-messaging";
import type { BookingWithRelations, RejectBookingPayload } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: RejectBookingPayload = await request.json();

  if (!body.rejection_reason) {
    return NextResponse.json(
      { error: "rejection_reason is required" },
      { status: 400 }
    );
  }

  const supabase = await createServiceClient();
  const { data: existing } = await supabase
    .from("bookings")
    .select("status")
    .eq("id", id)
    .single();

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.status === "cancelled") {
    return NextResponse.json({ error: "Cannot modify cancelled booking" }, { status: 422 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({
      status: "rejected",
      rejection_reason: body.rejection_reason,
      admin_note: body.admin_note ?? null,
    })
    .eq("id", id)
    .select("*, customer:customers(*), service:services(*)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await notifyCustomerRejected(data as BookingWithRelations).catch(console.error);

  return NextResponse.json(data);
}
