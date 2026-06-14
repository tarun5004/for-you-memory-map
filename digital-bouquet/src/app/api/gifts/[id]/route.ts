import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';
import type { GiftPayload } from '@/types/gift';

export const runtime = 'nodejs';

type StoredGift = {
  version: number;
  createdAt: string;
  payload: GiftPayload;
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

const GIFT_ID_PATTERN = /^[a-f0-9]{32}$/;

const hasBlobConfig = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!GIFT_ID_PATTERN.test(id)) {
    return NextResponse.json({ error: 'Invalid gift link.' }, { status: 400 });
  }

  if (!hasBlobConfig()) {
    return NextResponse.json(
      { error: 'Short link storage is not configured for this deployment.' },
      { status: 501 },
    );
  }

  const blob = await get(`gifts/${id}.json`, { access: 'public' });

  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    return NextResponse.json({ error: 'Gift not found.' }, { status: 404 });
  }

  try {
    const text = await new Response(blob.stream).text();
    const stored = JSON.parse(text) as StoredGift;

    if (!stored.payload) {
      return NextResponse.json({ error: 'Gift data is invalid.' }, { status: 422 });
    }

    return NextResponse.json(stored.payload, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Gift data could not be read.' }, { status: 422 });
  }
}
