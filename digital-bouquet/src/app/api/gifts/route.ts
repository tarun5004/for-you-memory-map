import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import type { GiftPayload } from '@/types/gift';
import type { GiftPhoto } from '@/types/gift';

export const runtime = 'nodejs';

const MAX_GIFT_BYTES = 512_000;
const GIFT_ID_PATTERN = /^[a-f0-9]{32}$/;

const hasBlobConfig = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizePhoto = (photo: unknown) => {
  if (typeof photo === 'string') {
    return /^https?:\/\//i.test(photo) ? { url: photo, caption: '' } : null;
  }

  if (!isRecord(photo) || typeof photo.url !== 'string' || !/^https?:\/\//i.test(photo.url)) {
    return null;
  }

  return {
    url: photo.url,
    caption: typeof photo.caption === 'string' ? photo.caption.slice(0, 180) : '',
  };
};

const isGiftPhoto = (photo: GiftPhoto | null): photo is GiftPhoto => Boolean(photo);

const normalizePayload = (value: unknown): GiftPayload | null => {
  if (!isRecord(value)) return null;

  const receiverName = typeof value.receiverName === 'string' ? value.receiverName.trim().slice(0, 80) : '';
  const senderName = typeof value.senderName === 'string' ? value.senderName.trim().slice(0, 80) : '';
  const letter = typeof value.letter === 'string' ? value.letter.trim().slice(0, 8_000) : '';

  if (!receiverName || !senderName || !letter) return null;

  const photos = Array.isArray(value.photos) ? value.photos.map(normalizePhoto).filter(isGiftPhoto).slice(0, 6) : [];
  const pin = typeof value.pin === 'string' && /^\d{4}$/.test(value.pin) ? value.pin : undefined;
  const youtubeId = typeof value.youtubeId === 'string' ? value.youtubeId.trim().slice(0, 32) : undefined;

  return {
    receiverName,
    senderName,
    letter,
    pin,
    youtubeId,
    photos,
    spotifyUrl: typeof value.spotifyUrl === 'string' ? value.spotifyUrl.trim().slice(0, 300) : '',
    youtubeUrl: typeof value.youtubeUrl === 'string' ? value.youtubeUrl.trim().slice(0, 300) : '',
  };
};

const createGiftId = () => {
  const id = crypto.randomUUID().replaceAll('-', '');
  return GIFT_ID_PATTERN.test(id) ? id : crypto.getRandomValues(new Uint32Array(4)).join('');
};

export async function POST(request: Request) {
  if (!hasBlobConfig()) {
    return NextResponse.json(
      { error: 'Short link storage is not configured. Add a Vercel Blob store to this project.' },
      { status: 501 },
    );
  }

  let payload: GiftPayload | null = null;

  try {
    payload = normalizePayload(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid gift payload.' }, { status: 400 });
  }

  if (!payload) {
    return NextResponse.json({ error: 'Receiver, sender, and letter are required.' }, { status: 400 });
  }

  const id = createGiftId();
  const body = JSON.stringify({
    version: 1,
    createdAt: new Date().toISOString(),
    payload,
  });

  if (new TextEncoder().encode(body).byteLength > MAX_GIFT_BYTES) {
    return NextResponse.json({ error: 'This gift is too large to save.' }, { status: 413 });
  }

  await put(`gifts/${id}.json`, body, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: false,
    cacheControlMaxAge: 31_536_000,
    contentType: 'application/json; charset=utf-8',
  });

  return NextResponse.json({ id });
}
