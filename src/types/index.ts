export type Language = "th" | "en" | "cn";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "proposed_new_time"
  | "rejected"
  | "cancelled";

export type PaymentStatus =
  | "not_required"
  | "pending_payment"
  | "paid"
  | "failed"
  | "refunded";

export type ServiceCategory =
  | "signatures"
  | "siam_touch"
  | "beauty"
  | "packages"
  | "membership";

export interface ServiceDuration {
  minutes: number;
  price: number;
}

export interface Service {
  id: string;
  category: ServiceCategory;
  name_th: string;
  name_en: string;
  name_cn: string;
  description_th: string;
  description_en: string;
  description_cn: string;
  durations: ServiceDuration[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  line_user_id: string | null;
  line_display_name: string | null;
  line_picture_url: string | null;
  first_name: string;
  last_name: string;
  nationality: string;
  phone: string;
  preferred_language: Language | null;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_code: string;
  customer_id: string;
  service_id: string;
  service_name_snapshot: string;
  duration_minutes: number;
  price_snapshot: number;
  requested_date: string;
  requested_time: string;
  requested_end_time: string;
  status: BookingStatus;
  proposed_date: string | null;
  proposed_time: string | null;
  proposed_end_time: string | null;
  rejection_reason: string | null;
  admin_note: string | null;
  payment_status: PaymentStatus;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  service?: Service;
}

export interface BookingWithRelations extends Booking {
  customer: Customer;
  service: Service;
}

export interface CreateBookingPayload {
  service_id: string;
  duration_minutes: number;
  price: number;
  requested_date: string;
  requested_time: string;
  first_name: string;
  last_name: string;
  nationality: string;
  phone: string;
  line_user_id?: string;
  line_display_name?: string;
  line_picture_url?: string;
  preferred_language?: Language;
}

export interface ProposeTimePayload {
  proposed_date: string;
  proposed_time: string;
  admin_note?: string;
}

export interface RejectBookingPayload {
  rejection_reason: string;
  admin_note?: string;
}

export interface ConfirmBookingPayload {
  admin_note?: string;
}
