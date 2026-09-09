# Reels + Neon

The `/reels` page is a full-screen vertical video feed. It reads reel **metadata** from
Neon Postgres via `GET /api/reels`; the video **files** are served from `public/reels/`
(or any external URL you put in `video_url`).

Setup is already done: the table exists (`db/schema.sql`), the Neon project is linked
(`neon link`), and `DATABASE_URL` is in `.env.local`. Run `npm run db:check` to confirm.

---

## Add reels — the normal loop

### 1. Get the video files

Your **own** Instagram reels: the fastest source is the **original clips in your phone's
camera roll**. If you no longer have them, request them from Meta:

> Instagram → Settings → **Accounts Centre** → Your information and permissions →
> **Download your information** → select **Reels**, format HTML/JSON, "All time" →
> submit. You get a ZIP with the `.mp4` files (usually within minutes to a few hours).

Do **not** hotlink an `instagram.com` URL — there's no stable public MP4 and an embed
carries Instagram's own UI. We host the file ourselves.

Optional but recommended — normalise each clip (needs `ffmpeg`; `scoop install ffmpeg`):

```
ffmpeg -i input.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
       -c:v libx264 -crf 24 -preset veryfast -c:a aac -b:a 128k -movflags +faststart \
       -t 30 public/reels/kabini-dawn.mp4
```

### 2. Drop the files in `public/reels/`

Name each file after the reel's `id`, e.g. `public/reels/kabini-dawn.mp4`.
A matching `public/reels/kabini-dawn.webp` is picked up automatically as the poster;
if you have `ffmpeg`, the sync script generates one for you.

### 3. Describe them in `db/reels.json`

```jsonc
{
  "id": "kabini-dawn",                 // stable slug; also the file name
  "title": "Dawn on the backwaters",
  "tour_slug": "kabini",               // optional; must match a destination id (see below)
  "location": "Kabini, Karnataka",
  "description": "First light, and the forest starts to move.",
  "video_url": "/reels/kabini-dawn.mp4",
  "poster_url": null,                  // null = auto (/reels/<id>.webp or ffmpeg frame)
  "duration_sec": 30,
  "aspect_ratio": "9:16",
  "sort_order": 10,                    // ascending = feed order
  "published": true                   // false hides it without deleting
}
```

`tour_slug` options: `kabini`, `bandipur`, `masinagudi`, `bhadra`, `brt`, `anamalai`
— renders a "View this experience" button linking to `/experiences/<slug>`.

### 4. Push to Neon

```
npm run reels:sync          # upsert every row in db/reels.json
npm run reels:sync:prune    # same, and delete DB rows not in the file (make it a mirror)
```

Reels appear on the next page load — no redeploy. In dev, refresh `/#/reels`.

---

## Using Mux / Cloudflare Stream instead of public/reels/

Put the playback URL straight in `video_url` (leave the file out of `public/reels/`):

- **Mux** — enable "MP4 support" on the asset →
  `video_url: https://stream.mux.com/<PLAYBACK_ID>/high.mp4`,
  `poster_url: https://image.mux.com/<PLAYBACK_ID>/thumbnail.jpg?time=1`.
  An `.m3u8` URL also works — the player loads `hls.js` on demand.
- **Cloudflare Stream** — `video_url: https://<hash>.cloudflarestream.com/<uid>/downloads/default.mp4`
  (or `.../manifest/video.m3u8`).

Then just `npm run reels:sync`.

---

## Production

The site deploys as a **static build** (no Node server), so `npm run build` bakes the feed
into `public/reels-data.json` (via `scripts/build-reels-data.mjs`, straight from
`db/reels.json`). The `/reels` page tries `GET /api/reels` first and falls back to
`/reels-data.json` — so it works on any static host.

**This means production only updates when you rebuild + redeploy.** After editing reels:

```
npm run reels:sync   # push to Neon (dev / system of record)
npm run build        # regenerates public/reels-data.json
# redeploy
```

`serve.js` (`npm run serve`) still works if you ever host on a Node runtime — it serves
`dist/` + a live `/api/reels` from Neon.
