# Historical Verification

Takete-Ide's history is being preserved through documentary evidence, community records and oral
testimony, and some accounts continue to be researched. This site treats that as a feature, not a
gap to hide — every historical, family and Oríkì record carries an explicit status.

## Statuses

General content (`verification_status` enum, used on Our Story, Our People, the Archive, Oral
Histories, Traditional Rulers):

| Status | Meaning |
|---|---|
| `unverified` | Not yet checked against any source |
| `oral_history` | Supported primarily by spoken testimony |
| `community_tradition` | Widely told within the community, not yet documentarily confirmed |
| `documentary_evidence` | Supported by a written/documentary source |
| `verified` | Confirmed through the project's agreed verification process |
| `disputed` | Competing accounts exist and require further review |

Families & Oríkì use a parallel, slightly more granular enum (`family_verification_status`) that
adds `draft` and `family_submitted` / `community_reviewed` stages, matching the workflow in the
Families & Oríkì spec addendum:

```
Community Submission → Archivist Review → Source Check →
Family Representative Review → Community/Historical Review → Published
```

## Rules Enforced by This Codebase

1. **Nothing auto-verifies.** Every submission (`heritage_submissions`, community profile
   nominations, etc.) enters review at `pending`/`draft` status; only a staff action changes it.
2. **Disputes are never resolved algorithmically.** Where sources conflict (e.g. the exact list of
   Amuro's constituent communities), the UI is written to present both accounts neutrally with a
   note that the record is still being researched — see `/our-story`'s "Settlement History" section
   for a live example.
3. **No fabricated names or dates.** `/heritage/traditional-institution`, `/tipu`, `/families` and
   `/oriki` all ship with real, working architecture and honest `<EmptyState />` messaging rather
   than invented rulers, officers, family names or praise poetry.
4. **Source notes travel with the claim.** `components/heritage/SourcedSection.tsx` pairs every
   `/our-story` paragraph with a verification badge *and* a one-line note on where the claim came
   from and what would confirm it.

## Source Types

`archive_sources.source_type` and `family_sources.source_type` accept: published source, government
record, church record, school record, community document, newspaper, oral testimony, family archive,
photograph, video, audio, other — per the brief's source-management requirement (§28).

## Adding a Verified Fact

1. Confirm the claim with a named source (elder, document, church/school record).
2. Add or update the relevant row (e.g. `traditional_rulers`, `families`) via the admin UI or
   Supabase Studio, setting `verification_status` appropriately — only set `verified` once actually
   confirmed by the responsible party (traditional council for chieftaincy claims, family
   representative for family history, etc.).
3. Optionally log the supporting evidence in `verification_records` for a durable audit trail.
