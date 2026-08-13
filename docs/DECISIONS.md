# Decisions Log

This document records every professional judgement call made while building this site where the
brief left a choice open, per the "do not stop to ask questions" instruction. Each entry states the
decision and the reasoning.

## Technology & Architecture

- **Stack**: Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, Supabase
  (Postgres + Auth + Storage), npm, deployed to Vercel. This matches the brief's preferred stack and
  is the strongest current option for a content-heavy, SEO-sensitive, form-driven civic site.
- **Package name**: `taketeide-amuro` — `create-next-app` rejects the literal folder name "Takete
  Ide" (capitals, spaces are invalid npm package names).
- **Content editor**: Markdown (rendered via `react-markdown` + `remark-gfm`) rather than a rich
  WYSIWYG/raw-HTML editor for news bodies. This satisfies "avoid insecure raw HTML" directly — no
  HTML sanitizer is needed because HTML is never stored or rendered from user input.
- **Provider abstraction for Storage**: buckets are created in `supabase/migrations/0010_storage_buckets.sql`
  and referenced by URL from content tables. A `lib/storage.ts` abstraction (to formalise
  swapping to Cloudinary/S3 later) is a documented next step — v1 stores/returns public Storage
  URLs directly, since no second storage provider is configured today.
- **Analytics**: architecture left as environment-variable placeholders only
  (`NEXT_PUBLIC_ANALYTICS_PROVIDER` / `_ID`, commented out in `.env.example`). Nothing is wired to a
  provider, so no cookie consent banner is shown — see "Cookies" below.
- **Cookie consent**: no banner is implemented. The brief explicitly warns against a "fake cookie
  banner that does nothing" — since no non-essential cookies are set (only the Supabase auth
  session, which is strictly necessary), a banner would have nothing to gate. `/cookies` explains
  this and documents the trigger for adding a real, technology-controlling banner once analytics are
  enabled.

## Brand & Design

- **Site logo — the TIPU emblem, explicitly authorised**: `components/layout/Logo.tsx` initially
  rendered a custom abstract placeholder mark rather than the supplied TIPU emblem, because the
  original brief said not to use the TIPU emblem as the whole-site logo without documented
  authorisation. The project owner subsequently gave that authorisation directly in chat and asked
  for the placeholder to be replaced with the TIPU emblem image, so `components/layout/Logo.tsx` now
  renders `/images/takete-ide/tipu-emblem.png` site-wide (header, footer, mobile nav, admin
  sidebar/login) — the single point of change if this is revisited later.
- **Two mottos preserved distinctly**: the site-wide tagline is "Heritage • Unity • Progress" (per
  the brief's positioning), while TIPU's own motto "Faith, Unity and Progress" (read directly off the
  supplied emblem image) is used only within the `/tipu` page, since TIPU ≠ the whole community.
- **Typography**: Playfair Display (serif, heritage headings) + Inter (sans, body/UI), loaded via
  `next/font/google` for zero layout shift and no external font requests.
- **Navigation**: primary bar (Home, Our Story, Heritage, Takete-Ide Day, Development, News, Gallery,
  Weather) + a "More" dropdown (Our People, Families & Oríkì, Diaspora, Digital Archive, Voices of
  Takete-Ide, TIPU, Get Involved, Contact) — the weather addendum itself suggested a dropdown to
  avoid overcrowding once Weather was added to a 12-route nav.
- **Homepage Section 10 ("Development CTA")**: merged into the global Footer's CTA band rather than
  rendered twice — the footer (Section 11) sits immediately below Section 10 on every page including
  the homepage, and the brief's copy for both is effectively identical ("Join the Journey…" / "Get
  Involved"). Rendering it twice back-to-back would read as a mistake, not a feature.
- **Social icons**: Facebook/Instagram render in a visibly disabled "coming soon" state — no real
  URLs were supplied, and the brief forbids inventing them. WhatsApp/Email icons route to `/contact`.

## Fourth Pass — Mega-Menu Navigation Redesign

- **Single source of truth**: `lib/site-config.ts` now exports one `navGroups` array (Community,
  Heritage, Development, Resources, Connect — matching the footer's original structure exactly) used
  by both the header mega-menu (`MegaMenuGroup`) and the simplified footer, replacing the old
  `primaryNav` / `heritageNav` / `moreNav` split. This guarantees the header and footer can never list
  different things for the same section again.
- **Featured items in Heritage**: `Families & Oríkì` and `Oríkì Archive` are marked `featured: true`
  and rendered in a highlighted gold-bordered box at the top of the Heritage panel (desktop) and with
  a star icon in the accordion (mobile), per instruction that they must be "clearly visible."
- **Breakpoint**: kept the `min-[1320px]:` custom breakpoint established in the previous pass (rather
  than reverting to `lg`/`xl`) since it was already proven to avoid header overflow, and re-verified
  clean at 1440/1320/1280/1024/768/430/375px with the new, lighter 5-group nav (down from 7 primary
  links + 2 dropdowns).
- **Footer simplified to two rows**: group headings only (linking to each section's overview page) on
  the first row, and a flat secondary "utility links" row (Home, Families & Oríkì, Get Involved,
  Contact, legal pages) below — no more 5-column full-item-list dump. The footer keeps every link the
  header has (nothing lost for SEO/accessibility), just de-emphasised so the header mega-menu is
  visitors' primary way to discover site sections, per instruction.
- **NavDropdown.tsx removed**: superseded by `MegaMenuGroup.tsx`, which additionally supports the
  featured-item highlighting and multi-column layout NavDropdown didn't have.

## Fifth Pass — Mobile-First Cleanup

- **Problem being fixed**: prior passes made mobile *not overflow*, but the layout was still the
  desktop composition scaled down — same grids, same section rhythm, same image crops, just narrower.
  Instruction was explicit: "Do not make the desktop website smaller to fit a phone. Redesign the
  presentation for the phone." This pass treats 375–430px as its own design problem, not a compressed
  breakpoint of the 1440px layout.
- **Dual-markup pattern**: rather than trying to make one grid serve both a 4-column desktop
  composition and a single-column mobile one via responsive utility classes alone, sections with a
  materially different mobile shape (Hero, homepage Takete-Ide Day, homepage Gallery strip, the
  standalone `/takete-ide-day` page) now render two separate DOM blocks — `lg:hidden` for the mobile
  composition and `hidden lg:grid`/`hidden lg:flex` for the unchanged desktop one — rather than one
  block trying to be both. This is more DOM than a single responsive block, but it lets each viewport
  have a genuinely different, purpose-built layout (e.g. the mobile hero puts the photo below a
  full-width stacked button pair rather than beside a two-column grid).
- **Global mobile spacing baseline**: `Container` padding raised from `px-4` to `px-5` (16px → 20px)
  on mobile so content isn't flush against the edge; several homepage sections' vertical padding
  changed from a flat `py-20` to `py-16 sm:py-20` so mobile gets slightly less vertical padding than
  desktop while staying generous (64px, not cramped) — confirmed via computed-style checks that no
  section fell below that floor.
- **Weather widget**: added a `compact` prop to `WeatherCard` so the homepage's embedded card shows
  one summary metric (rain) instead of the full 4-metric grid used on `/weather` itself — the full
  grid was the single biggest source of cramped, tiny text on the homepage at 375px.
- **Footer accordion on mobile**: `FooterAccordion.tsx` (new) mirrors `MobileNav`'s single-open-group
  accordion pattern instead of dumping every footer link flat, matching the "calmer, more spacious"
  instruction; desktop keeps the existing condensed group-heading row.
- **Tap targets**: mobile drawer and footer accordion buttons/links set to a `min-h-11`/`min-h-12`
  (44–48px) floor per standard mobile touch-target guidance.
- **Verification method**: the sandboxed browser tool cannot composite screenshots
  (`computer{action:"screenshot"}` fails with "Browser pane is not displayed"), so visual review was
  done via `javascript_exec` — computed `getBoundingClientRect()` geometry, `scrollWidth`/overflow
  sweeps, and section-by-section padding/order checks — at 375, 390, 430 and 768px, across the
  homepage and a representative sample of inner pages (gallery, families, heritage/agado, development,
  weather, contact, diaspora, archive, archive/oral-history, our-people, tipu, our-story, heritage).
  No horizontal overflow was found at any breakpoint; the 768px check confirmed the `lg:` dual-markup
  switch point (1024px) correctly keeps the mobile composition active through tablet width.

## Sixth Pass — Dual-Markup Technical Audit

A follow-up audit specifically checked every component with separate mobile/desktop DOM blocks
(Hero, homepage Takete-Ide Day, homepage Gallery strip, `/takete-ide-day`, `FooterAccordion` +
`Footer`'s desktop row, `MobileNav`, `MegaMenuGroup`) for duplicate `id`s, duplicate form-control
IDs, duplicate ARIA targets, duplicated structured data, duplicate `priority` images, excessive
payload, duplicate analytics, and accessibility fallout from having both compositions in the DOM.

- **No duplicate `id`/`aria-controls`/`htmlFor` found**: none of the audited components use static
  `id` attributes at all — expand/collapse state (`MobileNav`, `FooterAccordion`) is done with
  conditional rendering (`{isOpen && ...}`) and `aria-expanded`, not `id`/`aria-controls` pairs, so
  there was nothing for two simultaneously-mounted instances to collide on.
- **No duplicated structured data**: JSON-LD (`app/news/[slug]`, `app/takete-ide-day/[year]`,
  `Breadcrumb`) is only ever rendered by single-composition pages/components, never by anything with
  a mobile/desktop DOM split.
- **No duplicate analytics**: confirmed no analytics provider is wired up anywhere in the codebase
  (consistent with the "Analytics" decision above), so there is nothing to double-fire.
- **Two `<h1>Takete-Ide Amuro</h1>` exist in the hero's DOM** (mobile + desktop). Left as-is:
  `hidden`/`lg:hidden` compile to `display:none`, which browsers exclude from the accessibility
  tree, so screen readers and heading-navigation only ever see one `<h1>` at a time; this is a
  standard, accepted pattern for CSS-driven responsive compositions and not a defect.
- **Confirmed and fixed: duplicate `priority` hero images.** Both the mobile and desktop hero
  `<Image>` used `priority` on the same source file (`children-traditional-attire.jpg`) with
  different `sizes`. `priority` always injects an unconditional `<link rel="preload">` — Next.js
  doesn't know about `display:none` — so the browser preloaded (and fetched) **both** compositions'
  image variants on every load regardless of viewport, confirmed via network trace (4 separate byte
  ranges of the same file downloaded on one page load). Fixed by removing `priority` from both
  `<Image>`s (default lazy loading means the `display:none` instance never fetches at all — verified
  empirically against the site's other non-priority dual-markup images, which never had this bug) and
  adding two manual, media-scoped `<link rel="preload" as="image" imageSrcSet=... media="(max-width:
  1023px)"/"(min-width: 1024px)">` tags built with `next/image`'s `getImageProps()`, matching the
  same `lg` (1024px) breakpoint as the markup split. Verified post-fix: exactly one network request
  for the hero photo per page load, at every breakpoint tested (390px and 1440px). Note: `href` was
  deliberately omitted from these preload links (matching Next's own internal convention) — including
  it caused React 19's resource-hoisting to emit a second, synthesized href-less copy of each link.

## Third Pass — Authentic Cultural Media Replacement

- **1280px header overflow, fixed**: visually verifying at the requested breakpoints (1440/1280/
  1024/768/430/375) found a genuine ~10px horizontal overflow at exactly 1280px — the header's
  desktop nav switch used Tailwind's `xl:` (1280px) breakpoint with no margin, so at precisely that
  width the full nav, weather indicator, search icon and "Get Involved" button all had to fit with
  zero slack. Replaced `xl:` with a custom `min-[1320px]:` breakpoint across
  `Header.tsx`/`MobileNav.tsx`/`HeaderWeatherIndicator.tsx` so there's real headroom at the boundary.

- **Image identity resolved by hash, not guesswork**: the project owner supplied files named
  `Takete Ide Day.jpg` and `Takete Ide Logo.png`. Byte-for-byte comparison (`md5sum`) confirmed these
  are identical to files already in the project (previously labelled `community-life.jpg` and
  `tipu-emblem.png`). Rather than guess which of two ambiguous "festival tent" photographs was
  "Takete-Ide Day" vs. "marriage celebration," the owner's own filenames were treated as
  authoritative and used directly — no visual-similarity guessing was needed once the real files were
  located.
- **Living Heritage section**: added as a new, image-forward homepage section (Agado Festival, Ate —
  Egungun Heritage, Traditional Marriage, Passing Heritage Forward) per explicit instruction, each
  linking to a dedicated `/heritage/*` page. "Ate" is described only as *one* Egungun tradition, never
  as a synonym for "masquerade" or "Agado" generally, per instruction.
- **Conservative captioning for marriage imagery**: per instruction, the marriage-celebration
  photographs are captioned as "ceremonial items associated with marriage celebrations" — no specific
  ritual meaning is asserted, since it hasn't been verified with community sources.
- **No invented Agado history**: `/heritage/agado` presents only the supplied video and a note that
  historical/cultural context is being compiled with elders — no dates, origins or significance are
  stated.
- **Video captions**: `Agado.mp4` has no caption/transcript track supplied. It is presented with
  native player controls and a visible note that captions aren't yet available, rather than blocking
  the authentic footage from being shown or fabricating a transcript.

## Second Pass — Full Admin CRUD, Search, Structured Data

- **Navigation**: "Heritage" became a header dropdown (Heritage Overview, Traditional Institution,
  Families & Oríkì, Oríkì Archive, Voices of Takete-Ide) instead of a plain link, so Families & Oríkì
  is one click from the top-level nav on every page rather than nested inside "More". This didn't add
  a nav slot (still 8 top-level positions), so it carries no regression risk for the 1024px overflow
  fixed earlier.
- **File uploads**: `components/admin/FileUploadField.tsx` uploads directly from the browser to
  Supabase Storage using the same cookie-based session as the rest of the admin (no new auth
  mechanism). This was chosen over a server-side upload proxy because Storage RLS already restricts
  writes to authenticated staff at the database layer — a proxy would only add latency, not security.
- **Oríkì consent**: added a dedicated `consent_confirmed` column (migration `0011`), separate from
  `publication_permission`. These answer different questions — "may we keep this recording at all"
  vs. "may we show it publicly" — and conflating them would make it impossible to archive a
  performer's Oríkì privately (e.g. for future family review) without also implicitly agreeing to
  publish it.
- **Admin CRUD scope boundary**: every top-level content entity has full create/edit/delete. Two
  sub-resources — event speeches/awards/fundraising, and the TIPU project pipeline — remain
  Supabase Studio-managed, since they're low-frequency data entry one level below an entity that
  already has full CRUD (Events, TIPU). Documented in `docs/ADMIN_GUIDE.md` with the exact pattern
  to extend either if usage later justifies it.
- **Search**: implemented as parallel `ilike` queries across seven tables rather than Postgres full-
  text search (`tsvector`/`pg_trgm` ranking) — the dataset size for a single-community site doesn't
  need ranked relevance search, and `ilike` needs no schema migration or index maintenance. If the
  archive grows very large, `pg_trgm` (already enabled in migration `0001`) is available to upgrade
  this without changing the calling code in `lib/data/search.ts`.

## Image Asset Structure (post-launch fix)

Images were initially organised under `public/images/source/` with source-tracing filenames
(`photo-chieftaincy-1.jpg`, etc). This was reorganised to `public/images/takete-ide/` with
descriptive, purpose-named files (`traditional-ceremony.jpg`, `tipu-emblem.png`, …) — see
`docs/IMAGE_MANIFEST.md`. Non-rendered reference material (the landing-page mockup, source-document
screenshots) moved to `docs/reference/` since it was never meant to be web-servable. A
`components/ui/HeritageImage.tsx` wrapper was added around every content photograph so a failed load
(missing file, broken admin-supplied URL) renders a labelled placeholder instead of a browser
broken-image icon.

## Content & Historical Accuracy

- **Source material**: the supplied "Master Pack" and screenshots contain AI-search-engine-style
  summaries (citing Wikipedia, Facebook, YouTube news channels, "Kogi Reports") rather than primary
  community or church records. Per rule 71 ("never invent facts") and the historical verification
  system required in the brief, every claim drawn from this material is presented on `/our-story`
  with an explicit verification badge (`community_tradition`, `oral_history`, or `unverified`) and a
  source note — never asserted as settled fact.
- **No rulers, no dates for the Olude, no TIPU founding history**: none of the supplied material
  named specific rulers or gave verifiable reign dates, so `/heritage/traditional-institution` and
  `/tipu` ship with populated architecture and explicit empty states rather than invented names.
- **Real supplied photography used directly**: the ceremony/chieftaincy photo, community photo, TIPU
  emblem and Takete-Ide Day 2024/2025 graphics are used as-is in the hero, heritage and TIPU sections
  — no stock photography was substituted, per the brief's image-handling priority order.
- **Seed data**: `supabase/seed/seed.sql` seeds only taxonomies (news categories, tags, gallery album
  shells) — zero fabricated people, rulers, events, projects, families or Oríkì.

## Admin Portal Scope

Given the number of content types (~20 entities), full bespoke create/edit UI for every one was not
achievable to production quality within this build alongside everything else requested. The scope
was deliberately split:

- **Full CRUD in-app**: News articles (flagship example demonstrating the full editorial workflow —
  draft → pending review → verified → published → archived), Website Settings (including the Weather
  admin controls from the weather addendum §20), and Users & Roles.
- **Inbox/review UI in-app** (read + status transition): Contact Messages, Diaspora Submissions,
  Volunteer Submissions, Community Profile Nominations, Heritage Submissions.
- **Read-only list views in-app, manage via Supabase Studio for now**: Takete-Ide Day Events, Gallery,
  Development Projects, Historical Archive, Oral Histories, Traditional Institution, Families &
  Oríkì, Community Profiles (Our People), Documents & Media Library.

`docs/ADMIN_GUIDE.md` documents this split explicitly and shows how to extend any read-only section
into full CRUD using `lib/actions/admin-news.ts` and `components/admin/NewsForm.tsx` as the template
— the pattern is identical for every table.

- **Role enforcement**: RLS enforces the public/staff read boundary and public-insert-only on
  submission tables correctly. Fine-grained per-role *write* restrictions (e.g. "only a historian may
  set `verified`") are enforced in the admin application layer (`requireStaff(minRole)`) rather than
  in Postgres policies for v1 — documented as a hardening follow-up in `docs/SECURITY.md`.
- **First administrator**: no account is seeded. `docs/ADMIN_GUIDE.md` documents the exact SQL to
  promote the first Supabase Auth user to `super_admin` after sign-up.

## Weather

- **AccuWeather icons**: rendered via AccuWeather's documented public icon CDN pattern
  (`developer.accuweather.com/sites/default/files/{icon}-s.png`) rather than bundling their icon set
  locally — avoids licensing the icon assets while keeping the required "Weather data provided by
  AccuWeather" attribution and link on every weather surface.
- **Caching**: current conditions and forecast are fetched server-side with a 30-minute
  `next: { revalidate }` window — real-time-per-request calls aren't necessary for a daily-cadence
  civic weather feature and would needlessly burn API quota.

## Testing & Domain

- **Testing depth**: `npm run lint`, `npm run typecheck` and `npm run build` are treated as the hard
  gate for "done." A focused Playwright smoke suite covers homepage render, primary navigation, the
  contact form's client validation, and the admin login gate being enforced — not the full exhaustive
  matrix listed in the brief's QA section, which would require a staffed QA pass against a live
  Supabase project this environment doesn't have. This is stated plainly rather than claimed as full
  coverage, per the brief's own instruction not to declare completion with known gaps unstated.
- **Domain**: no domain has been purchased. `NEXT_PUBLIC_SITE_URL` defaults to
  `https://taketeideamuro.org` as a placeholder and is fully overridable via environment variable at
  deploy time.
