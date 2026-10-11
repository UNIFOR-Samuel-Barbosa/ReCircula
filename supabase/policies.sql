alter table profiles enable row level security;

alter table announces enable row level security;

create policy "Public profiles are viewable"

on profiles

for select

using (true);

create policy "Users update own profile"

on profiles

for update

using (auth.uid() = id);

create policy "Public announces"

on announces

for select

using (true);

create policy "Users insert own announces"

on announces

for insert

with check(auth.uid() = user_id);

create policy "Users update own announces"

on announces

for update

using(auth.uid() = user_id);

create policy "Users delete own announces"

on announces

for delete

using(auth.uid() = user_id);