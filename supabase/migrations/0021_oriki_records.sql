-- Create oriki_records table for consolidated Takete-Ide community family praise names
create table if not exists oriki_records (
  id uuid primary key default gen_random_uuid(),
  family_origin text not null,
  male_oriki text not null,
  female_oriki text not null,
  notes text,
  display_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table oriki_records enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'oriki_records' and policyname = 'Public can view published oriki_records'
  ) then
    create policy "Public can view published oriki_records" on oriki_records
      for select using (published = true or is_takete_staff());
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'oriki_records' and policyname = 'Staff manage oriki_records'
  ) then
    create policy "Staff manage oriki_records" on oriki_records
      for all using (is_takete_staff()) with check (is_takete_staff());
  end if;
end $$;

-- Seed the 18 approved records if table is empty
insert into oriki_records (family_origin, male_oriki, female_oriki, display_order, published)
select d.family_origin, d.male_oriki, d.female_oriki, d.display_order, true
from (values
  ('Eseha', 'Eseha', 'Eha', 1),
  ('Attemogbe', 'Attemogbe', 'Anumogbe', 2),
  ('Attemoyi', 'Attemoyi', 'Anumoyi', 3),
  ('Eseyinmeleun', 'Eseyinmeleun', 'Omoeemeleu', 4),
  ('Attejagbo', 'Attejagbo', 'Anujagbo', 5),
  ('Meleri', 'Meleri', 'Iyemeleri', 6),
  ('Attemesami Olu', 'Attemesami Olu', 'Anumesami Olu', 7),
  ('Ako', 'Ako', 'Ako', 8),
  ('Eseyin Telu', 'Eseyin Telu', 'Omoe Telu', 9),
  ('Anjaba', 'Anjaba', 'Anjaba', 10),
  ('Atte Meto', 'Atte Meto', 'Anu Meto', 11),
  ('Iyaloko', 'Iyaloko', 'Iyaloko', 12),
  ('Awinrin Mope', 'Awinrin Mope', 'Awinrin Mope', 13),
  ('Atte Lase', 'Atte Lase', 'Anu Lase', 14),
  ('Ota', 'Ota', 'Onanra', 15),
  ('Atte Meya', 'Atte Meya', 'Anu Meya', 16),
  ('Eseyin Meta', 'Eseyin Meta', 'Anu Meta', 17),
  ('Obanro', 'Obanro', 'Omosinla', 18)
) as d(family_origin, male_oriki, female_oriki, display_order)
where not exists (select 1 from oriki_records limit 1);
