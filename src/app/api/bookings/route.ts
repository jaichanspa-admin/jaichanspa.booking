import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { generateBookingCode, getEndTime } from "@/lib/booking-utils";
import {
  notifyReceptionNewBooking,
  notifyCustomerBookingReceived,
} from "@/lib/line-messaging";
import type { BookingWithRelations, CreateBookingPayload } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date");
  const search = searchParams.get("search");

  const supabase = await createServiceClient();
  let query = supabase
    .from("bookings")
    .select("*, customer:customers(*), service:services(*)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (date) query = query.eq("requested_date", date);
  if (search) {
    query = query.or(
      `booking_code.ilike.%${search}%,customer.first_name.ilike.%${search}%,customer.last_name.ilike.%${search}%,customer.phone.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body: CreateBookingPayload = await request.json();
  const supabase = await createServiceClient();

  // Upsert customer (match by LINE user ID if present, otherwise create new)
  let customerId: string;
  if (body.line_user_id) {
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("line_user_id", body.line_user_id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("customers")
        .update({
          first_name: body.first_name,
          last_name: body.last_name,
          nationality: body.nationality,
          phone: body.phone,
          preferred_language: body.preferred_language,
          line_display_name: body.line_display_name,
          line_picture_url: body.line_picture_url,
        })
        .eq("id", existing.id);
      customerId = existing.id;
    } else {
      const { data: newCustomer, error: custErr } = await supabase
        .from("customers")
        .insert({
          line_user_id: body.line_user_id,
          line_display_name: body.line_display_name,
          line_picture_url: body.line_picture_url,
          first_name: body.first_name,
          last_name: body.last_name,
          nationality: body.nationality,
          phone: body.phone,
          preferred_language: body.preferred_language ?? "en",
        })
        .select("id")
        .single();
      if (custErr) return NextResponse.json({ error: custErr.message }, { status: 400 });
      customerId = newCustomer.id;
    }
  } else {
    const { data: newCustomer, error: custErr } = await supabase
      .from("customers")
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        nationality: body.nationality,
        phone: body.phone,
        preferred_language: body.preferred_language ?? "en",
      })
      .select("id")
      .single();
    if (custErr) return NextResponse.json({ error: custErr.message }, { status: 400 });
    customerId = newCustomer.id;
  }

  // Fetch service name for snapshot
  const { data: service } = await supabase
    .from("services")
    .select("name_en, name_th, name_cn")
    .eq("id", body.service_id)
    .single();

  const endTime = getEndTime(body.requested_time, body.duration_minutes);
  const bookingCode = generateBookingCode();

  const { data: booking, error: bookingErr } = await supabase
    .from("bookings")
    .insert({
      booking_code: bookingCode,
      customer_id: customerId,
      service_id: body.service_id,
      service_name_snapshot: service?.name_en ?? "Service",
      duration_minutes: body.duration_minutes,
      price_snapshot: body.price,
      requested_date: body.requested_date,
      requested_time: body.requested_time,
      requested_end_time: endTime,
      status: "pending",
      payment_status: "not_required",
    })
    .select("*, customer:customers(*), service:services(*)")
    .single();

  if (bookingErr) return NextResponse.json({ error: bookingErr.message }, { status: 400 });

  const fullBooking = booking as BookingWithRelations;

  // Fire-and-forget notifications
  await Promise.allSettled([
    notifyReceptionNewBooking(fullBooking),
    notifyCustomerBookingReceived(fullBooking),
  ]);

  return NextResponse.json(fullBooking, { status: 201 });
}
