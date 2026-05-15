import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { notifyCustomerConfirmed } from "@/lib/line-messaging";
import type { BookingWithRelations } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const supabase = await createServiceClient();

  const { data: existing } = await supabase
    .from("bookings")
    .select("status")
    .eq("id", id)
    .single();

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!["pending", "proposed_new_time"].includes(existing.status)) {
    return NextResponse.json(
      { error: `Cannot confirm booking with status: ${existing.status}` },
      { status: 422 }
    );
  }

  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "confirmed", admin_note: body.admin_note ?? null })
    .eq("id", id)
    .select("*, customer:customers(*), service:services(*)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await notifyCustomerConfirmed(data as BookingWithRelations).catch(console.error);

  return NextResponse.json(data);
}
