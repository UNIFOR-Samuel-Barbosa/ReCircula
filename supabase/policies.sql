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

-- Impede alterações gerais na tabela por usuários autenticados.
revoke update on table public.profiles
from authenticated;

-- Permite atualizar somente os campos editáveis do perfil.
grant update (
    name,
    photo_url,
    biography,
    telephone
)
on table public.profiles
to authenticated;


-- Criar uma verificação confiável de administrador
create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles
        where id = (select auth.uid())
          and role = 'admin'
    );
$$;

revoke all on function private.is_admin() from public;

grant usage on schema private to authenticated;

grant execute on function private.is_admin()
to authenticated;

create policy "Admins delete any announce"
on public.announces
for delete
to authenticated
using ((select private.is_admin()));
-- Autenticação própria da API (backend/auth)
-- Tabelas de sessão e recuperação de senha: só o backend (service role) acessa.
alter table refresh_tokens enable row level security;

alter table password_resets enable row level security;

-- profiles agora guarda email e password_hash. A policy pública acima continua
-- valendo, mas a chave pública só pode ler as colunas de apresentação/contato.
revoke select on table public.profiles
from anon, authenticated;

grant select (
    id,
    name,
    photo_url,
    biography,
    telephone,
    role,
    created_at
)
on table public.profiles
to anon, authenticated;
