-- ═══════════════════════════════════════════════════════════════════════════
-- ClubCraft — Supabase schema, RLS, profile trigger, seed data
-- Run this ONCE in the Supabase SQL Editor (dashboard → SQL Editor → New query)
-- Idempotent: safe to run twice.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. TABLES ───────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.workshops (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null default '',
  speaker     text not null,
  role        text not null default 'SESSION',
  location    text not null,
  dur         text not null default '45 min',
  starts_at   timestamptz not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.registrations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  workshop_id uuid not null references public.workshops(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, workshop_id)
);

-- ── 2. ROW LEVEL SECURITY ───────────────────────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.workshops     enable row level security;
alter table public.registrations enable row level security;

-- profiles: you read and edit your own
drop policy if exists "read own profile"    on public.profiles;
drop policy if exists "insert own profile"  on public.profiles;
drop policy if exists "update own profile"  on public.profiles;
create policy "read own profile"   on public.profiles for select using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);

-- workshops: public catalog — anyone (even signed-out) can read
drop policy if exists "public read workshops" on public.workshops;
create policy "public read workshops" on public.workshops for select using (true);

-- registrations: scoped to their owner
drop policy if exists "read own registrations"   on public.registrations;
drop policy if exists "insert own registration"  on public.registrations;
create policy "read own registrations" on public.registrations
  for select using (auth.uid() = user_id);
create policy "insert own registration" on public.registrations
  for insert with check (auth.uid() = user_id);

-- ── 3. AUTO-CREATE PROFILE ON SIGNUP ────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 4. SEED — the six demo sessions (canonical list from the prototype) ────
-- Future-facing for ~2 weeks from today; shift if you seed later.
insert into public.workshops (title, description, speaker, role, location, dur, starts_at) values
  ('Shipping the Golden Path',  'How we froze the stack on day one, drew the state matrix before the screens, and built in demo order — login, gate, grid, button. The unglamorous decisions that make a demo boring, in the best possible way.', 'Maya Okafor',       'Core · API',         'Forge Hall — Stage A', '45 min', now() + interval '2 days'  + interval '17 hours 30 minutes'),
  ('The Optimistic Interface',  'Flip the button first, reconcile later. A field guide to optimistic UI: instant flips, 409s that are not errors, and reverting with grace when the network disagrees with your confidence.',                    'Dev Ramanan',       'Surface · Frontend', 'Forge Hall — Stage A', '40 min', now() + interval '4 days'  + interval '18 hours'),
  ('Auth Without Tears',        'Sessions without ceremony. Email and password done properly, inline validation that respects the person typing, and the tiny ?next= trick that makes redirects feel like magic instead of punishment.',        'Lena Vogt',         'Core · Auth',        'Workshop Bay 2',       '50 min', now() + interval '6 days'  + interval '17 hours 30 minutes'),
  ('Designing at 375 Pixels',   'One primary action per screen, contrast you can read in a bright hall, focus rings you can see in the dark. Mobile-first is not a constraint — it is the floor everything else stands on.',                    'Sofia Marchetti',   'Surface · Design',   'Workshop Bay 2',       '40 min', now() + interval '9 days'  + interval '16 hours'),
  ('States Are the Product',    'Loading, empty, error, success — four states per view, no exceptions. Why the empty state deserves real copy, the error state deserves an apology, and the success state deserves a stamp.',                    'Jonas Feld',        'Surface · Frontend', 'Forge Hall — Stage B', '45 min', now() + interval '12 days' + interval '17 hours 30 minutes'),
  ('Demo Day Rehearsal',        'The full run: no typing live, no fresh signups, console clean from load to logout. We click the golden path until it clicks back. Bring your demo hat and your most pessimistic teammate.',                    'The ClubCraft Crew','All lanes',          'Main Floor',           '90 min', now() + interval '15 days' + interval '18 hours 30 minutes');

-- ── 5. DEMO LOGIN (optional but recommended) ────────────────────────────────
-- Password below is 'demo12345'. Create the user in dashboard → Authentication
-- → Users → "Add user" with email demo@clubcraft.test, then run:
-- update auth.users set email_confirmed_at = now() where email = 'demo@clubcraft.test';
