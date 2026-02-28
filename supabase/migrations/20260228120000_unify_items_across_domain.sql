create table public.items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  default_unit text not null,
  name_key text generated always as (lower(btrim(name))) stored,
  default_unit_key text generated always as (lower(btrim(default_unit))) stored,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (name_key, default_unit_key)
);

create trigger items_set_updated_at
before update on public.items
for each row execute function public.set_updated_at();

alter table public.items enable row level security;

create policy items_authenticated_all on public.items
for all to authenticated
using (true)
with check (true);

alter table public.estimated_quantities
add column item_id uuid references public.items(id) on delete restrict;

insert into public.items (name, default_unit)
select distinct source.item_name, source.unit
from (
  select btrim(item_name) as item_name, btrim(unit) as unit
  from public.estimated_quantities
  union
  select btrim(item_name) as item_name, btrim(unit) as unit
  from public.purchase_order_items
  union
  select btrim(item_name) as item_name, btrim(unit) as unit
  from public.delivery_note_items
) as source
on conflict (name_key, default_unit_key) do nothing;

update public.estimated_quantities eq
set item_id = i.id
from public.items i
where i.name_key = lower(btrim(eq.item_name))
  and i.default_unit_key = lower(btrim(eq.unit));

alter table public.estimated_quantities
alter column item_id set not null;

create index estimated_quantities_item_id_idx on public.estimated_quantities(item_id);

create table public.purchase_order_lines (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
  estimated_quantity_id uuid references public.estimated_quantities(id) on delete set null,
  item_id uuid not null references public.items(id) on delete restrict,
  quantity numeric(14, 3) not null check (quantity > 0),
  unit_price numeric(14, 2) check (unit_price >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.purchase_order_lines (
  id,
  purchase_order_id,
  estimated_quantity_id,
  item_id,
  quantity,
  unit_price,
  created_at,
  updated_at
)
select
  poi.id,
  poi.purchase_order_id,
  poi.estimated_quantity_id,
  i.id,
  poi.quantity,
  poi.unit_price,
  poi.created_at,
  poi.updated_at
from public.purchase_order_items poi
join public.items i
  on i.name_key = lower(btrim(poi.item_name))
 and i.default_unit_key = lower(btrim(poi.unit));

create index purchase_order_lines_purchase_order_id_idx on public.purchase_order_lines(purchase_order_id);
create index purchase_order_lines_estimated_quantity_id_idx on public.purchase_order_lines(estimated_quantity_id);
create index purchase_order_lines_item_id_idx on public.purchase_order_lines(item_id);

create trigger purchase_order_lines_set_updated_at
before update on public.purchase_order_lines
for each row execute function public.set_updated_at();

alter table public.purchase_order_lines enable row level security;

create policy purchase_order_lines_authenticated_all on public.purchase_order_lines
for all to authenticated
using (true)
with check (true);

create table public.delivery_note_lines (
  id uuid primary key default gen_random_uuid(),
  delivery_note_id uuid not null references public.delivery_notes(id) on delete cascade,
  purchase_order_line_id uuid references public.purchase_order_lines(id) on delete set null,
  item_id uuid not null references public.items(id) on delete restrict,
  received_quantity numeric(14, 3) not null check (received_quantity > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.delivery_note_lines (
  id,
  delivery_note_id,
  purchase_order_line_id,
  item_id,
  received_quantity,
  created_at,
  updated_at
)
select
  dni.id,
  dni.delivery_note_id,
  dni.purchase_order_item_id,
  i.id,
  dni.received_quantity,
  dni.created_at,
  dni.updated_at
from public.delivery_note_items dni
join public.items i
  on i.name_key = lower(btrim(dni.item_name))
 and i.default_unit_key = lower(btrim(dni.unit));

create index delivery_note_lines_delivery_note_id_idx on public.delivery_note_lines(delivery_note_id);
create index delivery_note_lines_purchase_order_line_id_idx on public.delivery_note_lines(purchase_order_line_id);
create index delivery_note_lines_item_id_idx on public.delivery_note_lines(item_id);

create trigger delivery_note_lines_set_updated_at
before update on public.delivery_note_lines
for each row execute function public.set_updated_at();

alter table public.delivery_note_lines enable row level security;

create policy delivery_note_lines_authenticated_all on public.delivery_note_lines
for all to authenticated
using (true)
with check (true);

alter table public.estimated_quantities
drop column item_name,
drop column unit;

drop table public.delivery_note_items;
drop table public.purchase_order_items;
