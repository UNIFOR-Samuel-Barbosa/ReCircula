-- pgcrypto: usado pelo seed para gerar o hash bcrypt do usuário de demonstração.
create extension if not exists pgcrypto;

create table profiles (
    id uuid primary key default gen_random_uuid(),
    email text not null unique check (email = lower(email)),
    password_hash text not null,
    name text not null,
    photo_url text,
    biography text,
    telephone text check(length(telephone) <= 20),

    role text not null default 'user'
        check (role in ('user', 'admin')),

    created_at timestamptz default now(),

    constraint profiles_biography_length_check
        check (biography is null or length(biography) <= 150)
);

create table announces (
    id uuid primary key,
    user_id uuid not null references profiles(id) on delete cascade,
    image_url text not null,
    title text not null,
    description text,
    category text not null,
    price numeric check(price >= 0),
    donation boolean not null,
    created_at timestamptz default now()
);

-- Sessões da API (tokens de renovação). Guarda apenas o hash do token.
create table refresh_tokens (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    token_hash text not null unique,
    expires_at timestamptz not null,
    revoked_at timestamptz,
    created_at timestamptz not null default now()
);

create index refresh_tokens_user_id_idx on refresh_tokens (user_id);

-- Links de recuperação de senha. Guarda apenas o hash do token.
create table password_resets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    token_hash text not null unique,
    expires_at timestamptz not null,
    used_at timestamptz,
    created_at timestamptz not null default now()
);

create index password_resets_user_id_idx on password_resets (user_id);
