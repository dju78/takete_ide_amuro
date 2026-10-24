# Centenary Book Review Log (private)

Reference: *From The Hilltops To The Valley: The History, Heritage, and People of Takete-Ide*,
TIPU centenary publication (1926–2026). Page numbers are printed page numbers.

This file is editorial only. It is not rendered on the public site.

## Changes applied to the website

| Area | Change | Book pages |
|---|---|---|
| Footer | Production credit: Fina Productions | n/a |
| Anthem | "gbogbo", "Olorun 'a ape o, ngho daa 'a hi Takete", "Takete-Ide" throughout. The book prints "All/ T.agbe"; the site uses "T’agbe" to match the solo line. | 14 |
| Current Olu’de | Oba Philip Omolade Aladuge Ebilakun; Second Class Oba, Mopamuro LGA; Eseyintelu lineage, Ikoj’Agun quarter, Oke-Adan ward | 59, 62 |
| Olu’de register | 13 rulers. Primary names follow Chapter 9; Chapter 2 forms shown as "Also recorded as". Broad ward added from Chapter 9. Families and Compounds pages updated to match, with Ikoj’Agun added for ruler 13. | 18–19, 61–62 |
| Our Story | Pa George Fiki first child born at the new site; younger brother Joshua reigned 1983–2003, later Alamuro; Okoo Elewa reigning during the move | 16–17, 38, 61 |
| Faith timeline | Baptisms 12 Jan 1921 and 27 Mar 1925; land letter 11 Dec 1927; building began 15 May 1928 (groundbreaking by W.S. Craig; Agbale and Nicodemus went to Lokoja for approval); choir 29 Dec 1930; Apostolic 1938 (Rev. K.P. Titus of Isanlu); bell arrived 24 May 1939; COGIC 1980; Healing Church International 1999; ECWA LCC 17 Dec 2003 | 38, 41–44, 46, 58, 64 |
| Church directory | Apostolic 1938, COGIC 1980, Healing Church 1999, RCCG 2006 | 41, 58 |
| RCCG | The book lists "Redeemed Church of Christ 2006". The project owner confirmed (24 Oct 2026) that this is the Redeemed Christian Church of God (RCCG). 2006 added to the existing RCCG entries; no new church created. | 58 |
| First Baptist | Pa Noah Eseyin Omoyele (book). Church Secretary role from the separate First Baptist church history, which names "Noah Eseyin" as Secretary. | 39 |
| Education | 1980 Oyi LG Secondary School, first principal Pa J.K. Fanwo (Chief Obaholo); 1983 state takeover and renaming as GDSS | 53–54, 67 |
| Health | First three nurses and midwives listed together, no order implied | 56, 66 |
| Development | Postal agency with John Eseyin in charge; 1991 fundraising and 2005 connection; Yahaya Bello Clinic; Civic Centre "almost completed" and palace "ongoing" framed as the status at publication | 71, 73, 76 |
| Pacesetters | Lawyer, SAN, army ranks, Speaker, CPS, GDSS head boy and head girl, pageant, clergyman, MCIoD, footballer, TV, Globacom, photo printing; Bamidele Eseyin as first indigene Secretary of MopAmuro LG | 66–69 |

## Unresolved conflicts (existing site entry preserved)

### Olu’de register lineages
The two lists in the book disagree on the lineage of three rulers. The site keeps its existing entry.

| Ruler | Site (kept) | Chapter 2 (p19) | Chapter 9 (p61–62) |
|---|---|---|---|
| 1 Opalu | Atemayi | Atemayi | Atemoyi |
| 6 Obadofin Obere | Atemeji | Atemeji | Atte-moyi |
| 12 Joshua Alege Fiki | Atemayi | Ate-Moyi | Atte-moyi-megbe |

Other differences are treated as spelling variants of the same lineage (for example Atemesami / Atte-mesami, Eseyintelu / Ese’in-telu).

Chapter 9 gives no separate name for ruler 2 ("Olu’de Esein-telu – Ilela, Odo-Takete"). The site uses Chapter 2’s "Olu’de Ide" and notes Ilela as an alternative compound name.

### Ward totals
The book’s analysis gives Odo-Takete 3, Ok’ako 3, Ok’adan 6. Its own list gives Odo-Takete 3, Oke-Ako 4, Oke-Adan 6 (13 in total). The site omits totals.

### Mrs Omoboni’s surname
"Mokunolu" (p66) and "Mokuolu" (p52, p56). The site keeps its existing spellings in each place: Mokunolu in the pacesetters list, Mokuolu in the health milestones.

### Leke James
The book says he played for "Mode Fk in Sweden" and Sivasspor in Turkey in 2023. Molde FK is a Norwegian club. Club, country and year are omitted until confirmed.

### MopAmuro LGA creation date
The book (p2) attributes the 1996 creation of MopAmuro LGA to the Babangida administration. The site does not repeat this.

## Oríkì: held for a separate decision

No change has been made to the static fallback or the Supabase `oriki_records` table. The site keeps the previously approved spellings. The book’s list (p93–94) differs as follows:

| # | Approved site (male / female) | Book (male / female) |
|---|---|---|
| 1 | Eseha / Eha | Eseha Jaree / Eha Jaree |
| 2 | Attemogbe / Anumogbe | Atte Mogbe / Anu Mogbe |
| 3 | Attemoyi / Anumoyi | Atte Moyi / Anu Moyi |
| 4 | Eseyinmeleun / Omoeemeleu | Eseyin Meleu / Omoe Meleu |
| 5 | Attejagbo / Anujagbo | Atte Jagbo / Anu Jagbo |
| 6 | Meleri / Iyemeleri | Atte Meleri / Omoe Meleri |
| 7 | Attemesami Olu / Anumesami Olu | Atte Mesami Olu / Anu Mesami Olu |
| 10 | Anjaba / Anjaba | Atte jaba / Anu jaba |
| 19 | (not listed) | Eseyin Moloyo / Omoee Moloyo |
| 20 | (not listed) | Angabo / Angabo |

Entries 6 and 10 differ in substance, not only in spacing. Any change needs community confirmation and a matching Supabase migration. Audio matching for Eseha, Mesami Olu and Eseyin Telu must be rechecked if names change.

## Production data note
The Traditional Institution page shows the current Olu’de from the Supabase `traditional_rulers` table when a row has `is_current = true`; otherwise it uses the corrected text in the page code.

Check on 24 Oct 2026 (read-only, live page at takete-ide.org): the page renders the code fallback ("Oba Philip Ebilakun serves as the current Olu’de…") and no "Historical Records" list, so no `traditional_rulers` row currently overrides it. The corrected fallback will appear once deployed. No database change is proposed.

The Supabase project behind the live site was not reachable from the available connector, so the table itself was not queried. To confirm directly (read-only):

```sql
select id, full_name, regnal_title, is_current, reign_start, reign_end, sort_order
from public.traditional_rulers
order by sort_order;
```
