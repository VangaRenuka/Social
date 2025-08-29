-- Supabase SQL schema for SocialConnect

-- roles
create type user_role as enum ('user', 'admin');

-- users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  username text unique not null,
  password_hash text not null,
  first_name text,
  last_name text,
  role user_role not null default 'user',
  is_active boolean not null default true,
  email_verified boolean not null default false,
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- email verification tokens
create table if not exists email_verification_tokens (
  user_id uuid not null references users(id) on delete cascade,
  token text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  primary key (user_id, token)
);

-- profiles
create type profile_visibility as enum ('public', 'private', 'followers_only');

create table if not exists profiles (
  user_id uuid primary key references users(id) on delete cascade,
  bio text check (char_length(bio) <= 160),
  avatar_url text,
  website text,
  location text,
  visibility profile_visibility not null default 'public',
  followers_count int not null default 0,
  following_count int not null default 0,
  posts_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- password reset tokens
create table if not exists password_reset_tokens (
  user_id uuid not null references users(id) on delete cascade,
  token text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  primary key (user_id, token)
);

-- posts
create type post_category as enum ('general','announcement','question');

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references users(id) on delete cascade,
  content text not null check (char_length(content) <= 280),
  image_url text,
  category post_category not null default 'general',
  is_active boolean not null default true,
  like_count int not null default 0,
  comment_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- revoked refresh tokens (blacklist)
create table if not exists revoked_tokens (
  token text primary key,
  user_id uuid not null references users(id) on delete cascade,
  revoked_at timestamptz not null default now()
);

-- follows
create table if not exists follows (
  follower uuid not null references users(id) on delete cascade,
  following uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower, following)
);

-- likes
create table if not exists likes (
  user_id uuid not null references users(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

-- comments
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  content text not null check (char_length(content) <= 200),
  author_id uuid not null references users(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- notifications
create type notification_type as enum ('follow','like','comment');

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  recipient uuid not null references users(id) on delete cascade,
  sender uuid not null references users(id) on delete cascade,
  notification_type notification_type not null,
  post_id uuid references posts(id) on delete set null,
  message text not null check (char_length(message) <= 200),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);


