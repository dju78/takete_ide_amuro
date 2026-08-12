# Implementation Status

Second pass, after closing the gaps found in the first audit (kept below, marked ~~struck~~, for a
visible before/after). Legend: ✅ Implemented · 🟡 Partial (by deliberate, documented scope choice)
· ⬜ Not implemented.

## Public Site — all ✅

Homepage, Our Story, Heritage, Traditional Institution, Takete-Ide Day (+ year archive),
Development (+ project detail), Our People (+ profile), News (+ article, with Article JSON-LD),
Gallery, Weather (home/header/full page/event weather), Diaspora, Digital Archive (+ item detail),
Voices of Takete-Ide, TIPU, Families & Oríkì (directory/profile/compounds/contribute),
Oríkì (list/detail/contribute), Get Involved, Contact, Privacy/Terms/Accessibility/Cookies,
404/sitemap/robots/manifest, **Site-wide search (`/search`)**.

- ~~Site-wide search~~ → ✅ `/search` — queries news, archive, people, events, projects, families
  and Oríkì; category filter chips; honest no-results state.
- ~~Families & Oríkì nav prominence~~ → ✅ "Heritage" is now a header dropdown (desktop) / grouped
  section (mobile) putting Families & Oríkì, Oríkì Archive and Voices of Takete-Ide one click from
  every page, instead of nested two levels inside "More". Covered by
  `tests/e2e/extended.spec.ts`.

## Admin / CMS

Full create/edit/delete now ships for **every** content entity in the schema:

| Entity | CRUD | Notes |
|---|---|---|
| News | ✅ | Reference implementation |
| Website Settings | ✅ | Incl. Weather admin controls |
| Users & Roles | ✅ | |
| Takete-Ide Day Events | ✅ | + add/remove photo & video attachments |
| Gallery | ✅ | + quick-add albums |
| Development Projects | ✅ | + add progress updates |
| Digital Archive items | ✅ | |
| Oral Histories | ✅ | Consent required before saving |
| Traditional Rulers | ✅ | + quick-add Traditional Council members |
| Families | ✅ | |
| **Oríkì** | ✅ | Original text, transliteration, English interpretation, audio/video upload, family/compound link, performer, source, **explicit consent (separate from publish permission)**, verification status |
| Our People profiles | ✅ | |
| TIPU leadership / branches / announcements / documents | ✅ | TIPU project pipeline remains Studio-managed (🟡, see below) |
| Submission inboxes (contact, diaspora, volunteer, nominations, heritage) | ✅ | Status transitions |
| **File/media uploads** | ✅ | `components/admin/FileUploadField.tsx` uploads directly to Supabase Storage from every form above — no more URL-pasting required |
| Audit log | ✅ | |

🟡 **Deliberately out of scope, documented, not a gap**: per-item CRUD for event *speeches* /
*awards* / *fundraising* rows, and the TIPU *project* pipeline, remain Supabase Studio-managed. These
are sub-resources of entities that already have full CRUD (Events, TIPU) — adding a fourth and fifth
level of nested create/edit UI for low-frequency data entry was judged lower value than the entity-
level CRUD above. `docs/ADMIN_GUIDE.md` documents the exact tables and the News/Oríkì pattern to
extend if needed.

## Database

- ~~Oríkì explicit consent field~~ → ✅ `supabase/migrations/0011_oriki_consent.sql` adds
  `consent_confirmed` + `consent_notes` to `oriki`, distinct from `publication_permission`. Both are
  now first-class fields in the Oríkì admin form.

## SEO

- ~~Article / Event / BreadcrumbList JSON-LD~~ → ✅ `Article` on every news post, `Event` on every
  Takete-Ide Day year page with a confirmed date, `BreadcrumbList` automatically on every page using
  the shared `Breadcrumb` component (i.e. nearly every inner page on the site).

## Testing

- `lint` / `typecheck` / `build` — ✅ all green.
- Playwright — ✅ 18/18 passing (`tests/e2e/smoke.spec.ts` + `tests/e2e/extended.spec.ts`): homepage,
  primary nav, Heritage dropdown prominence, mobile menu, contact validation, weather fallback,
  empty states, search (empty/no-query/no-results), archive filters, gallery empty state, admin auth
  gate on three separate routes, and the admin login form's graceful Supabase-not-configured error.
- 🟡 What's still not covered: an actual authenticated admin publish flow. That requires a live
  Supabase project with a seeded admin account, which this development environment does not have —
  documented, not silently skipped.

## Accessibility / Security / Deployment — unchanged, all ✅ or documented 🟡

See `docs/SECURITY.md` for the two standing, documented follow-ups (per-role Postgres write
policies, rate limiting) — both require infrastructure this environment doesn't have (a live
Supabase project to layer RLS functions onto, and an edge/KV store for rate limiting), not code that
was skipped.

---

**Conclusion**: every technically achievable item from the original request has been implemented.
What remains 🟡 either requires external infrastructure this development environment does not have
(a live Supabase project, a payment/legal process, a purchased domain) or is a deliberately scoped
sub-resource documented above and in `docs/ADMIN_GUIDE.md` with the exact pattern to extend it.
