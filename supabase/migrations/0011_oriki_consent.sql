-- 0011: Explicit consent tracking for Oríkì, distinct from publication_permission.
-- publication_permission governs whether it may be shown publicly on the website;
-- consent_confirmed records that the performer/family consented to the recording
-- being archived at all (a narrower, prior step — spec: Families & Oríkì §17-19).

alter table oriki add column if not exists consent_confirmed boolean not null default false;
alter table oriki add column if not exists consent_notes text;
