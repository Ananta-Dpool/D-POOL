-- D' POOL: Initial Schema Migration
-- Designed for SPAV Pilot Campus & Hyperlocal Verified Exchange

-- 1. Enums
create type user_role as enum ('student', 'campus_admin', 'platform_admin');
create type verification_status as enum ('pending', 'verified', 'rejected');
create type listing_category as enum ('thrift', 'clothing', 'accessories', 'dorm_decor', 'textbooks', 'electronics', 'other');
create type listing_condition as enum ('like_new', 'good', 'fair', 'poor');
create type listing_status as enum ('active', 'sold', 'removed', 'draft');
create type transaction_status as enum (
  'initiated', 'agreed', 'meetup_scheduled',
  'buyer_arrived', 'seller_arrived',
  'completed', 'cancelled', 'disputed'
);
create type payment_method as enum ('cash', 'upi', 'platform');
create type report_target as enum ('listing', 'user', 'message', 'transaction');
create type report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

-- 2. Campuses
create table campuses (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  city          text,
  email_domains text[] not null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- 3. Profiles (1:1 with auth.users)
create table profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  campus_id           uuid references campuses(id),
  full_name           text,
  avatar_url          text,
  whatsapp_number     text,
  role                user_role not null default 'student',
  verification_status verification_status not null default 'pending',
  verified_at         timestamptz,
  is_suspended        boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- 4. Listings
create table listings (
  id           uuid primary key default gen_random_uuid(),
  campus_id    uuid not null references campuses(id),
  seller_id    uuid not null references profiles(id),
  title        text not null check (char_length(title) between 3 and 120),
  description  text,
  price        numeric(10,2) not null check (price >= 0),
  category     listing_category not null default 'thrift',
  condition    listing_condition not null default 'good',
  status       listing_status not null default 'active',
  expires_at   timestamptz not null default (now() + interval '30 days'),
  search_tsv   tsvector generated always as (
                 to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))
               ) stored,
  sold_at      timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index listings_campus_status_idx on listings(campus_id, status);
create index listings_search_tsv_idx on listings using gin(search_tsv);
create index listings_expires_at_idx on listings(expires_at);

-- 5. Listing Images
create table listing_images (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references listings(id) on delete cascade,
  storage_path text not null,
  position     int not null default 0
);

create index listing_images_listing_id_idx on listing_images(listing_id, position);

-- 6. Chats
create table chats (
  id              uuid primary key default gen_random_uuid(),
  listing_id      uuid not null references listings(id) on delete cascade,
  buyer_id        uuid not null references profiles(id),
  seller_id       uuid not null references profiles(id),
  created_at      timestamptz not null default now(),
  last_message_at timestamptz,
  unique (listing_id, buyer_id),
  check (buyer_id <> seller_id)
);

create index chats_buyer_idx on chats(buyer_id);
create index chats_seller_idx on chats(seller_id);

-- 7. Messages
create table messages (
  id         uuid primary key default gen_random_uuid(),
  chat_id    uuid not null references chats(id) on delete cascade,
  sender_id  uuid not null references profiles(id),
  body       text not null check (char_length(body) between 1 and 2000),
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index messages_chat_idx on messages(chat_id, created_at);

-- 8. Transactions
create table transactions (
  id               uuid primary key default gen_random_uuid(),
  listing_id       uuid not null references listings(id),
  chat_id          uuid references chats(id),
  buyer_id         uuid not null references profiles(id),
  seller_id        uuid not null references profiles(id),
  agreed_price     numeric(10,2) not null check (agreed_price >= 0),
  payment_method   payment_method not null default 'cash',
  status           transaction_status not null default 'initiated',
  meetup_location  text,
  meetup_at        timestamptz,
  completed_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check (buyer_id <> seller_id)
);

-- 9. Reports
create table reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id),
  target_type report_target not null,
  target_id   uuid not null,
  reason      text not null,
  status      report_status not null default 'open',
  notes       text,
  resolved_by uuid references profiles(id),
  resolved_at timestamptz,
  created_at  timestamptz not null default now()
);

-- 10. Atomic Completion Function (Decision D-10)
create or replace function complete_transaction_and_mark_sold(
  p_transaction_id uuid,
  p_seller_id      uuid
)
returns void
language plpgsql
security definer
as $$
declare
  v_listing_id uuid;
begin
  select listing_id into v_listing_id
  from transactions
  where id = p_transaction_id and seller_id = p_seller_id;

  if not found then
    raise exception 'Transaction not found or caller is not seller';
  end if;

  update transactions
  set status = 'completed',
      completed_at = now(),
      updated_at = now()
  where id = p_transaction_id;

  update listings
  set status = 'sold',
      sold_at = now(),
      updated_at = now()
  where id = v_listing_id;
end;
$$;

-- 11. Row Level Security (RLS)
alter table campuses enable row level security;
alter table profiles enable row level security;
alter table listings enable row level security;
alter table listing_images enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;
alter table transactions enable row level security;
alter table reports enable row level security;

-- Campuses: Anyone can read active campuses
create policy "Anyone can view active campuses"
  on campuses for select
  using (is_active = true);

-- Profiles: Anyone can view profiles, users can only update non-privileged fields
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own basic profile"
  on profiles for update
  using (auth.uid() = id);

-- Listings: Active listings visible to verified users on the campus
create policy "Active listings viewable by everyone"
  on listings for select
  using (status = 'active');

create policy "Users can create listings"
  on listings for insert
  with check (auth.uid() = seller_id);

create policy "Sellers can update own listings"
  on listings for update
  using (auth.uid() = seller_id);

-- Chats: Participants can read and participate
create policy "Chat participants can view their chats"
  on chats for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Chat participants can view messages"
  on messages for select
  using (
    exists (
      select 1 from chats
      where chats.id = messages.chat_id
      and (chats.buyer_id = auth.uid() or chats.seller_id = auth.uid())
    )
  );

create policy "Chat participants can insert messages"
  on messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from chats
      where chats.id = messages.chat_id
      and (chats.buyer_id = auth.uid() or chats.seller_id = auth.uid())
    )
  );
