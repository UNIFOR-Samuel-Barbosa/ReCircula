create table profiles (
    id uuid primary key,
    name text not null,
    photo_url text,
    biography text,
    telephone text check(length(telephone) <= 20),
    created_at timestamptz default now()
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