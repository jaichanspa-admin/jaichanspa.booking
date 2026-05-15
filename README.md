# JAI CHAN SPA — Online Booking System

MVP booking system for **JAI CHAN SPA**, Siam Discovery Bangkok.

Flow: Customer submits request → Reception reviews → Confirm / Propose New Time / Reject → Customer notified via LINE.

---

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (brand-matched design system)
- **Supabase** (PostgreSQL + Auth)
- **LINE LIFF** (customer identity from LINE OA)
- **LINE Messaging API** (notifications to customer + reception group)
- **Vercel** (deploy target)

---

## Quick Start

### 1. Clone & install

```bash
cd jai-chan-booking
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Fill in: SUPABASE keys, LINE keys, APP_URL
```

> **Dev mode without LINE**: leave `LINE_CHANNEL_ACCESS_TOKEN` empty.
> All LINE messages will print to console instead.

### 3. Set up Supabase

In your Supabase project SQL editor, run both migrations in order:

```
supabase/migrations/001_initial.sql   — schema
supabase/migrations/002_seed_services.sql — service catalog
```

Or with the Supabase CLI:
```bash
supabase db push
```

### 4. Run locally

```bash
npm run dev
# → http://localhost:3000
```

---

## Pages

| Route | Description |
|---|---|
| `/booking` | Customer booking form (4-step wizard) |
| `/booking/success` | Booking submitted confirmation |
| `/booking/respond/[id]` | Customer accepts/declines proposed new time |
| `/admin/bookings` | Reception: all bookings with filters |
| `/admin/bookings/[id]` | Reception: booking detail + actions |
| `/admin/services` | Reception: enable/disable services |

---

## Booking Flow

```
Customer submits → status: pending
  ↓ Reception confirms → status: confirmed → LINE notification to customer
  ↓ Reception proposes → status: proposed_new_time → LINE link sent
      ↓ Customer accepts → status: confirmed
      ↓ Customer declines → status: cancelled
  ↓ Reception rejects → status: rejected → LINE notification to customer
```

---

## LINE Integration

### LIFF Setup
1. LINE Developers Console → Create a LIFF app
2. Set endpoint URL to `https://your-app.vercel.app/booking`
3. Copy the LIFF ID to `NEXT_PUBLIC_LIFF_ID`

### Reception Notification Group
1. Add your LINE bot to the reception group chat
2. Send any message in the group
3. Check your webhook logs for `event.source.groupId`
4. Set `LINE_RECEPTION_GROUP_ID` to that value

### LINE Rich Menu Button
Set the rich menu action to open LIFF URL:
```
https://liff.line.me/YOUR_LIFF_ID
```

---

## Booking Logic

- Shop open: **10:00 – 22:00, every day**
- Time slots: every **30 minutes**
- Validation: `start + duration ≤ 22:00` (service must finish before closing)
- Booking window: today → 60 days ahead

---

## Services (from menu)

16 services loaded across 5 categories:

- **JAI CHAN Signatures** (4): ASMR Regal Thai Serenity L/M/S, JAI CHAN Hair Spa
- **Siam Touch Therapy** (6): Aroma, Thai Heritage, Herbal Compress, Foot & Calf, Shoulder & Neck, Thai Floral Balm
- **Beauty Service** (3): Royal Thai Facial, Golden Glow Body Polish, Thai Herbal Body Wrap
- **Packages** (3): Thai Bliss Detox, Royal Thai Pampering, Serenity & Glow

All services with multilingual names/descriptions (TH / EN / CN).

---

## Deploy to Vercel

```bash
vercel deploy
# Set environment variables in Vercel dashboard
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role (for API routes) |
| `NEXT_PUBLIC_LIFF_ID` | Optional | LINE LIFF ID (skipped if absent) |
| `LINE_CHANNEL_ACCESS_TOKEN` | Optional | LINE bot token (mocked if absent) |
| `LINE_RECEPTION_GROUP_ID` | Optional | LINE group for reception alerts |
| `NEXT_PUBLIC_APP_URL` | Optional | Your domain (for respond links) |

---

## Future Upgrades (Phase 2)

- Auto-confirm when therapist + room capacity available
- Therapist scheduling system
- Package / voucher purchase with payment gateway (Omise / 2C2P)
- Google Calendar sync
- Analytics dashboard (revenue, utilization, conversion)
