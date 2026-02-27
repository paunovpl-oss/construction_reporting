create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create type public.stage_status as enum ('not_started', 'in_progress', 'blocked', 'completed');
create type public.po_status as enum ('draft', 'issued', 'partially_received', 'received', 'cancelled');
create type public.delivery_note_status as enum ('draft', 'received', 'cancelled');

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  client text,
  start_date date,
  target_end_date date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.stages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  status public.stage_status not null default 'not_started',
  planned_start date,
  planned_end date,
  actual_start date,
  actual_end date,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.estimated_quantities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  stage_id uuid references public.stages(id) on delete set null,
  item_name text not null,
  estimated_quantity numeric(14, 3) not null check (estimated_quantity >= 0),
  unit text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  po_number text not null unique,
  supplier_name text not null,
  status public.po_status not null default 'draft',
  issue_date date,
  expected_delivery_date date,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references public.purchase_orders(id) on delete cascade,
  estimated_quantity_id uuid references public.estimated_quantities(id) on delete set null,
  item_name text not null,
  quantity numeric(14, 3) not null check (quantity > 0),
  unit text not null,
  unit_price numeric(14, 2) check (unit_price >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.delivery_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  purchase_order_id uuid references public.purchase_orders(id) on delete set null,
  note_number text not null unique,
  supplier_name text not null,
  delivery_date date not null,
  status public.delivery_note_status not null default 'draft',
  attachment_path text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.delivery_note_items (
  id uuid primary key default gen_random_uuid(),
  delivery_note_id uuid not null references public.delivery_notes(id) on delete cascade,
  purchase_order_item_id uuid references public.purchase_order_items(id) on delete set null,
  item_name text not null,
  received_quantity numeric(14, 3) not null check (received_quantity > 0),
  unit text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index stages_project_id_idx on public.stages(project_id);
create index estimated_quantities_project_id_idx on public.estimated_quantities(project_id);
create index estimated_quantities_stage_id_idx on public.estimated_quantities(stage_id);
create index purchase_orders_project_id_idx on public.purchase_orders(project_id);
create index purchase_order_items_purchase_order_id_idx on public.purchase_order_items(purchase_order_id);
create index delivery_notes_project_id_idx on public.delivery_notes(project_id);
create index delivery_notes_purchase_order_id_idx on public.delivery_notes(purchase_order_id);
create index delivery_note_items_delivery_note_id_idx on public.delivery_note_items(delivery_note_id);

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger stages_set_updated_at
before update on public.stages
for each row execute function public.set_updated_at();

create trigger estimated_quantities_set_updated_at
before update on public.estimated_quantities
for each row execute function public.set_updated_at();

create trigger purchase_orders_set_updated_at
before update on public.purchase_orders
for each row execute function public.set_updated_at();

create trigger purchase_order_items_set_updated_at
before update on public.purchase_order_items
for each row execute function public.set_updated_at();

create trigger delivery_notes_set_updated_at
before update on public.delivery_notes
for each row execute function public.set_updated_at();

create trigger delivery_note_items_set_updated_at
before update on public.delivery_note_items
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.stages enable row level security;
alter table public.estimated_quantities enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.purchase_order_items enable row level security;
alter table public.delivery_notes enable row level security;
alter table public.delivery_note_items enable row level security;

create policy projects_authenticated_all on public.projects
for all to authenticated
using (true)
with check (true);

create policy stages_authenticated_all on public.stages
for all to authenticated
using (true)
with check (true);

create policy estimated_quantities_authenticated_all on public.estimated_quantities
for all to authenticated
using (true)
with check (true);

create policy purchase_orders_authenticated_all on public.purchase_orders
for all to authenticated
using (true)
with check (true);

create policy purchase_order_items_authenticated_all on public.purchase_order_items
for all to authenticated
using (true)
with check (true);

create policy delivery_notes_authenticated_all on public.delivery_notes
for all to authenticated
using (true)
with check (true);

create policy delivery_note_items_authenticated_all on public.delivery_note_items
for all to authenticated
using (true)
with check (true);
