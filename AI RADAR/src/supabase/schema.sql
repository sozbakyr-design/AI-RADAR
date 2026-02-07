
-- AI RADAR DATABASE SCHEMA

-- 1. Profiles Table (Extends Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  is_premium boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Opportunities Table (The Core Content)
create table public.opportunities (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text not null, -- 'money', 'trends', 'business'
  difficulty text, -- 'Düşük', 'Orta', 'Yüksek'
  revenue_potential text,
  time_to_start text,
  audience text,
  trend_score integer default 50,
  
  -- JSON Fields for complex data
  ai_insights jsonb, -- { confidence: 98, sources: [], discussionExcerpt: '' }
  story jsonb, -- { person: '', role: '', earnings: '', quote: '', image: '' }
  real_world jsonb, -- { companies: [], event: '' }
  tools jsonb, -- [{ name: '', icon: '' }]
  steps jsonb, -- ['Step 1', 'Step 2']
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_published boolean default true
);

-- 3. User Interactions (Progress, Likes, Saves)
create table public.user_interactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  opportunity_id uuid references public.opportunities(id) not null,
  
  is_liked boolean default false,
  is_saved boolean default false,
  status text default 'new', -- 'new', 'in_progress', 'completed'
  current_step integer default 0,
  
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(user_id, opportunity_id)
);

-- 4. RLS Policies (Security)
alter table public.profiles enable row level security;
alter table public.opportunities enable row level security;
alter table public.user_interactions enable row level security;

-- Profiles: Public read (for leaderboards), Owner write
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Opportunities: Public read, Admin write (check email or role)
create policy "Opportunities are viewable by everyone." on public.opportunities for select using (true);
create policy "Admins can insert opportunities." on public.opportunities for insert with check (auth.jwt() ->> 'email' = 'admin@airadar.com'); -- Replace with your email or role logic
create policy "Admins can update opportunities." on public.opportunities for update using (auth.jwt() ->> 'email' = 'admin@airadar.com');

-- Interactions: Owner only
create policy "Users can view own interactions." on public.user_interactions for select using (auth.uid() = user_id);
create policy "Users can insert own interactions." on public.user_interactions for insert with check (auth.uid() = user_id);
create policy "Users can update own interactions." on public.user_interactions for update using (auth.uid() = user_id);

-- 5. Triggers
-- Auto-create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
