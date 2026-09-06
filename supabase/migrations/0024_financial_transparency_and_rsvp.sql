-- 0024_financial_transparency_and_rsvp.sql
-- Financial Transparency reports model + Centenary web RSVP table

create table if not exists financial_reports (
  id uuid primary key default gen_random_uuid(),
  reporting_period text not null,
  opening_balance numeric(15, 2) not null default 0,
  receipts numeric(15, 2) not null default 0,
  expenditure numeric(15, 2) not null default 0,
  closing_balance numeric(15, 2) not null default 0,
  currency text not null default 'NGN',
  supporting_report_url text,
  notes text,
  approval_note text,
  verification_status text not null default 'verified',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table financial_reports enable row level security;

-- Read policy: published financial reports are publicly visible; financial staff see all.
create policy "Public view published financial reports"
  on financial_reports for select
  using (status = 'published' or is_takete_financial_staff());

-- Write policy: financial staff only
create policy "Financial staff manage financial reports"
  on financial_reports for all
  using (is_takete_financial_staff())
  with check (is_takete_financial_staff());

-- Centenary web RSVP registration table
create table if not exists centenary_rsvps (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  branch_or_chapter text,
  country text,
  party_size integer not null default 1 check (party_size >= 1 and party_size <= 50),
  accessibility_requirements text,
  consent boolean not null default true,
  status text not null default 'submitted' check (status in ('submitted', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table centenary_rsvps enable row level security;

-- Public can submit an RSVP
create policy "Public insert centenary_rsvps"
  on centenary_rsvps for insert
  with check (true);

-- Staff can view and manage RSVPs
create policy "Staff manage centenary_rsvps"
  on centenary_rsvps for select
  using (is_takete_staff());

create policy "Staff update centenary_rsvps"
  on centenary_rsvps for update
  using (is_takete_staff())
  with check (is_takete_staff());
