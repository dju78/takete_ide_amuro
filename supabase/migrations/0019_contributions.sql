-- 0019: Online contributions ledger and payment events.
--
-- Additive and non-destructive: two new tables, one new function, no changes to
-- anything that already exists.
--
-- ── Why a stricter predicate than is_staff() ─────────────────────────────────
-- is_staff() returns true for *any* row in `profiles`, which is right for
-- editorial content and wrong for money: it would let a media manager or editor
-- read every contributor's name, email and amount. Contribution records are
-- therefore gated by is_financial_staff(), which mirrors FINANCIAL_ROLES in
-- lib/auth.ts ('super_admin', 'treasurer') at the database layer, so the
-- restriction holds even if an application-layer check is ever missed.
--
-- ── Why there is no anonymous insert policy ──────────────────────────────────
-- A public INSERT policy would let anyone forge a contribution row and choose
-- its amount, which is precisely the value the webhook later verifies against.
-- Contributions are created only by server-side code using the service-role
-- client, after validating amount, currency, purpose and email. The absence of a
-- policy here is deliberate: with RLS enabled and no policy, anon and
-- authenticated roles can do nothing at all with this table.

-- Financial-role predicate. SECURITY DEFINER so it can read `profiles` without
-- the caller needing access to it, matching the existing is_staff() pattern.
create or replace function is_financial_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and role in ('super_admin', 'treasurer')
  );
$$;

-- ---------------------------------------------------------------------------
-- contributions
-- ---------------------------------------------------------------------------
create table if not exists contributions (
  id uuid primary key default gen_random_uuid(),

  -- Our own reference, generated server-side and sent to the provider. Unique so
  -- a replayed webhook or a double-submitted form cannot create a second row.
  reference text not null unique,

  -- Contact details. Email is required by Paystack; a name is optional because a
  -- contributor may prefer not to give one, and nothing here needs it.
  email text not null,
  contributor_name text,
  message text,

  -- Money is stored in the currency's smallest unit (kobo for NGN) as an
  -- integer. Storing naira as a float would introduce rounding differences
  -- against the provider's own figures, which is the one thing verification
  -- must be able to compare exactly.
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null default 'NGN',

  purpose text not null,

  -- 'paystack' today; the column exists so a second provider, or a manually
  -- reconciled bank transfer, can be recorded without a schema change.
  provider text not null default 'paystack',
  provider_reference text,

  status text not null default 'pending' check (
    status in ('pending', 'successful', 'failed', 'abandoned', 'reversed')
  ),

  -- Populated from the provider's response, never from the browser.
  channel text,
  paid_at timestamptz,
  verified_at timestamptz,

  -- Operational context only. Never card data, authorization codes, or any
  -- payload that could identify an instrument.
  metadata jsonb not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contributions_status_idx on contributions (status, created_at desc);
create index if not exists contributions_created_idx on contributions (created_at desc);
create index if not exists contributions_purpose_idx on contributions (purpose);
create index if not exists contributions_provider_ref_idx on contributions (provider_reference)
  where provider_reference is not null;

create trigger contributions_set_updated_at
  before update on contributions
  for each row execute function set_updated_at();

alter table contributions enable row level security;

-- Read: financial staff only. No public or general-staff read policy exists.
create policy "Financial staff read contributions"
  on contributions for select using (is_financial_staff());

-- Write: financial staff only, for manual review actions in the admin area.
-- Automated writes from the payment routes use the service-role client, which
-- bypasses RLS by design and is never exposed to the browser.
create policy "Financial staff update contributions"
  on contributions for update using (is_financial_staff()) with check (is_financial_staff());

-- ---------------------------------------------------------------------------
-- payment_events
-- ---------------------------------------------------------------------------
-- A minimal audit and idempotency record. Deliberately not a dump of the
-- provider's payload: only the fields needed to prove what happened and to
-- recognise a repeat delivery.
create table if not exists payment_events (
  id uuid primary key default gen_random_uuid(),
  contribution_id uuid references contributions (id) on delete set null,

  provider text not null default 'paystack',
  event_type text not null,

  -- The provider's own identifier for this event. Unique, so receiving the same
  -- webhook twice is a no-op rather than a double count. Paystack does not
  -- always send an event id, so the handler falls back to a deterministic key
  -- derived from the event type and transaction reference.
  provider_event_id text not null unique,

  reference text,
  amount_minor bigint,
  currency text,
  status text,
  channel text,

  -- Short human-readable note (e.g. "amount mismatch: expected 500000").
  note text,

  received_at timestamptz not null default now()
);

create index if not exists payment_events_reference_idx on payment_events (reference);
create index if not exists payment_events_received_idx on payment_events (received_at desc);

alter table payment_events enable row level security;

create policy "Financial staff read payment_events"
  on payment_events for select using (is_financial_staff());
