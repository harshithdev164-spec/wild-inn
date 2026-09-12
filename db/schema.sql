-- Wild Inn — Reels
-- Run this once against your Neon database (SQL editor or `psql "$DATABASE_URL" -f db/schema.sql`).
-- Neon only stores reel metadata + the playback URL. The video files themselves live on a
-- video CDN (Mux, Cloudflare Stream, etc.) — put the playback URL in `video_url`.

create extension if not exists "pgcrypto";

create table if not exists reels (
  id            text primary key default gen_random_uuid()::text,  -- a short slug (e.g. 'kabini-dawn') or an auto UUID
  title         text        not null,
  tour_slug     text,                              -- optional: matches a slug in destinationsData.ts (e.g. 'kabini')
  location      text,                              -- e.g. 'Kabini, Karnataka'
  description   text,
  video_url     text        not null,             -- Mux/CF Stream URL. .mp4 => played directly; .m3u8 => hls.js
  poster_url    text,                              -- thumbnail shown before playback
  duration_sec  integer     not null default 30,
  aspect_ratio  text        not null default '9:16',
  sort_order    integer     not null default 0,
  published     boolean     not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists reels_feed_idx on reels (published, sort_order, created_at desc);

-- ---------------------------------------------------------------------------
-- Payments: coupons + orders  (Razorpay)
-- ---------------------------------------------------------------------------

create table if not exists coupons (
  code        text primary key,                              -- stored UPPERCASE, e.g. 'WILDNDF@25'
  percent     integer not null check (percent between 1 and 90),
  owner       text,                                          -- who the code belongs to
  active      boolean not null default true,
  max_uses    integer,                                       -- null = unlimited
  uses        integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists orders (
  id                   text primary key default gen_random_uuid()::text,
  razorpay_order_id    text unique not null,
  razorpay_payment_id  text,
  slug                 text not null,                        -- destination id
  package_name         text not null,
  unit                 text,                                 -- 'Per Head' | 'Per Couple' | ...
  adults               integer not null default 1,
  children             integer not null default 0,           -- total children (any age)
  children_under10     integer not null default 0,           -- subset of `children` charged 50% (age < 10)
  base_amount          integer not null,                     -- paise, before discount
  coupon_code          text,
  discount_amount      integer not null default 0,           -- paise
  amount               integer not null,                     -- paise, actually charged
  currency             text not null default 'INR',
  customer_name        text,
  customer_email       text,
  customer_phone       text,
  check_in_date        date,
  check_out_date       date,
  status               text not null default 'created',      -- created | paid | failed
  created_at           timestamptz not null default now(),
  paid_at              timestamptz
);

-- Migration for a DB created before check-in/check-out existed (safe to re-run).
do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'travel_date')
     and not exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'check_in_date') then
    alter table orders rename column travel_date to check_in_date;
  end if;
end $$;
alter table orders add column if not exists check_out_date date;
alter table orders add column if not exists children_under10 integer not null default 0;

create index if not exists orders_recent_idx on orders (created_at desc);
create index if not exists orders_coupon_idx on orders (coupon_code);

-- Editable package catalogue. Seeded from src/data/destinationsData.ts, then edited
-- from the /admin panel. The payment quote reads price from here (falling back to
-- server/pricing.json when the row is missing or the DB is unreachable).
create table if not exists packages (
  slug         text    not null,                         -- destination id (kabini, periyar, …)
  name         text    not null,                         -- package name, unique within a destination
  destination  text,                                     -- display name of the destination
  price        integer not null check (price between 100 and 100000000),  -- paise
  unit         text    not null default 'Per Head',      -- 'Per Head' | 'Per Couple' | …
  duration     text    not null default '2 Days • 1 Night',
  sort_order   integer not null default 0,
  active       boolean not null default true,
  updated_at   timestamptz not null default now(),
  primary key (slug, name)
);

-- Example rows (delete these once you add your own):
-- insert into reels (title, tour_slug, location, description, video_url, poster_url, sort_order) values
--   ('Dawn on the backwaters', 'kabini', 'Kabini, Karnataka', 'First light, and the forest starts to move.',
--    'https://stream.mux.com/PLAYBACK_ID/high.mp4', 'https://image.mux.com/PLAYBACK_ID/thumbnail.jpg?time=1', 10),
--   ('Tuskers at the treeline', 'bandipur', 'Bandipur, Karnataka', 'A herd crosses the fire line at dusk.',
--    'https://stream.mux.com/PLAYBACK_ID2/high.mp4', 'https://image.mux.com/PLAYBACK_ID2/thumbnail.jpg?time=1', 20);
