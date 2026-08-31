# The TIPU Branch Network

The Takete-Ide Progressive Union works through branches at home, across Nigeria and in the diaspora.
This document records which branches the site publishes, the evidence behind each one, and why a
branch without a photograph still gets a card.

## The governing rule

**A branch never disappears from the site because nobody has photographed it yet.** The photographic
archive is far younger and thinner than the network it documents — three branches of twenty have
photographs. A page that listed only those would misrepresent the union as a seventh of its real
size. Branches without a photograph show a branded placeholder
(`components/tipu/BranchMediaPlaceholder.tsx`) in the same card, the same frame and the same aspect
ratio as a photographed one.

## Sources

Three sources were searched:

| Source | Branch content |
|---|---|
| `docs/source-master-pack.docx` / `.pdf` | **None.** Mentions the diaspora in general terms only — as `docs/PROJECT_AUDIT.md` already recorded. |
| Curated media pack (`MEDIA_MANIFEST.txt`) | Lokoja, Ilorin, UK & Europe — the three with photographs. |
| **TIPU CONNECT WhatsApp archive** (Oct 2024 – Aug 2026, ~51,700 lines) | The authoritative branch list. Three separate union communications enumerate branches. |

The three enumerating communications are:

1. **Annual-dues notice, 21 Dec 2024** — Ilorin, Lagos, Abuja, P/court, Kaduna, Minna, Ogun, Lokoja,
   Ekiti, Osun.
2. **Branch-chairman listing, 14 Oct 2025** — Ilorin, Lagos, Ogun, P/H, Abuja, Kaduna, Kano, Lokoja,
   Minna, Osun, Ekiti, Oyo; plus Ayeteju in a follow-up message.
3. **Security Trust Fund levy status, 25 Aug 2026** — Abuja, Lokoja, Kaduna, Home, Ilorin, Lagos,
   Ogun, U.K., North America, Ore, Agbajogun, Ekiti.

Plus two single references: a **Jul 2026 remittance notice** naming Ondo, and a **7 Jan 2026 notice**
stating that "Kano branch and Kabba branch will by God's grace kick-off this year".

A second archive (Takete Ide Project Coordination Committee) was searched and adds no branch not
already listed above.

### One false positive, rejected

The archive contains the string "Ejiba Branch" — in a **news report about the Okada Riders
Association**, not TIPU. It is not a union branch and was not added.

## The network

Twenty branches. `Verification` records how well attested a branch is; `status` records whether it is
operating. They answer different questions, and a branch can be well evidenced as still forming.

### Home & Community

| Branch | Location | Media | Verification | Status |
|---|---|---|---|---|
| TIPU Home Branch | Takete-Ide, Amuro, Kogi State | Placeholder | community-record | active |
| TIPU Agbajogun Branch | Agbajogun | Placeholder | community-record | active |
| TIPU Ayeteju Branch | Ayeteju | Placeholder | pending-verification | active |

### Across Nigeria

| Branch | Location | Media | Verification | Status |
|---|---|---|---|---|
| TIPU Abuja Branch | Abuja | Placeholder | community-record | active |
| TIPU Lokoja Branch | Lokoja, Kogi State | **Photograph** | community-record | active |
| TIPU Kaduna Branch | Kaduna | Placeholder | community-record | active |
| TIPU Ilorin Branch | Ilorin, Kwara State | **Photograph** | community-record | active |
| TIPU Lagos Branch | Lagos | Placeholder | community-record | active |
| TIPU Ogun Branch | Ogun State | Placeholder | community-record | active |
| TIPU Port Harcourt Branch | Port Harcourt | Placeholder | community-record | active |
| TIPU Minna Branch | Minna | Placeholder | community-record | active |
| TIPU Osun Branch | Osun State | Placeholder | community-record | active |
| TIPU Ekiti Branch | Ekiti State | Placeholder | community-record | active |
| TIPU Ore Branch | Ore | Placeholder | community-record | active |
| TIPU Kano Branch | Kano, Kano State | Placeholder | pending-verification | **forming** |
| TIPU Oyo Branch | Oyo State | Placeholder | pending-verification | active |

### Global Community

| Branch | Location | Media | Verification | Status |
|---|---|---|---|---|
| TIPU UK & Europe Chapter | United Kingdom & Europe | **Photograph** | community-record | active |
| TIPU North America | North America | Placeholder | community-record | active |

### Growing Network

| Branch | Location | Media | Verification | Status |
|---|---|---|---|---|
| TIPU Ondo | Ondo State | Placeholder | pending-verification | active |
| TIPU Kabba Branch | Kabba, Kogi State | Placeholder | pending-verification | **forming** |

Dedicated pages exist only for Lokoja, Ilorin and UK & Europe. Public network page:
`/tipu/branches`. A ten-branch selection appears on the homepage under "One Takete-Ide. Many
Locations."

## Name normalisation

| Archive form | Published as |
|---|---|
| `P/court branch`, `P/courte TIPU branch`, `P/H branch` | TIPU Port Harcourt Branch |
| `U.K. Branch`, `UK/Europe branch` | TIPU UK & Europe Chapter |
| `North America Branch`, `North American Branch`, `American branch` | TIPU North America |
| `Oyo brance` (typo) | TIPU Oyo Branch |
| `OSUN branch` | TIPU Osun Branch |

## Needs confirmation

| Item | Question |
|---|---|
| **Ayeteju / Aiyeteju** | Both spellings appear. Listed as a branch in Oct 2025, but a June 2025 message records a maiden meeting of TIPU members "residing in Ayeteju Agbajogun" and asks them to **remit to the home branch** — so whether it is an independent branch or a gathering under Home is unresolved. Grouped under Home & Community meanwhile. An administrator can correct the spelling without a deploy. |
| **Ondo vs Ore** | Ore Branch is separately documented in the Aug 2026 levy table; Ondo appears once, in a Jul 2026 remittance notice. Ore is a town in Ondo State, so these may be the same branch — **they have deliberately not been merged.** |
| **Kano** | Listed among branch chairmen in Oct 2025, then described in Jan 2026 as due to "kick off this year". Carried as forming, with the public note "Community record — details being updated". No establishment date. |
| **Kabba** | Referenced only as an intended branch in the Jan 2026 notice. No later message confirms it became operational, so it sits in Growing Network as `forming`. |
| **Oyo** | A single mention, mis-spelled "Oyo brance". No chairman, address, date or membership figure on record. |
| **Ore** | State not stated in the record; published as "Ore, Nigeria". |
| **Home Branch** | Is "TIPU Home Branch" the union's own formal name for it? |

None of these blocks publication — every branch is on the site now, captioned to claim only what is
known.

## What is deliberately not asserted

- **No establishment dates.** None is verified anywhere in the archive, so the `Established` row never
  renders. A test asserts this stays true.
- **No officers, addresses, phone numbers, membership figures or branch histories.** The archive
  contains chairmen's names and phone numbers; none reaches the public site. A test scans the network
  page for phone-number patterns, WhatsApp handles and email addresses.
- **No city for North America.** A union listing describes the coordinator's remit as the USA, Canada
  "and other countries within the region", so the chapter stays continental — never TIPU USA, TIPU
  Canada or TIPU United States.
- **No empty routes.** Only the three branches with substantial content link to a page of their own.
- **No stock photography and no AI-generated city landmarks.** A test asserts every image on the page
  comes from `/images/takete-ide/`.
- **Internal provenance stays internal.** Each branch carries a `sourceNote` for administrators; a
  test asserts those citations never appear on the public page.

## Media search for placeholder branches

The archive was searched for photographs that could replace a placeholder, focusing on the branch
events the chat records:

| Event | Date | Result |
|---|---|---|
| Kaduna Branch End of Year Party | 8 Dec 2024 | `<Media omitted>` — not exported |
| TIPU Kaduna Branch meeting | 23 Feb 2025, 27 Jul 2025, 30 Mar 2026 | `<Media omitted>` — not exported |
| TIPU Abuja Branch meeting | 23 Mar 2025, 27 Jul 2025, 12 Oct 2025 | `<Media omitted>` — not exported |
| Ogun State TIPU Branch End of Year Party | 21 Dec 2025 | `<Media omitted>` — not exported |

The export contains 278 attached files against 2,771 `<Media omitted>` placeholders. Every photograph
with clear branch context that **was** exported is already on the site (Lokoja, Ilorin, UK & Europe,
all Aug 2026). **No new authentic branch photograph was recoverable**, so no placeholder was replaced.
If the community re-exports the chat with full media, the Kaduna, Abuja and Ogun event photographs
should become available.

## How it is built

- `lib/media/tipu-branches.ts` — the documented network as typed records, shipped with the
  application so the page is correct with no database at all.
- `supabase/migrations/0013_tipu_branch_network.sql` — grouping, imagery, activity, dedicated-page
  fields, and `tipu_branch_updates` for branch news/events.
- `supabase/migrations/0014_tipu_branch_verification.sql` — `status`, `verification`, `source_note`,
  `status_note`, `short_name`, and split `city` / `state` / `country`.
- `lib/data/tipu-branches.ts` — merges editor rows over the shipped baseline by `slug`, and appends
  any branch an administrator created that the baseline doesn't know about.
- `components/tipu/BranchMediaPlaceholder.tsx` — one reusable placeholder taking branch name, region,
  acronym and status message, with `card` and `compact` sizes.
- `components/tipu/BranchCard.tsx`, `components/tipu/BranchStrip.tsx` — the two public presentations.

## Administration

**Admin → TIPU Branches** (`/admin/tipu/branches`, `administrator` role) covers branch name, display
name, city, state, country, grouping, status, verification, source note, photograph upload/replace,
description, featured, dedicated page, display order, and branch news/events. **Replacing a
placeholder with a real photograph is an upload, not a deploy.**

Alt text becomes required the moment a photograph is attached; a placeholder needs none because its
artwork is decorative and the card's own text carries the meaning.

"Reset" on a branch that ships with the site restores the details it was published with — it does not
remove the branch. Only branches created in the admin area can be deleted outright, so a documented
branch cannot be lost by accident.
