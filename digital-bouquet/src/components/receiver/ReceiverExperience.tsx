'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import IntroScene from './IntroScene';
import LetterScene from './LetterScene';
import MemoryMapScene from './MemoryMapScene';
import PinGate from './PinGate';
import ScrollProgress from './ScrollProgress';
import type { GiftPayload, GiftPhoto } from '@/types/gift';
import { extractSpotifyTrackId, extractYouTubeId } from '@/utils/media';

const PetalParticles = dynamic(() => import('./PetalParticles'), { ssr: false });

type ReceiverExperienceProps = {
  data: GiftPayload;
};

const normalizePhotos = (photos: GiftPayload['photos'] = []): GiftPhoto[] =>
  photos
    .map((photo) => {
      if (typeof photo === 'string') {
        return { url: photo, caption: '' };
      }
      return { url: photo.url, caption: photo.caption || '' };
    })
    .filter((photo) => Boolean(photo.url));

export default function ReceiverExperience({ data }: ReceiverExperienceProps) {
  const [unlocked, setUnlocked] = useState(!data.pin);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ambienceOn, setAmbienceOn] = useState(false);
  const photos = useMemo(() => normalizePhotos(data.photos), [data.photos]);
  const spotifyTrackId = useMemo(() => extractSpotifyTrackId(data.spotifyUrl || ''), [data.spotifyUrl]);
  const hasMusic = Boolean(spotifyTrackId);
  const youtubeId = useMemo(() => data.youtubeId || extractYouTubeId(data.youtubeUrl || ''), [data.youtubeId, data.youtubeUrl]);
  const memoryPages = useMemo(() => {
    const splitIndex = Math.ceil(photos.length / 2);
    const pages = [
      {
        id: 'memories-1',
        label: 'Memory map 1',
        pageIndex: 0,
        photos: photos.slice(0, splitIndex),
        youtubeId,
        spotifyUrl: photos.length === 0 && hasMusic && !youtubeId ? data.spotifyUrl : undefined,
      },
      {
        id: 'memories-2',
        label: 'Memory map 2',
        pageIndex: 1,
        photos: photos.slice(splitIndex),
        spotifyUrl: hasMusic && (photos.length > 0 || Boolean(youtubeId)) ? data.spotifyUrl : undefined,
        youtubeId: null,
      },
    ];

    return pages.filter((page) => photos.length > 0 || page.photos.length > 0 || page.spotifyUrl || page.youtubeId);
  }, [data.spotifyUrl, hasMusic, photos, youtubeId]);

  const scenes = useMemo(
    () => [
      { id: 'intro', label: 'Intro' },
      ...memoryPages.map((page) => ({ id: page.id, label: page.label })),
      { id: 'letter', label: 'Letter' },
    ],
    [memoryPages],
  );

  useEffect(() => {
    if (!unlocked) return;
    document.documentElement.classList.add('receiver-page');
    document.body.classList.add('receiver-page');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    return () => {
      document.documentElement.classList.remove('receiver-page');
      document.body.classList.remove('receiver-page');
    };
  }, [unlocked]);

  const particleConfig = useMemo(() => {
    const active = scenes[activeIndex]?.id || 'intro';
    if (active.startsWith('memories-')) return { density: 24, variant: 'bubbles' as const };
    if (active === 'letter') return { density: 30, variant: 'petals' as const };
    return { density: 14, variant: 'petals' as const };
  }, [activeIndex, scenes]);

  useEffect(() => {
    if (!unlocked) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-scene-section]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = scenes.findIndex((scene) => scene.id === visible.target.id);
        if (index >= 0) setActiveIndex(index);
      },
      { threshold: [0.35, 0.55, 0.75] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [scenes, unlocked]);

  if (!unlocked && data.pin) {
    return <PinGate pin={data.pin} receiverName={data.receiverName} onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <main className="story-shell">
      <PetalParticles density={particleConfig.density} variant={particleConfig.variant} />
      <ScrollProgress activeIndex={activeIndex} scenes={scenes} />
      <div className="scene-counter">
        {activeIndex + 1} / {scenes.length}
      </div>
      <button
        className="ambience-toggle"
        type="button"
        aria-pressed={ambienceOn}
        aria-label={ambienceOn ? 'Mute ambience' : 'Unmute ambience'}
        onClick={() => setAmbienceOn((current) => !current)}
      >
        {ambienceOn ? 'sound on' : 'muted'}
      </button>
      <IntroScene receiverName={data.receiverName} />
      {memoryPages.map((page) => (
        <MemoryMapScene
          id={page.id}
          key={page.id}
          pageIndex={page.pageIndex}
          photos={page.photos}
          senderName={data.senderName}
          spotifyUrl={page.spotifyUrl}
          youtubeId={page.youtubeId}
        />
      ))}
      <LetterScene letter={data.letter} senderName={data.senderName} />
    </main>
  );
}
