# Content Guide

## Editorial Workflow

Most content tables share a `status` column with five stages:

`draft → pending_review → verified → published → archived`

Only `published` rows appear on the public site. `verified` is a distinct, earlier stage from
`published` deliberately — a fact can be confirmed accurate before an editor decides it's ready to
go live (e.g. waiting for the right Takete-Ide Day to announce it).

## Writing News

- Body content is **Markdown** (GitHub-flavoured — tables, lists, links, blockquotes all work).
  Paste plain text or Markdown into the Body field in `/admin/news`; it renders through
  `react-markdown` on the public article page.
- Always fill in **Featured Image Alt Text** when you set a Featured Image — this is what screen
  reader users hear, and what shows if the image fails to load.
- Slugs auto-generate from the title if left blank; only set one manually if you need a specific URL.

## Historical & Cultural Content

Any claim about Takete-Ide's history, traditional institution, families, or Oríkì must carry a
verification status — see `docs/HISTORICAL_VERIFICATION.md`. Never mark something `verified` without
a named source and (ideally) a `verification_records` entry backing it up.

For families and Oríkì specifically: the *original wording* is the primary record. Never
paraphrase, "clean up," or auto-translate an Oríkì — store the exact original text, and put any
translation or interpretation in the separate `english_interpretation` field so the two are never
conflated.

## Empty States Are Not Bugs

If a section of the site shows "This is being prepared" or similar, that's correct behaviour when
no verified content exists yet — it is strongly preferred over inventing placeholder content. See
`components/ui/EmptyState.tsx`.

## Images

Priority order when adding imagery to any section: (1) real supplied/contributed Takete-Ide
photography, (2) neutral icons/graphics (the `lucide-react` icon set already used throughout), (3)
placeholders as an absolute last resort. Never substitute generic stock photography for a
community-specific claim (e.g. "our traditional institution") — use an icon and an honest empty
state instead.

## Managing the Weather Section

See `docs/WEATHER_INTEGRATION.md` and `/admin/settings`.

## Site-wide Settings

Site title, tagline, contact details, social links, footer text and the Weather visibility toggles
are all editable at `/admin/settings` without touching code — see `docs/ADMIN_GUIDE.md`.
