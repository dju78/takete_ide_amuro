# Takete-Ide Day Fundraising Figures: Withheld Pending Approval (private)

This file is editorial only. It is not rendered on the public site.

## Decision
On 24 October 2026 the project owner asked for the 2024 and 2025 Takete-Ide Day fundraising
amounts, targets and progress lines to be hidden until their approval evidence is found.

## Withheld values

| Year | Purpose (as recorded) | Amount raised | Target | Currency |
|---|---|---|---|---|
| 2025 (25 Oct 2025) | Community Infrastructure & Centenary Heritage Projects | 18,500,000 | 50,000,000 | NGN |
| 2024 (2 Nov 2024) | Civic Centre Renovations and Community Electrification | 12,000,000 | 30,000,000 | NGN |

The public line read: "NGN 18,500,000 raised of NGN 50,000,000 target" (2025, live on
takete-ide.org/takete-ide-day/2025 until this change) and "NGN 12,000,000 raised of NGN
30,000,000 target" (2024). The purpose lines are withheld with the figures, since they come from
the same unsourced record.

## Missing evidence
- The figures first entered the code on 3 September 2026 in commit `d2a1716`
  ("integrate Takete-Ide Day 2025 celebration archive"). The commit gives no source.
- No matching figures appear in the centenary book, the repository's source files or the TIPU
  Connect WhatsApp export.
- The production database could not be queried from the available connector, so any
  `event_fundraising` rows there are unverified too.

Evidence that would allow restoration: a TIPU financial report, an AGM or executive
communiqué, or a signed statement from the treasurer or financial secretary giving the
amounts, the target and the date they applied to.

## How the site withholds them
`lib/data/events.ts` keeps an `APPROVED_FUNDRAISING_YEARS` set, currently empty.
`getPublishedEvents()` removes fundraising records for any year not in that set, whether they
come from the built-in records or from the database. Every public page (Takete-Ide Day
listing and year pages, the events calendar and the sitemap) reads events through that
function.

## To restore once approved
1. Add the year to `APPROVED_FUNDRAISING_YEARS` in `lib/data/events.ts`.
2. Either restore the record above in that year's `fundraising` array in the same file, or
   confirm the matching `event_fundraising` row in the database.
3. Note the approving document and date in this file.

## Not covered by this change
The Security Trust Fund report (target 16,500,000 NGN) in
`lib/media/community-programme.ts` is a separate record and was not part of this review.
