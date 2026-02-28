create table public.uom (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  symbol text not null,
  base_uom_id uuid references public.uom(id) on delete set null,
  factor_to_base numeric(18, 6) not null default 1 check (factor_to_base > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index uom_symbol_unique_idx on public.uom ((lower(btrim(symbol))));

create trigger uom_set_updated_at
before update on public.uom
for each row execute function public.set_updated_at();

alter table public.uom enable row level security;

create policy uom_authenticated_all on public.uom
for all to authenticated
using (true)
with check (true);

insert into public.uom (name, symbol, factor_to_base)
select distinct i.default_unit, i.default_unit, 1
from public.items i
on conflict ((lower(btrim(symbol)))) do nothing;

alter table public.items
add column uom_id uuid references public.uom(id) on delete restrict;

update public.items i
set uom_id = u.id
from public.uom u
where lower(btrim(u.symbol)) = lower(btrim(i.default_unit));

alter table public.items
alter column uom_id set not null;

create index items_uom_id_idx on public.items(uom_id);

create table public.stage_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  stage_id uuid references public.stages(id) on delete set null,
  item_id uuid not null references public.items(id) on delete restrict,
  uom_id uuid not null references public.uom(id) on delete restrict,
  planned_quantity numeric(14, 3) not null check (planned_quantity >= 0),
  budget_unit_price numeric(14, 2) check (budget_unit_price >= 0),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.stage_items (
  project_id,
  stage_id,
  item_id,
  uom_id,
  planned_quantity,
  notes,
  created_at,
  updated_at
)
select
  eq.project_id,
  eq.stage_id,
  eq.item_id,
  i.uom_id,
  eq.estimated_quantity,
  eq.notes,
  eq.created_at,
  eq.updated_at
from public.estimated_quantities eq
join public.items i on i.id = eq.item_id;

create index stage_items_project_id_idx on public.stage_items(project_id);
create index stage_items_stage_id_idx on public.stage_items(stage_id);
create index stage_items_item_id_idx on public.stage_items(item_id);

create trigger stage_items_set_updated_at
before update on public.stage_items
for each row execute function public.set_updated_at();

alter table public.stage_items enable row level security;

create policy stage_items_authenticated_all on public.stage_items
for all to authenticated
using (true)
with check (true);

alter table public.purchase_orders
add column attachment_path text;

alter table public.purchase_order_lines
add column line_total numeric(14, 2)
generated always as (coalesce(quantity, 0)::numeric * coalesce(unit_price, 0)::numeric) stored;

create table public.bills (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  bill_number text not null unique,
  vendor_name text not null,
  bill_date date not null,
  attachment_path text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.bill_lines (
  id uuid primary key default gen_random_uuid(),
  bill_id uuid not null references public.bills(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete restrict,
  purchase_order_line_id uuid references public.purchase_order_lines(id) on delete set null,
  delivery_note_line_id uuid references public.delivery_note_lines(id) on delete set null,
  quantity numeric(14, 3) not null check (quantity > 0),
  unit_price numeric(14, 2) not null check (unit_price >= 0),
  total_price numeric(14, 2) generated always as (quantity::numeric * unit_price::numeric) stored,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index bills_project_id_idx on public.bills(project_id);
create index bill_lines_bill_id_idx on public.bill_lines(bill_id);
create index bill_lines_item_id_idx on public.bill_lines(item_id);
create index bill_lines_purchase_order_line_id_idx on public.bill_lines(purchase_order_line_id);
create index bill_lines_delivery_note_line_id_idx on public.bill_lines(delivery_note_line_id);

create trigger bills_set_updated_at
before update on public.bills
for each row execute function public.set_updated_at();

create trigger bill_lines_set_updated_at
before update on public.bill_lines
for each row execute function public.set_updated_at();

alter table public.bills enable row level security;
alter table public.bill_lines enable row level security;

create policy bills_authenticated_all on public.bills
for all to authenticated
using (true)
with check (true);

create policy bill_lines_authenticated_all on public.bill_lines
for all to authenticated
using (true)
with check (true);

create type public.app_role_v2 as enum ('site_manager', 'project_manager', 'designer', 'contractor', 'accountant');

alter table public.user_roles
alter column role drop default;

alter table public.user_roles
alter column role type public.app_role_v2
using (
  case role::text
    when 'admin' then 'project_manager'
    when 'user' then 'contractor'
    else 'contractor'
  end
)::public.app_role_v2;

drop type public.app_role;
alter type public.app_role_v2 rename to app_role;

alter table public.user_roles
alter column role set default 'contractor';

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
      and role in ('project_manager', 'site_manager')
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
    where role in ('project_manager', 'site_manager')
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
  values (current_user_id, 'project_manager')
  on conflict (user_id) do update set role = 'project_manager';

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
  values (new.id, 'contractor')
  on conflict (user_id) do nothing;

  return new;
end;
$$;
