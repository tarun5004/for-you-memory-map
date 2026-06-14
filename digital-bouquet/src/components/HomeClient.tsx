'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import CreatorForm from '@/components/creator/CreatorForm';
import ReceiverExperience from '@/components/receiver/ReceiverExperience';
import { decodePayload } from '@/utils/codec';
import type { GiftPayload } from '@/types/gift';

export default function HomeClient() {
  const searchParams = useSearchParams();
  const payload = searchParams.get('payload');

  const decoded = useMemo<GiftPayload | null>(() => {
    if (!payload) return null;
    return decodePayload<GiftPayload>(payload.replaceAll(' ', '+'));
  }, [payload]);

  if (decoded) {
    return <ReceiverExperience data={decoded} />;
  }

  return <CreatorForm />;
}
