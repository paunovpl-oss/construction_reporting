create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_admin_user(target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = coalesce(target_user_id, auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.is_admin_initialized()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where role = 'admin'
  );
$$;

create or replace function public.assign_first_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  already_initialized boolean;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select public.is_admin_initialized() into already_initialized;

  if already_initialized then
    return false;
  end if;

  insert into public.user_roles (user_id, role)
  values (current_user_id, 'admin')
  on conflict (user_id) do update set role = 'admin';

  return true;
end;
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

alter table public.user_roles enable row level security;

create policy user_roles_select_policy on public.user_roles
for select to authenticated
using (
  user_id = auth.uid() or public.is_admin_user(auth.uid())
);

grant execute on function public.is_admin_user(uuid) to authenticated;
grant execute on function public.is_admin_initialized() to anon, authenticated;
grant execute on function public.assign_first_admin() to authenticated;
