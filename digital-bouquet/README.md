# For You - Cinematic Love Letter

Frontend-only Next.js app for building a private, encoded digital gift link.

## Features

- Creator mode at `/`.
- Receiver mode at `/?payload=...`.
- Cloudinary unsigned photo uploads.
- Up to six uploaded photos.
- Two-page memory-map collage with scattered Polaroid cards.
- Spotify and YouTube embeds inside the collage pages.
- Optional 4-digit PIN gate.
- Three.js/CSS particles with lightweight fallback behavior.
- QR code and copyable generated link.

## Environment

Copy `.env.example` to `.env.local` or `.env` and fill in an unsigned Cloudinary preset:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_here
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

Then keep the standard Next.js settings:

```text
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

Add the Cloudinary environment variables in Vercel before using uploads in production.

## Notes

- No backend or database is required.
- Gift data is compressed into the generated URL.
- Photos are uploaded to the configured Cloudinary account.
- Keep real `.env` files out of git.
