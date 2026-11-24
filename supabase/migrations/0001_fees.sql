-- CDR Quarteirense · Espaço Pais + gestão de quotas e licenças
-- Supabase / PostgreSQL. Dados pessoais em região UE. RLS ativa em todas as tabelas.

-- ---------------------------------------------------------------- Perfis e papéis
create type app_role as enum ('admin', 'treasurer', 'coordinator', 'coach', 'guardian', 'athlete');

create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text not null,
  email       text not null unique,
  phone       text,
  nif         text,                      -- para recibos (opcional)
  created_at  timestamptz not null default now()
);

create table user_roles (
  user_id uuid references profiles on delete cascade,
  role    app_role not null,
  primary key (user_id, role)
);

create or replace function has_role(r app_role) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from user_roles where user_id = auth.uid() and role = r)
$$;

create or replace function is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin','treasurer','coordinator'))
$$;

-- ---------------------------------------------------------------- Época, escalões, tarifas
create table seasons (
  id          uuid primary key default gen_random_uuid(),
  label       text not null unique,      -- '2026/27'
  starts_on   date not null,
  ends_on     date not null,
  due_day     smallint not null default 8 check (due_day between 1 and 28),
  is_current  boolean not null default false
);

create table categories (
  id          text primary key,          -- 'sub11'
  name        text not null,             -- 'Benjamins'
  age_label   text not null,             -- 'Sub-11'
  discipline  text not null default 'futebol'
);

create table fee_plans (
  id                   uuid primary key default gen_random_uuid(),
  season_id            uuid not null references seasons,
  category_id          text not null references categories,
  monthly_fee_cents    integer not null check (monthly_fee_cents >= 0),
  registration_cents   integer not null default 0,
  months               smallint not null default 10,
  full_season_free_months smallint not null default 0,
  sibling_discount_pct smallint not null default 0,
  unique (season_id, category_id)
);

-- ---------------------------------------------------------------- Atletas e encarregados
create table athletes (
  id            uuid primary key default gen_random_uuid(),
  first_name    text not null,
  last_name     text not null,
  birth_date    date not null,
  user_id       uuid references profiles,       -- atleta maior de idade com conta própria
  photo_consent boolean not null default false, -- RGPD: publicação de imagem
  photo_consent_at timestamptz,
  created_at    timestamptz not null default now()
);

create table athlete_guardians (
  athlete_id  uuid references athletes on delete cascade,
  guardian_id uuid references profiles on delete cascade,
  relation    text not null default 'encarregado',
  is_payer    boolean not null default true,
  primary key (athlete_id, guardian_id)
);

create or replace function is_guardian_of(a uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from athlete_guardians where athlete_id = a and guardian_id = auth.uid())
      or exists (select 1 from athletes where id = a and user_id = auth.uid())
$$;

-- Inscrição de um atleta numa época/escalão
create table enrollments (
  id           uuid primary key default gen_random_uuid(),
  athlete_id   uuid not null references athletes on delete cascade,
  season_id    uuid not null references seasons,
  category_id  text not null references categories,
  fee_plan_id  uuid not null references fee_plans,
  status       text not null default 'active' check (status in ('active','suspended','left')),
  exempt       boolean not null default false,  -- isenção social decidida pela Direção
  unique (athlete_id, season_id)
);

create table licences (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments on delete cascade,
  federation    text not null default 'AF Algarve',
  number        text,
  status        text not null default 'pending' check (status in ('pending','valid','expired')),
  valid_until   date,
  medical_until date
);

-- ---------------------------------------------------------------- Cobranças e pagamentos
create type charge_status as enum ('open', 'paid', 'void', 'exempt');

create table charges (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments on delete cascade,
  kind          text not null check (kind in ('monthly','registration','other')),
  period        date,                     -- 1.º dia do mês, para mensalidades
  amount_cents  integer not null check (amount_cents >= 0),
  due_on        date not null,
  status        charge_status not null default 'open',
  unique (enrollment_id, kind, period)
);

-- vista prática: em atraso = aberta e vencida
create view charges_with_state as
  select c.*, (c.status = 'open' and c.due_on < current_date) as overdue
  from charges c;

create table payments (
  id              uuid primary key default gen_random_uuid(),
  payer_id        uuid references profiles,
  amount_cents    integer not null,
  method          text not null check (method in ('mbway','multibanco','card','sepa_dd','cash','transfer')),
  provider        text,                    -- 'ifthenpay' | 'easypay' | 'stripe' | null (secretaria)
  provider_ref    text unique,             -- id/referência do prestador (idempotência do webhook)
  status          text not null default 'pending' check (status in ('pending','paid','failed','refunded','expired')),
  paid_at         timestamptz,
  recorded_by     uuid references profiles, -- tesoureiro, para pagamentos manuais
  receipt_number  text unique,
  created_at      timestamptz not null default now()
);

create table payment_allocations (
  payment_id   uuid references payments on delete cascade,
  charge_id    uuid references charges on delete restrict,
  amount_cents integer not null,
  primary key (payment_id, charge_id)
);

-- Quando um pagamento passa a 'paid', as cobranças associadas ficam pagas.
create or replace function settle_charges() returns trigger language plpgsql as $$
begin
  if new.status = 'paid' and (old.status is distinct from 'paid') then
    update charges set status = 'paid'
      where id in (select charge_id from payment_allocations where payment_id = new.id);
  end if;
  return new;
end $$;
create trigger trg_settle after update of status on payments for each row execute function settle_charges();

create table reminders (
  id          uuid primary key default gen_random_uuid(),
  guardian_id uuid references profiles,
  athlete_id  uuid references athletes,
  channel     text not null check (channel in ('email','sms','push')),
  sent_at     timestamptz not null default now(),
  sent_by     uuid references profiles   -- null = automático
);

create table announcements (
  id          uuid primary key default gen_random_uuid(),
  title       jsonb not null,             -- {"pt": "...", "en": "...", "fr": "..."}
  body        jsonb not null,
  category_id text references categories, -- null = todos
  published_at timestamptz
);

create table audit_log (
  id         bigserial primary key,
  actor      uuid,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  at         timestamptz not null default now(),
  details    jsonb
);

-- ---------------------------------------------------------------- RLS
alter table profiles            enable row level security;
alter table user_roles          enable row level security;
alter table athletes            enable row level security;
alter table athlete_guardians   enable row level security;
alter table enrollments         enable row level security;
alter table licences            enable row level security;
alter table charges             enable row level security;
alter table payments            enable row level security;
alter table payment_allocations enable row level security;
alter table reminders           enable row level security;
alter table announcements       enable row level security;
alter table audit_log           enable row level security;
alter table seasons             enable row level security;
alter table categories          enable row level security;
alter table fee_plans           enable row level security;

-- referência pública (leitura)
create policy read_ref_seasons    on seasons    for select using (true);
create policy read_ref_categories on categories for select using (true);
create policy read_ref_fee_plans  on fee_plans  for select using (auth.role() = 'authenticated');

-- cada um vê o seu perfil; staff vê todos
create policy own_profile   on profiles for select using (id = auth.uid() or is_staff());
create policy edit_profile  on profiles for update using (id = auth.uid());
create policy roles_read    on user_roles for select using (user_id = auth.uid() or has_role('admin'));
create policy roles_admin   on user_roles for all using (has_role('admin')) with check (has_role('admin'));

-- encarregado: só os seus atletas
create policy athletes_read  on athletes for select using (is_guardian_of(id) or is_staff() or has_role('coach'));
create policy athletes_staff on athletes for all using (is_staff()) with check (is_staff());
-- Encarregado só altera o consentimento de imagem: em produção, via função RPC set_photo_consent(athlete, bool)
-- (security definer) em vez de UPDATE direto, para não poder alterar outras colunas.

create policy ag_read  on athlete_guardians for select using (guardian_id = auth.uid() or is_staff());
create policy ag_staff on athlete_guardians for all using (is_staff()) with check (is_staff());

create policy enr_read  on enrollments for select using (is_guardian_of(athlete_id) or is_staff() or has_role('coach'));
create policy enr_staff on enrollments for all using (is_staff()) with check (is_staff());

create policy lic_read  on licences for select using (
  is_staff() or has_role('coach') or exists (select 1 from enrollments e where e.id = enrollment_id and is_guardian_of(e.athlete_id)));
create policy lic_staff on licences for all using (is_staff()) with check (is_staff());

-- dinheiro: encarregado lê o que é seu; só tesouraria/admin escreve (webhooks usam service role)
create policy ch_read on charges for select using (
  has_role('treasurer') or has_role('admin')
  or exists (select 1 from enrollments e where e.id = enrollment_id and is_guardian_of(e.athlete_id)));
create policy ch_write on charges for all using (has_role('treasurer') or has_role('admin')) with check (has_role('treasurer') or has_role('admin'));

create policy pay_read  on payments for select using (payer_id = auth.uid() or has_role('treasurer') or has_role('admin'));
create policy pay_write on payments for all using (has_role('treasurer') or has_role('admin')) with check (has_role('treasurer') or has_role('admin'));
create policy alloc_read on payment_allocations for select using (
  has_role('treasurer') or has_role('admin') or exists (select 1 from payments p where p.id = payment_id and p.payer_id = auth.uid()));

create policy rem_staff on reminders for all using (is_staff()) with check (is_staff());
create policy ann_read  on announcements for select using (auth.role() = 'authenticated' and published_at is not null);
create policy ann_staff on announcements for all using (is_staff()) with check (is_staff());
create policy audit_admin on audit_log for select using (has_role('admin'));

-- Nota: o treinador NÃO tem acesso a charges/payments (separação dinheiro / desporto).
