# Community Media Import — TIPU Archive (August 2026)

A curated set of photographs and video from the Takete-Ide Progressive Union community archive was
imported into the site, alongside a small set of community-supplied landscape and landmark
photographs. This document records what was taken, what was left out and why, and the checks run
before publication.

## Where the files live

| Kind | Path |
|---|---|
| Attire | `public/images/takete-ide/centenary-attire/` |
| TIPU branches & chapters | `public/images/takete-ide/tipu-branches/` |
| New Yam Festival | `public/images/takete-ide/new-yam-festival/` |
| Places, nature, landmarks | `public/images/takete-ide/places/` |
| Video poster frames | `public/images/takete-ide/video-posters/` |
| Video | `public/videos/takete-ide/` |

Nothing in the application references the temporary `takete_ide_web_media/` upload folder or any
Windows path — every asset resolves from `public/` and works identically in dev and on Vercel. The
upload folder and its zip are gitignored; they can be deleted once this import is signed off.

## How it is organised

Baseline metadata for every item lives in `lib/media/community-media.ts` as typed records
(`title`, `description`, `altText`, `category`, `event`, `branch`, `eventDate` / `eventPeriod`,
`location`, `featured`, `published`, `verificationStatus`, `source`). Because it ships with the
application, the media renders correctly with no database at all.

Editors override any of it from **Admin → Community Media** (`/admin/community-media`), which writes
to `community_media_overrides` (migration `0012`). `lib/data/community-media.ts` merges the two at
read time, so correcting a caption, moving an item between categories, adding verified names or
unpublishing a photograph takes effect immediately — **no deploy required**. "Reset" discards the
overrides for an item and restores the metadata it was imported with.

## Files used

### Official attire — `Centenary` (4 photographs)
Page: `/takete-ide-day/cultural-attire`, linked from `/takete-ide-day` and `/centenary`.

`attire-group.jpg` (lead), `attire-women.jpg`, `attire-man.jpg`, `attire-fabric.jpg`.

### TIPU Lokoja Branch — `TIPU` (4 photographs)
Page: `/tipu/branches/lokoja`. Meeting of 16 August 2026.

`lokoja-branch-group.jpg` (lead), `lokoja-meeting-01.jpg`, `-02.jpg`, `-03.jpg`.

### TIPU UK & Europe Chapter — `Diaspora` (1 photograph)
Page: `/diaspora/uk-europe`, featured on `/diaspora` and in the homepage diaspora section.
Inaugural meeting, 19 August 2026.

`uk-europe-inaugural-group.jpg` (lead).

### TIPU Ilorin Branch New Yam Festival — `Culture & Events` (7 photographs, 2 videos)
Page: `/tipu/branches/ilorin`.

`full-group.jpg` (lead), `group.jpg`, `community-group.jpg`, `cultural-address.jpg`,
`award-presentation-01.jpg`, `award-presentation-02.jpg`, `guests.jpg`,
`new-yam-ilorin-promo.mp4`, `new-yam-ilorin-award-presentation.mp4`.

### Community development video — `Development` (2 videos)
Page: `/development/community-at-work`, surfaced as poster cards on `/development`.

`community-at-work.mp4` (imported from `community-road-work.mp4`),
`king-palace-construction.mp4`.

### Nature, landmarks and places of worship (9 photographs)
Gallery categories `Nature`, `Landmarks`, `Places of Worship`, `Development`. Obasoro Hill, the Eba
River bank and the First Baptist Church lead the homepage's "The Land We Come From" section; Okuta
Gbooro appears in the homepage photo strip below it.

`obasoro-hill.jpg`, `okuta-gbooro.jpg`, `eba-river-bank.jpg`, `eba-river.jpg`,
`first-baptist-church.jpg`, `first-baptist-church-grounds.jpg`, `church-of-god-in-christ.jpg`,
`ecwa-church.jpg`, `telecoms-mast.jpg`.

## Files deliberately not used

| File | Reason |
|---|---|
| `tipu-uk-europe-inaugural-video-call.jpg` | Updated and adopted as the lead chapter visual (`uk-europe-inaugural-group.jpg`) following user review, with personal WhatsApp display handles (~ fanwokingsley and ~ Bunmi Noel) sanitized out to preserve privacy while capturing the authentic inaugural meeting. |
| `obasoro hill.png`, `Baptist church.png`, `Church of God in Christ.png`, `ChatGPT Image ….png`, `Eba_River_Full_Enhanced.jpg` | AI-generated or heavily AI-restyled versions of the authentic photographs — the Baptist church render invents a signboard, landscaping and a bell tower that are not in the real photograph. The site's authenticity policy forbids AI imagery standing in for a heritage claim, so the genuine camera originals were imported instead. |
| `Award.jpeg`, `TIPU President Recieving Award from Ilorin TIPU.jpeg`, `TIPU Section in Ilorin.jpeg` | Additional award photographs covering the same occasion already documented by the curated New Yam set, and carrying the same unverified-name question. Nothing is added by publishing more of them. |
| Remaining files in the source Desktop folder | Duplicates or alternate frames of photographs already imported. |

## Verification and privacy decisions

- **No individual is named anywhere.** Alt text and captions describe what is visible, never who.
  The admin form has a "Verified names" field that stays empty until the community confirms both the
  identification and that publication is appropriate.
- **Award citations are not transcribed.** The plaque text is legible in two photographs and in the
  award video. Per the import brief it was not converted into metadata; the published description is
  "an award and recognition moment during the TIPU Ilorin Branch cultural gathering."
- **The road video is not a road project.** `community-at-work.mp4` is published under the neutral
  title "Community at Work" with an explicit note that the road and the nature of the work are
  unconfirmed. It carries `pending-verification` so the caveat renders to visitors.
- **Palace footage** is likewise `pending-verification` — it is described as building works at the
  palace, quoting the community's own supplied description, with no dates or responsible parties
  asserted.
- **New Yam date.** The branch's own promotional video states "Saturday 22 August 2026", so that date
  is used rather than a vaguer "August 2026".
- **The homepage shows each photograph once.** "The Land We Come From" carries place; the strip below
  it carries culture, diaspora, dress, union and one landmark, plus one existing community
  photograph. No image appears twice on the page, and the whole selection is eight `featured` items
  an editor can change from the admin area.

### Outstanding question for the community

The attire photographs were supplied as the **official Centenary attire**, but the sashes and the
bag visible in `attire-group.jpg` carry **Takete-Ide Day 2025** branding. That item is flagged
`pending-verification` and the page shows a short "still being confirmed" note. If the committee
confirms the 2026 attire is the same cloth, an administrator can clear the flag from
`/admin/community-media` without a deploy.

### Noted, not blocking

The three Lokoja meeting interiors were taken inside a private home and include framed family
portraits on the walls. They are published as supplied, but if the branch would rather they weren't,
any of them can be unpublished from the admin area in a couple of clicks.

## Video handling

- `preload="none"` plus a real poster frame on every player: opening a page costs one small JPEG,
  and no video bytes are fetched until a visitor presses play.
- Posters are genuine frames extracted from each clip by `scripts/extract-video-posters.mjs`
  (re-run it after adding a video). No poster is a stand-in from a different source.
- Native `controls`, `playsInline`, an `aria-label`, a visible heading and a written description on
  every player; portrait phone clips render in a 9:16 frame instead of being letterboxed into 16:9.
- **Captions are stated as unavailable rather than fabricated.** No `<track>` is emitted for a
  recording nobody has transcribed.
- No video appears on the homepage. `/development` shows poster cards that link to the player.
- Source files were copied byte-for-byte; nothing was transcoded or re-compressed.

## Pre-publication audit

| Check | Result |
|---|---|
| No unrelated WhatsApp media imported | Pass — the only WhatsApp-origin file was excluded (see above) |
| No bank/payment screenshots | Pass |
| No birthday-only material | Pass |
| No political campaign material | Pass |
| No chain-message graphics | Pass |
| No personal contact information published | Pass — the file carrying WhatsApp handles was excluded |
| Filenames meaningful | Pass — all descriptive kebab-case |
| Images render | Pass — verified in-browser across every new page |
| Videos play | Pass — all four decode and play (durations and dimensions confirmed) |
| Mobile video layout | Pass — no horizontal overflow at 375px; portrait 9:16, landscape 16:9 |
| Alt text on every image | Pass — asserted by `tests/e2e/community-media.spec.ts` |
| Performance | Pass — no video on the homepage; every player `preload="none"` |
| Gallery filtering | Pass — new categories filter correctly; lightbox opens and closes |
| Existing gallery records intact | Pass — `gallery_items` is untouched; imported media is appended, never substituted |

One background detail worth knowing: the marquee in several New Yam photographs carries the tent
vendor's own painted advertising, including their business phone number. That is a company's public
signage at a public event rather than anyone's personal contact detail, so it was left as shot.
