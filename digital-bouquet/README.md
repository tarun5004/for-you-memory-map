# For You - Cinematic Love Letter

Next.js app for building a private digital gift link with uploaded memories, music, and a cinematic receiver view.

## Features

- Creator mode at `/`.
- Receiver mode at `/?gift=...` for short links, with `?payload=...` kept as fallback.
- Cloudinary unsigned photo uploads.
- Up to six uploaded photos.
- Two-page memory-map collage with scattered Polaroid cards.
- Spotify and YouTube embeds inside the collage pages.
- Optional 4-digit PIN gate.
- Three.js/CSS particles with lightweight fallback behavior.
- Short share links, QR code, and copyable generated link.

## Environment

Copy `.env.example` to `.env.local` or `.env` and fill in an unsigned Cloudinary preset:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_here
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

Short links also need Vercel Blob connected to the project. Vercel will add this automatically when you create/connect a Blob store:

```env
BLOB_READ_WRITE_TOKEN=added_by_vercel_blob
```

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run lint
npm run build
```

## Vercel Deployment

If deploying this repository from GitHub, set the Vercel project Root Directory to:

```text
digital-bouquet
```

This is required because the Next.js app is not at the repository root. Then keep the standard Next.js settings:

```text
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: None
```

Add the Cloudinary environment variables and connect Vercel Blob before using uploads and short links in production.

## Notes

- Short links store gift JSON in Vercel Blob.
- If Blob is not configured, gift data falls back to a compressed long URL.
- Photos are uploaded to the configured Cloudinary account.
- Keep real `.env` files out of git.
