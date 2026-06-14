# For You — Cinematic Love Letter

A frontend-only Next.js app for creating a private, encoded digital love letter link.

## Features

- Creator mode at `/`
- Receiver mode at `/?payload=...`
- Cloudinary unsigned photo uploads
- Captioned Polaroid memory scenes
- Spotify embed scene
- Optional PIN gate
- Scroll-snap cinematic receiver experience

## Setup

Copy `.env.example` to `.env.local` or `.env` and fill in an unsigned Cloudinary preset:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_here
```

Then run:

```bash
npm install
npm run dev
```
