# Image Manifest

Permanent, web-servable Takete-Ide imagery lives at `public/images/takete-ide/`; video at
`public/videos/takete-ide/`. Nothing under `public/` references a local Windows path or a temporary
upload path — every asset is a checked-in file resolved at a stable URL that works identically in dev
and after Vercel deployment.

## Current Assets

| File | Used on | Description |
|---|---|---|
| `children-traditional-attire.jpg` | Homepage hero | Two children in traditional blue Takete-Ide attire, caps and beaded necklaces |
| `takete-ide-day.jpg` | Homepage, Takete-Ide Day, Traditional Institution | Community members (with drums) preparing for a Takete-Ide Day celebration |
| `takete-ide-day-2025.jpg` | Homepage, `/takete-ide-day/2025` | News Central broadcast still: "Kogi Celebrates Takete-Ide Day 2025" |
| `cultural-procession.jpg` | Homepage Living Heritage ("Passing Heritage Forward"), Gallery | Children in a cultural procession — Children & Cultural Heritage |
| `ate-egungun.jpg` | Homepage, `/heritage/ate` | Ate, one of the Egungun (masquerade) traditions of Takete-Ide |
| `marriage-celebration-1.jpg`, `marriage-celebration-2.jpg` | Homepage, `/heritage/traditional-marriage` | Ceremonial items and a gathering associated with marriage celebrations |
| `tipu-emblem.png` | Site logo (header/footer/mobile nav/admin), `/tipu` | Official TIPU emblem, motto "Faith, Unity and Progress" |
| `agado-festival.mp4` (video) | `/heritage/agado`, homepage Living Heritage preview | Community video footage of the Agado Festival |

## Removed

`traditional-ceremony.jpg` (a crowning/chieftaincy photograph) and `takete-ide-day-2024.jpg` (a
cropped Takete-Ide Day artwork graphic) were removed at the project owner's explicit request and no
longer exist anywhere in `public/`, code, docs, or seed data. Do not reintroduce them.

## Adding a New Image or Video

1. Drop the file into `public/images/takete-ide/` (or `public/videos/takete-ide/`) with a descriptive,
   kebab-case name.
2. Reference it as `/images/takete-ide/<filename>` (or `/videos/...`) via `next/image` / a `<video>`
   — never an absolute filesystem path.
3. Add a row to the table above.
4. Wrap it in `components/ui/HeritageImage.tsx` / `HeritageVideo.tsx` rather than a bare
   `<Image>`/`<video>`, so a failed load falls back to a labelled placeholder instead of a broken-media
   icon.

## Quality & Authenticity Notes

Every photograph and the Agado video are genuine community-supplied media — nothing on this list is
AI-generated or stock photography standing in for a specific cultural claim. Captions describe only
what is visibly confirmable (e.g. "ceremonial items associated with marriage celebrations") rather
than asserting ritual meaning that hasn't been verified with community sources — see
`docs/HISTORICAL_VERIFICATION.md`. Source photography is modest-resolution community photography, not
studio photography; it is displayed at `object-fit: cover` with content-safe cropping, never stretched
or altered.
