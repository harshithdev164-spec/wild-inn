# public/reels/

Drop your reel video files (and optional posters) here. They are served at `/reels/<name>`.

- `kabini-dawn.mp4`  ->  referenced in db/reels.json as `"video_url": "/reels/kabini-dawn.mp4"`
- `kabini-dawn.jpg`  ->  optional poster, auto-detected as `/reels/kabini-dawn.jpg`

Keep clips short (~30s), 1080x1920 (9:16), H.264 MP4, ideally < 15 MB each.
Then run:  npm run reels:sync
