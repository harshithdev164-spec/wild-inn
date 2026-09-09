// Bring an external video into public/reels/ as a web-ready reel + poster.
//
//   node scripts/import-reel.mjs <input> <id> [--copy] [--seconds N]
//
//   <input>      path to the source video (e.g. ~/Downloads/Video-1185.mp4)
//   <id>         reel slug — becomes public/reels/<id>.mp4 and .webp
//   --copy       remux only (lossless, keeps size); default re-encodes 720x1280 CRF 30 + faststart
//   --seconds N  poster frame timestamp (default 1)
//
// Uses the bundled ffmpeg-static / ffprobe-static — no system ffmpeg needed.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';

const run = promisify(execFile);
const require = createRequire(import.meta.url);
const FFMPEG = require('ffmpeg-static');
const FFPROBE = require('ffprobe-static').path;

const args = process.argv.slice(2);
const copy = args.includes('--copy');
const posterAt = Number(args[args.indexOf('--seconds') + 1]) || 1;
const [input, id] = args.filter((a) => !a.startsWith('--') && a !== String(posterAt));

if (!input || !id) {
  console.error('usage: node scripts/import-reel.mjs <input> <id> [--copy] [--seconds N]');
  process.exit(1);
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
  console.error(`✗ id "${id}" must be a lowercase slug (a-z, 0-9, -).`);
  process.exit(1);
}

await mkdir('public/reels', { recursive: true });
const outVideo = `public/reels/${id}.mp4`;
const outPoster = `public/reels/${id}.webp`;

// ---- probe -------------------------------------------------------------
const { stdout: probe } = await run(FFPROBE, [
  '-v', 'error',
  '-select_streams', 'v:0',
  '-show_entries', 'stream=width,height:format=duration',
  '-of', 'json',
  input,
]);
const meta = JSON.parse(probe);
const { width, height } = meta.streams[0];
const duration = Math.round(Number(meta.format.duration));
console.log(`  source: ${width}x${height}, ${duration}s`);

// ---- transcode / remux ----------------------------------------------
const vf = 'scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280';
const encodeArgs = copy
  ? ['-c', 'copy', '-movflags', '+faststart']
  : ['-vf', vf, '-c:v', 'libx264', '-crf', '30', '-preset', 'slow', '-profile:v', 'high',
     '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart'];

console.log(`  ${copy ? 'remuxing' : 'encoding'} -> ${outVideo}`);
await run(FFMPEG, ['-y', '-i', input, ...encodeArgs, outVideo], { maxBuffer: 1 << 26 });

// ---- poster --------------------------------------------------------
console.log(`  poster @ ${posterAt}s -> ${outPoster}`);
await run(FFMPEG, ['-y', '-ss', String(posterAt), '-i', outVideo, '-frames:v', '1',
  '-c:v', 'libwebp', '-quality', '80', outPoster]);

const { size } = await stat(outVideo);
console.log(`✓ ${outVideo}  (${(size / 1e6).toFixed(1)} MB)`);
console.log(
  '\n  db/reels.json entry:\n' +
    JSON.stringify(
      {
        id,
        title: `TODO ${id}`,
        tour_slug: null,
        location: null,
        description: null,
        video_url: `/reels/${id}.mp4`,
        poster_url: `/reels/${id}.webp`,
        duration_sec: duration,
        aspect_ratio: '9:16',
        sort_order: 0,
        published: true,
      },
      null,
      2
    )
);
