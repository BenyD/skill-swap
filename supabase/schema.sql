-- Drop existing objects
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

drop table if exists public.notifications;
drop table if exists public.messages;
drop table if exists public.reviews;
drop table if exists public.exchange_sessions;
drop table if exists public.exchange_requests;
drop table if exists public.user_learning_goals;
drop table if exists public.user_skills;
drop table if exists public.skills;
drop table if exists public.skill_categories;
drop table if exists public.users;

drop type if exists notification_type;
drop type if exists exchange_session_status;
drop type if exists exchange_request_status;

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type exchange_request_status as enum ('pending', 'accepted', 'rejected', 'completed');
create type exchange_session_status as enum ('scheduled', 'in_progress', 'completed', 'cancelled');
create type notification_type as enum ('exchange_request', 'exchange_session', 'review', 'message');

-- Create users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  username text unique,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create skill categories table
create table public.skill_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create skills table
create table public.skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category_id uuid references public.skill_categories on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(name, category_id)
);

-- Create user skills table
create table public.user_skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  skill_id uuid references public.skills on delete cascade not null,
  proficiency_level text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, skill_id)
);

-- Create user learning goals table
create table public.user_learning_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  skill_id uuid references public.skills on delete cascade not null,
  current_level text not null,
  target_level text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, skill_id)
);

-- Create exchange requests table
create table public.exchange_requests (
  id uuid default uuid_generate_v4() primary key,
  requester_id uuid references public.users on delete cascade not null,
  requested_id uuid references public.users on delete cascade not null,
  requester_skill_id uuid references public.user_skills on delete cascade not null,
  requested_skill_id uuid references public.user_skills on delete cascade not null,
  status exchange_request_status default 'pending' not null,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create exchange sessions table
create table public.exchange_sessions (
  id uuid default uuid_generate_v4() primary key,
  exchange_request_id uuid references public.exchange_requests on delete cascade not null,
  scheduled_time timestamp with time zone not null,
  duration_minutes integer not null,
  status exchange_session_status default 'scheduled' not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reviews table
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  reviewer_id uuid references public.users on delete cascade not null,
  reviewed_id uuid references public.users on delete cascade not null,
  exchange_session_id uuid references public.exchange_sessions on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(reviewer_id, exchange_session_id)
);

-- Create messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users on delete cascade not null,
  receiver_id uuid references public.users on delete cascade not null,
  exchange_request_id uuid references public.exchange_requests on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create notifications table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  type notification_type not null,
  reference_id uuid not null,
  message text not null,
  is_read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.user_learning_goals enable row level security;
alter table public.exchange_requests enable row level security;
alter table public.exchange_sessions enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- Create function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (
    id,
    full_name,
    username,
    created_at,
    updated_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    now(),
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create RLS policies
-- Users policies
create policy "Users can view all users"
  on public.users for select
  using (true);

create policy "Users can create their profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- Skill categories policies
create policy "Anyone can view skill categories"
  on public.skill_categories for select
  using (true);

-- Skills policies
create policy "Anyone can view skills"
  on public.skills for select
  using (true);

-- User skills policies
create policy "Users can view all user skills"
  on public.user_skills for select
  using (true);

create policy "Users can manage their own skills"
  on public.user_skills for all
  using (auth.uid() = user_id);

-- User learning goals policies
create policy "Users can view all learning goals"
  on public.user_learning_goals for select
  using (true);

create policy "Users can manage their own learning goals"
  on public.user_learning_goals for all
  using (auth.uid() = user_id);

-- Exchange requests policies
create policy "Users can view exchange requests they're involved in"
  on public.exchange_requests for select
  using (auth.uid() = requester_id or auth.uid() = requested_id);

create policy "Users can create exchange requests"
  on public.exchange_requests for insert
  with check (auth.uid() = requester_id);

create policy "Users can update their own exchange requests"
  on public.exchange_requests for update
  using (auth.uid() = requester_id);

-- Exchange sessions policies
create policy "Users can view sessions they're involved in"
  on public.exchange_sessions for select
  using (
    exists (
      select 1 from exchange_requests
      where exchange_requests.id = exchange_sessions.exchange_request_id
      and (exchange_requests.requester_id = auth.uid() or exchange_requests.requested_id = auth.uid())
    )
  );

create policy "Users can create sessions for their requests"
  on public.exchange_sessions for insert
  with check (
    exists (
      select 1 from exchange_requests
      where exchange_requests.id = exchange_sessions.exchange_request_id
      and exchange_requests.requester_id = auth.uid()
    )
  );

-- Reviews policies
create policy "Users can view reviews they're involved in"
  on public.reviews for select
  using (auth.uid() = reviewer_id or auth.uid() = reviewed_id);

create policy "Users can create reviews for completed sessions"
  on public.reviews for insert
  with check (
    exists (
      select 1 from exchange_sessions
      where exchange_sessions.id = reviews.exchange_session_id
      and exchange_sessions.status = 'completed'
    )
  );

-- Messages policies
create policy "Users can view messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from exchange_requests
      where exchange_requests.id = messages.exchange_request_id
      and (exchange_requests.requester_id = auth.uid() or exchange_requests.requested_id = auth.uid())
    )
  );

create policy "Users can send messages in their conversations"
  on public.messages for insert
  with check (
    exists (
      select 1 from exchange_requests
      where exchange_requests.id = messages.exchange_request_id
      and (exchange_requests.requester_id = auth.uid() or exchange_requests.requested_id = auth.uid())
    )
  );

-- Notifications policies
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);