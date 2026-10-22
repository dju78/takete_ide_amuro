# Centenary Live Broadcast — Operator Runbook

**Event:** Takete-Ide Centenary Celebration, 29–31 October 2026 · **Times:** West Africa Time (WAT, UTC+1, Africa/Lagos)
**Public hub:** <https://takete-ide.org/live> · **Control screen:** <https://takete-ide.org/admin/live> (editor role or higher)
**Official channels (confirmed):** YouTube <https://www.youtube.com/channel/UCsLauLD7WlDBneUhDxl2VRw> ·
Facebook <https://www.facebook.com/profile.php?id=61595124084233> ·
Instagram <https://www.instagram.com/taketeideofficial/> (profile link only; Instagram live streaming is optional, §3)

> **Status of this setup (22 October 2026):** the website viewing hub is built and configured. **No real broadcast
> has been tested.** The camera/audio feed, OBS, YouTube/Facebook account authorisation and the venue internet are
> operational steps that still have to be done and rehearsed by the broadcast team (§7, §12).

> **Never** put a stream key, RTMP address, password or YouTube Studio / Facebook Live Producer link into the
> website, a GitHub issue, a pull request, WhatsApp groups or this document. Stream keys go only into OBS (or the
> multistream service) on the broadcast laptop. If a key is ever exposed, reset it in YouTube Studio / Facebook
> immediately.

## 1. How it works

```
Venue cameras + microphones
        │  (HDMI / USB capture, mixer audio)
        ▼
Broadcast laptop running OBS Studio  ──►  local recording (MKV/MP4 on laptop disk)
        │  one or two outgoing streams (see §3)
        ▼
YouTube Live  +  Facebook Page Live          (+ Instagram / TikTok only if eligible)
        │
        ▼
takete-ide.org/live embeds the YouTube player + YouTube live chat
```

The website does **not** broadcast anything. It only embeds the public YouTube player. Viewers on Facebook watch
and comment on Facebook; those comments are **not** combined with the YouTube chat.

## 2. Equipment and access checklist

| Item | Notes |
|---|---|
| Broadcast laptop | Windows/macOS, i5/Ryzen 5 or better, 8 GB+ RAM, 100 GB free disk for recordings, charger |
| OBS Studio (free) | <https://obsproject.com> — latest stable |
| Video source | Camera with clean HDMI out + USB HDMI capture device, or a webcam as backup |
| Audio | Feed from the venue PA mixer (line out → USB audio interface) — **not** the camera mic. Wired headphones for monitoring |
| Internet | Primary + backup (e.g. two different mobile networks, or Starlink + mobile hotspot). See §6 |
| Power | UPS or power bank for laptop + router; generator fuel for all three days; extension leads |
| Accounts | Owner/manager access to the **YouTube channel** and **Facebook Page**; website admin login with editor role |
| People | 1 operator (OBS), 1 chat moderator, 1 person on the website control screen (can be the moderator) |

## 3. Choosing the distribution method (verified prices, October 2026)

Both options use the same OBS settings. Decide after the venue upload test in §6.

| Option | Cost | Upload needed at venue | When to choose |
|---|---|---|---|
| **A. OBS + `obs-multi-rtmp` plugin** — OBS sends one stream to YouTube and a second directly to Facebook | **₦0 / $0** (open source) | ≈ 2 × stream bitrate (≈ 8.5 Mbps at the settings below). Our rule of thumb: measure **≥ 16 Mbps** sustained (about 2× headroom) | Venue upload is strong and stable |
| **B. Restream** — OBS sends one stream to Restream, which forwards to YouTube + Facebook | **Free** plan (2 channels, Restream branding) **or Standard US$19/month** (3 channels, no branding) — see note below | ≈ 1 × bitrate (≈ 4.3 Mbps). Rule of thumb: measure **≥ 8 Mbps** sustained | Venue upload is limited |
| **C. YouTube only** — OBS streams to YouTube; share the YouTube link on Facebook as a post | **$0** | ≈ 1 × bitrate | Fallback if Facebook streaming is not authorised or eligible |

The upload figures are planning rules of thumb (stream bitrate plus headroom for mobile-network variation), not
platform requirements.

Verified facts (checked 22 October 2026):
- Restream Free: 2 simultaneous channels, Restream branding on the stream; Standard: US$19/month, 3 channels, no
  branding ([pricing](https://restream.io/pricing), [free plan](https://support.restream.io/en/articles/9127747-is-restream-free)).
  **Facebook Pages on the Free plan are uncertain:** an earlier version of Restream's Facebook Page article said
  Standard or higher was needed; the current [article](https://support.restream.io/en/articles/6158091-stream-to-a-facebook-page)
  does not name a plan, and Facebook *Groups* are documented as paid-only. Connect the Facebook destination in the
  Restream dashboard during the rehearsal: if it is refused on Free, either subscribe (owner decision) or use option A or C.
- `obs-multi-rtmp` is a free OBS plugin that sends to several RTMP servers at once and can share the main encoder
  ([GitHub releases](https://github.com/sorayuki/obs-multi-rtmp/releases)).
- YouTube Live is free; the channel must be **verified** and have **no live-streaming restriction in the last 90 days**
  ([YouTube help](https://support.google.com/youtube/answer/2474026)).
- Facebook Live is free; Meta requires the Facebook account to be **at least 60 days old** and a **Page or
  professional-mode profile to have at least 100 followers** to go live
  ([Restream, citing Meta](https://support.restream.io/en/articles/6158091-stream-to-a-facebook-page)). The confirmed
  address `facebook.com/profile.php?id=61595124084233` is a public page/profile link; it does **not** by itself show that
  the account is eligible to go live or authorised in OBS/Restream. Check eligibility in Facebook
  (facebook.com/live/producer → "Go live") before the rehearsal.
- **Instagram** (optional): needs a Professional account; desktop "Live Producer" gives a temporary key per session;
  9:16 vertical recommended — a separate vertical output is required. **TikTok** (optional): computer streaming (LIVE
  Studio / stream key) is not automatically available and depends on follower count and approval. Treat both as
  optional until the owner confirms access in the apps.

Nothing has been purchased or activated. Choosing option B requires the owner to subscribe.

## 4. Connect YouTube and Facebook (owner, before rehearsal)

**YouTube** (YouTube Studio → Create → Go live → Manage → Schedule stream), one event per day is easiest:
1. Title e.g. "Takete-Ide Centenary Celebration — Day 1 (29 Oct 2026)", visibility **Public** (or Unlisted for the
   rehearsal), audience "No, it's not made for kids" (made-for-kids streams have chat disabled).
2. Settings → **enable live chat**, enable **DVR**, latency "Low latency".
3. Copy the **stream key** into OBS (or Restream) on the broadcast laptop only.
4. Copy the **share link** (`https://youtube.com/live/XXXXXXXXXXX`) — this public link is what goes on the website.
5. Customisation → **Embedding allowed** must be on, otherwise the website player will not play.

**Facebook (the confirmed account above):** log in as an admin of that account → facebook.com/live/producer →
choose the Takete-Ide page/profile → "Streaming software" → copy the stream key into OBS (option A) or connect it in
Restream (option B). The website already links to the page address. Once a Facebook live video exists, you may
optionally replace the link in `/admin/live` with that video's public URL (…/videos/…); the button then changes from
"Takete-Ide on Facebook" to "Watch on Facebook".

## 5. OBS settings

Settings → Output (Advanced): Encoder x264 or NVENC/QuickSync H.264, **CBR 4,000 kbps**, keyframe interval **2 s**,
profile high. Video: base/output **1280×720**, **30 fps**. Audio: **AAC 128 kbps, 44.1 kHz stereo**.
These sit inside Meta's 720p30 range (1,500–4,000 kbps) and above YouTube's 720p30 minimum (3 Mbps); keyframes ≤ 4 s
are required by both ([YouTube](https://support.google.com/youtube/answer/2853702),
[Meta](https://developers.facebook.com/docs/live-video-api/guides/streaming)). Use RTMPS servers where offered.

- Option A: Stream → Service "YouTube – RTMPS" + key. Then *Tools → Multiple output* (plugin) → add Facebook
  target `rtmps://live-api-s.facebook.com:443/rtmp/` + key, "share encoder with main output".
- Option B: Stream → Service "Restream.io" → connect account; add YouTube + Facebook Page in Restream dashboard.
- Settings → Output → Recording: **record to the laptop disk** as MKV (remux to MP4 after; File → Remux). Start
  recording before streaming.
- Scenes: "Starting soon" (with programme card), "Main camera", "Short break", "Technical difficulties", "Ended".

## 6. Venue checks (do them at the venue, at event time of day)

- **Upload speed**: run speedtest.net 3× on each connection; use the **lowest** result. Requirements in §3.
- Plug the laptop into the router by cable if possible; disable Windows updates, OneDrive/Google Drive sync, sleep.
- **Audio**: mixer line-out level peaks around −12 to −6 dB in the OBS meter; check for hum/buzz; check the MC mic,
  choir and talking drums separately; monitor with headphones the entire time.
- **Power**: laptop and router on UPS/power bank; test a deliberate generator switch-over; fuel for 3 days.
- **Light**: face of the podium speaker evenly lit; avoid shooting into the sun/windows.

## 7. Rehearsal (by Tuesday 27 October 2026)

1. Create an **Unlisted** YouTube event; stream 30+ minutes from the venue with real audio.
2. Put its link in `/admin/live`, set status **Live**, open `/live` on a phone and a desktop: player plays, chat loads
   on desktop, "Open chat on YouTube" works on the phone, Facebook link opens.
3. Pull the network cable for 30 s and confirm recovery; switch to the backup connection.
4. Check the local recording file plays back.
5. Set status back to **Scheduled** and the video ID to the real Day 1 event when finished.

## 8. Updating the website

**Fast path (no deploy): `/admin/live`** — requires migration `supabase/migrations/0028_live_broadcast_settings.sql`
to have been applied once. Until then the screen shows the current settings with **"Saving unavailable"** and the
public page uses `lib/live/broadcast-config.ts`. Fields:
- *YouTube video ID or public link* — paste the share link; the ID is extracted. Invalid or private links are refused.
- *Status* — **manual**: Scheduled → Live (when OBS is streaming and YouTube shows it) → Temporarily interrupted (if
  the signal drops) → Ended. The site does not detect this automatically; the YouTube player itself shows YouTube's
  real state.
- *Status message*, *Scheduled start (WAT)*, *public platform links*, *Replays* (one per line:
  `Title | Day | link`).
Save → visitors already on `/live` update within ~1 minute; new visitors immediately to ~1 minute.

**Fallback path:** edit `lib/live/broadcast-config.ts`, commit, push to `main` → Netlify deploy (several minutes).
The programme is edited under **Admin → Centenary 2026** (existing screen).

## 9. Chat moderation

- Add the moderator in YouTube Studio → Settings → Community → **Moderators** (their Google account).
- Before going live: Community → **Blocked words** (add abusive words, phone-number/"WhatsApp me" scam phrases),
  turn on "Hold potentially inappropriate messages for review", consider **slow mode** (e.g. 10 s).
- During: remove messages, put users in timeout, hide users; never share bank details in chat other than the official
  account on the Support page.
- Facebook comments are moderated separately on the Page (Page settings → Moderation, keyword blocking).
- The website stores no chat or comments.

## 10. When something fails

| Problem | Action |
|---|---|
| Internet drops briefly | Set `/admin/live` to **Temporarily interrupted**; switch to backup connection; OBS reconnects automatically. YouTube keeps the same event if the stream resumes within its timeout. Set back to **Live**. |
| YouTube event ends / new event needed | Create a new event, put the new link in `/admin/live` — open pages offer "Switch to the new stream". |
| Power cut | UPS keeps laptop + router up; local recording continues on battery. Mark **Interrupted** if streaming stops. |
| One destination fails (e.g. Facebook) | Keep streaming to YouTube; website is unaffected. Post the YouTube link on the Facebook Page. |
| Embedded chat will not load / sign-in blocked | Expected in some browsers and on all phones — viewers use "Open chat on YouTube". |
| Player shows "Video unavailable" | Check the event is Public/Unlisted and **embedding is allowed** in YouTube Studio. |
| Whole stream impossible | Record locally, publish the recording later as a replay; set status **Ended** with a message. |

## 11. After each session: replays

1. Stop streaming, then stop recording; set status **Ended** (or **Scheduled** with next day's video ID).
2. YouTube archives a stream automatically if it is **under 12 hours**; longer streams may not be captured
   ([YouTube help](https://support.google.com/youtube/answer/6247592)) — so use one YouTube event per day/session.
   Once processed, add it in `/admin/live` →
   Replays: `Day 1 — Opening ceremony | 1 | https://youtube.com/live/XXXXXXXXXXX`.
3. Keep the local recording; if the live archive is poor or missing, upload the local file to YouTube and use that link.
4. Back up recordings to a second drive before leaving the venue.

## 12. Owner actions still required

1. Confirm the YouTube channel is verified and live streaming is enabled (YouTube Studio → Create → Go live).
2. Facebook public address: **done** (`profile.php?id=61595124084233`, on the website). Still required: confirm the
   account meets Meta's live requirements (60-day account, 100 followers) and who has admin access to stream.
3. Choose distribution option A, B or C after the venue upload test; subscribe to Restream Standard only if B needs it.
4. Apply migration `0028_live_broadcast_settings.sql` in Supabase (SQL editor) to enable `/admin/live`.
5. Create the scheduled YouTube event(s) and paste the share link(s) into `/admin/live`.
6. Confirm daily session start times so they can be entered in Admin → Centenary 2026.
7. Name the operator and chat moderator(s); add moderators in YouTube Studio.
8. Run the rehearsal (§7) before 29 October.
9. Instagram / TikTok: optional — only if the accounts already have computer-streaming access.
