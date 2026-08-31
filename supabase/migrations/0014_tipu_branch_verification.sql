-- 0014: Branch verification, status and split location fields.
--
-- Expanding the network from the twelve branches originally supplied to the
-- twenty documented in the TIPU CONNECT WhatsApp archive surfaced two problems
-- the earlier schema couldn't express:
--
--  1. Evidence is not uniform. Abuja appears in a dues notice, a chairman
--     listing and a levy table; Oyo appears once, mis-spelled. Publishing both
--     with identical confidence would misrepresent the record, so `verification`
--     records how well attested a branch is.
--  2. `is_active` conflated two different questions. Kabba is described in a
--     January 2026 notice as due to "kick off this year" — that is a statement
--     about operations, not about evidence. `status` now carries
--     active / forming / inactive, and `is_active` is kept in step for any
--     existing consumer.
--
-- Location also splits into city / state / country: "Ogun State" is a state
-- with no city on record, "Ore" is a town with no state on record, and a single
-- free-text column forced one to be invented to fill the other.

alter table tipu_branches add column if not exists short_name text;
alter table tipu_branches add column if not exists city text;
-- `region` already exists and held the whole location line; `state` separates it.
alter table tipu_branches add column if not exists state text;

alter table tipu_branches add column if not exists status text
  check (status in ('active', 'forming', 'inactive'));

alter table tipu_branches add column if not exists verification text
  check (verification in ('verified', 'community-record', 'pending-verification'));

-- Internal provenance: which union communication documents this branch, and any
-- ambiguity an administrator should know about. Not rendered publicly.
alter table tipu_branches add column if not exists source_note text;

-- Overrides the default public wording for an unsettled record.
alter table tipu_branches add column if not exists status_note text;

-- Widen the grouping to admit the "Growing Network" section.
alter table tipu_branches drop constraint if exists tipu_branches_branch_group_check;
alter table tipu_branches add constraint tipu_branches_branch_group_check
  check (branch_group is null or branch_group in ('home', 'nigeria', 'diaspora', 'growing'));
