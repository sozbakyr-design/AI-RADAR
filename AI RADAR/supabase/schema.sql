
-- 1. Profiles Table (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  interests text[] default '{}',
  subscription_tier text default 'free', -- 'free', 'pro'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Opportunities Table (The core content)
create table public.opportunities (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  type text not null, -- 'opportunity', 'trend', 'business'
  category text not null, -- 'money', 'trends', 'business'
  difficulty text,
  revenue_potential text,
  time_to_start text,
  audience text, -- NEW
  trend_score integer default 0,
  ai_insights jsonb default '{}',
  story jsonb default '{}',
  real_world jsonb default '{}', -- NEW
  tools jsonb default '[]',
  steps text[] default '{}',
  social_proof jsonb default '{}',
  is_premium boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. User Interactions (Tracking likes, saves, completions)
create table public.user_interactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  opportunity_id uuid references public.opportunities(id) not null,
  is_liked boolean default false,
  is_saved boolean default false,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, opportunity_id)
);

-- 4. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.opportunities enable row level security;
alter table public.user_interactions enable row level security;

-- 5. RLS Policies

-- Profiles: Users can view their own profile, maybe public for leaderboards? 
-- Let's say public read for now simplifies things, but edit only own.
create policy "Public profiles are viewable by everyone." 
  on public.profiles for select using ( true );

create policy "Users can insert their own profile." 
  on public.profiles for insert with check ( auth.uid() = id );

create policy "Users can update own profile." 
  on public.profiles for update using ( auth.uid() = id );

-- Opportunities: Public read. Only admin (service role) writes.
create policy "Opportunities are viewable by everyone." 
  on public.opportunities for select using ( true );

-- User Interactions: Users can CRUD their own interactions.
create policy "Users can view own interactions." 
  on public.user_interactions for select using ( auth.uid() = user_id );

create policy "Users can insert own interactions." 
  on public.user_interactions for insert with check ( auth.uid() = user_id );

create policy "Users can update own interactions." 
  on public.user_interactions for update using ( auth.uid() = user_id );

-- 6. Functions & Triggers (Auto-create profile on signup)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Storage (Optional: if we upload images later)
insert into storage.buckets (id, name)
values ('avatars', 'avatars')
on conflict do nothing;

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );
