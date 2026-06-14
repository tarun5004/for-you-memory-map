# For You - Cinematic Love Letter

A frontend-only Next.js app for creating a private digital gift link with uploaded photos, a memory-map collage, Spotify, YouTube, and a handwritten letter experience.

The creator fills out the form, uploads up to six photos, and generates one encoded URL. The receiver opens that URL and scrolls through a cinematic story: intro, two collage-style memory map pages, and a final letter.

## Highlights

- Frontend-only app: no backend, database, Express server, or MongoDB.
- Encoded payload links using `lz-string`.
- Cloudinary unsigned image uploads.
- Two-page memory-map receiver layout with scattered Polaroid photos.
- Spotify and YouTube embeds placed inside the collage pages.
- Optional 4-digit PIN gate.
- Three.js/CSS particle layer with lightweight fallbacks.
- Responsive layout tested on desktop and mobile widths.
- QR code generation for the share link.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Framer Motion
- Three.js / React Three Fiber
- Cloudinary unsigned uploads
- `qrcode.react`
- `lz-string`

## Project Structure

```text
digital-bouquet/
  src/
    app/
    components/
      creator/
      receiver/
    hooks/
    types/
    utils/
```

## Setup

```bash
cd digital-bouquet
npm install
```

Create `digital-bouquet/.env` or `digital-bouquet/.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_here
```

The Cloudinary upload preset must be unsigned.

## Run

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build And Check

```bash
npm run lint
npm run build
```

## Deploy To Vercel

This repository keeps the Next.js app inside `digital-bouquet/`. If Vercel deploys the repository root directly, production can show `404: NOT_FOUND`.

Required Vercel project setting:

```text
Root Directory: digital-bouquet
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: None
```

Also add these Vercel environment variables:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_here
```

After saving the Root Directory, redeploy from the Deployments tab and disable build cache if Vercel offers that option.

## Receiver Flow

1. Intro floral scene.
2. Memory map page 1 with uploaded photos and optional YouTube.
3. Memory map page 2 with remaining photos and optional Spotify.
4. Final letter scene.

If a `payload` query parameter is present, the app renders receiver mode:

```text
http://localhost:3000/?payload=...
```

Without `payload`, the app renders creator mode.

## Privacy Notes

- The gift data is encoded into the generated URL.
- Uploaded photos are stored through the configured Cloudinary account.
- Do not commit real `.env` values or Cloudinary secrets.
