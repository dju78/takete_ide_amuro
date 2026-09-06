-- 0025_harden_centenary_rsvp.sql
-- Harden centenary_rsvps table with explicit non-defaulted consent and staff delete policy

alter table centenary_rsvps alter column consent set default false;

drop policy if exists "Staff delete centenary_rsvps" on centenary_rsvps;
create policy "Staff delete centenary_rsvps"
  on centenary_rsvps for delete
  using (is_takete_staff());
