# Image Manifest

Permanent, web-servable Takete-Ide imagery lives at `public/images/takete-ide/`. Nothing under
`public/` references a local Windows path or a temporary upload path — every image is a checked-in
file resolved by Next.js at a stable `/images/takete-ide/...` URL that works identically in dev and
after Vercel deployment.

| File | Used on | Description | Source |
|---|---|---|---|
| `traditional-ceremony.jpg` | Homepage hero, Heritage, Traditional Institution | A traditional chieftaincy ceremony — an elder crowning a chief in full regalia | Supplied community photograph |
| `community-life.jpg` | Gallery fallback | Community members with a ceremonial object, drum, and community hall | Supplied community photograph |
| `takete-ide-day-2025.jpg` | Homepage, Takete-Ide Day | News Central broadcast still: "Kogi Celebrates Takete-Ide Day 2025" | Supplied press screenshot |
| `takete-ide-day-2024.jpg` | Homepage, Takete-Ide Day | Branded event graphic: "Takete Ide DAY 2024 Celebration" | Supplied event graphic |
| `tipu-emblem.png` | `/tipu` only | Official Takete-Ide Progressive Union circular emblem, motto "Faith, Unity and Progress" | Supplied emblem artwork (high-resolution version) |

Reference-only material that informed the build but is never rendered on the live site (design
mockups, source document screenshots) lives under `docs/reference/` instead of `public/`, so it
isn't shipped to visitors or counted against the app bundle.

## Adding a New Image

1. Drop the file into `public/images/takete-ide/` with a descriptive, kebab-case name.
2. Reference it as `/images/takete-ide/<filename>` via `next/image`'s `<Image>` — never an absolute
   filesystem path.
3. Add a row to the table above.
4. If the image might legitimately be missing at runtime (e.g. admin-managed content), wrap it in
   `components/ui/HeritageImage.tsx` rather than a bare `<Image>`, so a failed load falls back to a
   labelled placeholder instead of a broken-image icon.

## Quality Notes

Several supplied source photographs are modest-resolution community photography, not studio
photography. They are displayed at `object-fit: cover` with deliberate, content-safe cropping —
never stretched beyond their native resolution, and never edited to alter what's depicted (spec
§41/§11 of the Families & Oríkì rules apply equally to community photography in general).
