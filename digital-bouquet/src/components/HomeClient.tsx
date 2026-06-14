'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CreatorForm from '@/components/creator/CreatorForm';
import ReceiverExperience from '@/components/receiver/ReceiverExperience';
import { decodePayload } from '@/utils/codec';
import type { GiftPayload } from '@/types/gift';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const payload = searchParams.get('payload');
  const giftId = searchParams.get('gift');
  const [remoteGift, setRemoteGift] = useState<GiftPayload | null>(null);
  const [remoteError, setRemoteError] = useState('');
  const [loadingGift, setLoadingGift] = useState(false);

  const decoded = useMemo<GiftPayload | null>(() => {
    if (!payload) return null;
    return decodePayload<GiftPayload>(payload.replaceAll(' ', '+'));
  }, [payload]);

  useEffect(() => {
    if (!giftId || payload) {
      setRemoteGift(null);
      setRemoteError('');
      setLoadingGift(false);
      return;
    }

    const controller = new AbortController();
    setLoadingGift(true);
    setRemoteError('');

    fetch(`/api/gifts/${encodeURIComponent(giftId)}`, { signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json().catch(() => ({}))) as GiftPayload & { error?: string };
        if (!response.ok) throw new Error(body.error || 'This gift could not be loaded.');
        setRemoteGift(body);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setRemoteGift(null);
        setRemoteError(error instanceof Error ? error.message : 'This gift could not be loaded.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingGift(false);
      });

    return () => controller.abort();
  }, [giftId, payload]);

  if (decoded) {
    return <ReceiverExperience data={decoded} />;
  }

  if (remoteGift) {
    return <ReceiverExperience data={remoteGift} />;
  }

  if (giftId) {
    return (
      <main className="app-loading">
        {loadingGift ? (
          <span>Loading your gift...</span>
        ) : (
          <div className="gift-load-error">
            <strong>This gift link could not load.</strong>
            <span>{remoteError || 'Please check the link and try again.'}</span>
          </div>
        )}
      </main>
    );
  }

  return <CreatorForm />;
}
