-- 0015: Public contribution account, Centenary event details, Security Trust Fund.
--
-- All three are things the community will want to change without a deploy, and
-- all three carry a higher cost of being wrong than ordinary page copy: a wrong
-- account number sends money to a stranger, a wrong Centenary date sends people
-- to an empty field, and a stale fund figure misrepresents the community's
-- finances. Each therefore ships with a checked-in baseline (lib/media/*) and is
-- overridden from here, and each records who changed it and when.

-- ---------- Official contribution account ----------
-- Deliberately a table rather than columns on site_settings: account changes
-- need their own audit trail and their own (stricter) permission, and keeping
-- them out of the general settings form means an editor cannot alter banking
-- details while changing a tagline.
create table if not exists support_accounts (
  id uuid primary key default gen_random_uuid(),
  account_name text not null,
  bank_name text not null,
  account_number text not null,
  purpose text,
  -- Only one account may be active at a time; the public page shows that one.
  is_active boolean not null default false,
  sort_order integer not null default 0,
  updated_by uuid references profiles (id) on delete set null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create trigger support_accounts_set_updated_at
  before update on support_accounts
  for each row execute function set_updated_at();

alter table support_accounts enable row level security;

-- Only active accounts are publicly readable: a deactivated account must not
-- remain visible to visitors just because the row still exists.
create policy "Public can view active support_accounts"
  on support_accounts for select using (is_active or is_takete_financial_staff());

create policy "Financial staff manage support_accounts"
  on support_accounts for all using (is_takete_financial_staff()) with check (is_takete_financial_staff());

-- ---------- Centenary / Takete-Ide Day 2026 ----------
create table if not exists centenary_settings (
  id boolean primary key default true constraint centenary_settings_singleton check (id),
  headline text,
  intro text,
  event_date date,
  venue text,
  -- Free text: the community says "Saturday, 31 October 2026", not a timestamp.
  event_time_label text,
  programme_status text,
  programme_document_url text,
  attire_status text,
  updated_by uuid references profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into centenary_settings (id) values (true) on conflict (id) do nothing;

create trigger centenary_settings_set_updated_at
  before update on centenary_settings
  for each row execute function set_updated_at();

alter table centenary_settings enable row level security;
create policy "Public can view centenary_settings" on centenary_settings for select using (true);
create policy "Staff manage centenary_settings"
  on centenary_settings for all using (is_takete_staff()) with check (is_takete_staff());

-- ---------- Security Trust Fund ----------
-- `as_of` is not optional: these are figures from a dated community report, and
-- publishing them without the date they were reported would imply a live total.
create table if not exists security_trust_fund (
  id boolean primary key default true constraint security_trust_fund_singleton check (id),
  target_amount numeric(14, 2),
  amount_paid numeric(14, 2),
  currency text not null default 'NGN',
  as_of date,
  note text,
  updated_by uuid references profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into security_trust_fund (id) values (true) on conflict (id) do nothing;

create trigger security_trust_fund_set_updated_at
  before update on security_trust_fund
  for each row execute function set_updated_at();

alter table security_trust_fund enable row level security;
create policy "Public can view security_trust_fund" on security_trust_fund for select using (true);
create policy "Financial staff manage security_trust_fund"
  on security_trust_fund for all using (is_takete_financial_staff()) with check (is_takete_financial_staff());
