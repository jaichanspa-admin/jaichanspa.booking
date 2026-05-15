-- JAI CHAN SPA Booking System — Initial Schema

-- Enable uuid extension
create extension if not exists "uuid-ossp";

-- Services table
create table public.services (
  id uuid primary key default uuid_generate_v4(),
  category text not null check (category in ('signatures', 'siam_touch', 'beauty', 'packages', 'membership')),
  name_th text not null,
  name_en text not null,
  name_cn text not null,
  description_th text not null default '',
  description_en text not null default '',
  description_cn text not null default '',
  durations jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Customers table
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  line_user_id text unique,
  line_display_name text,
  line_picture_url text,
  first_name text not null,
  last_name text not null,
  nationality text not null,
  phone text not null,
  preferred_language text check (preferred_language in ('th', 'en', 'cn')),
  created_at timestamptz not null default now()
);

-- Bookings table
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  booking_code text not null unique,
  customer_id uuid not null references public.customers(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  service_name_snapshot text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  price_snapshot integer not null check (price_snapshot >= 0),
  requested_date date not null,
  requested_time time not null,
  requested_end_time time not null,
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'proposed_new_time', 'rejected', 'cancelled')
  ),
  proposed_date date,
  proposed_time time,
  proposed_end_time time,
  rejection_reason text,
  admin_note text,
  payment_status text not null default 'not_required' check (
    payment_status in ('not_required', 'pending_payment', 'paid', 'failed', 'refunded')
  ),
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- Indexes
create index idx_bookings_status on public.bookings(status);
create index idx_bookings_requested_date on public.bookings(requested_date);
create index idx_bookings_customer_id on public.bookings(customer_id);
create index idx_bookings_created_at on public.bookings(created_at desc);
create index idx_customers_line_user_id on public.customers(line_user_id);

-- RLS policies
alter table public.services enable row level security;
alter table public.customers enable row level security;
alter table public.bookings enable row level security;

-- Public read for services (customers need to see them)
create policy "Services are publicly readable"
  on public.services for select using (is_active = true);

-- Service role bypass (API routes use service key)
create policy "Service role full access on services"
  on public.services using (true)
  with check (true);

create policy "Service role full access on customers"
  on public.customers using (true)
  with check (true);

create policy "Service role full access on bookings"
  on public.bookings using (true)
  with check (true);
