
-- Users Table (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  premium_status boolean default false,
  stripe_customer_id text,
  interests text[], -- Array of strings: 'business', 'tech', 'creative'
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login timestamp with time zone
);

-- Opportunities Table (The core content)
create table public.opportunities (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text, -- 'money', 'trends', 'business'
  trend_score integer,
  difficulty text, -- 'Low', 'Medium', 'High'
  revenue_potential text,
  time_to_start text,
  audience text,
  ai_insights jsonb, -- { confidence, sources, discussionExcerpt }
  tools jsonb, -- [{ name, icon }]
  steps jsonb, -- ["Step 1", "Step 2"]
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Progress (Tracking what users have done)
create table public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  opportunity_id uuid references public.opportunities(id) not null,
  status text check (status in ('saved', 'in_progress', 'completed')),
  completed_steps jsonb, -- Array of step indices [0, 1]
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, opportunity_id)
);

-- Payments (Simple transaction log)
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  stripe_session_id text,
  amount integer, -- in cents
  currency text default 'usd',
  status text, -- 'succeeded', 'pending', 'failed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Leads (Email capture)
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  source text default 'homepage',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Likes (Social Proof & Gamification)
create table public.likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  opportunity_id uuid references public.opportunities(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, opportunity_id)
);

-- RLS Policies (Security)
alter table public.users enable row level security;
alter table public.user_progress enable row level security;
alter table public.payments enable row level security;

create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

create policy "Public opportunities are viewable by everyone" on public.opportunities
  for select using (true);

create policy "Users can manage own progress" on public.user_progress
  for all using (auth.uid() = user_id);
