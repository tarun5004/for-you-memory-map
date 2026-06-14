'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import IntroScene from './IntroScene';
import LetterScene from './LetterScene';
import MemoryScene from './MemoryScene';
import MusicScene from './MusicScene';
import PinGate from './PinGate';
import ScrollProgress from './ScrollProgress';
import YouTubeScene from './YouTubeScene';
import type { GiftPayload, GiftPhoto } from '@/types/gift';
import { extractYouTubeId } from '@/utils/media';

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

const getSpotifyTrackId = (url: string) => url.match(/track\/([a-zA-Z0-9]+)/)?.[1] ?? '';

export default function ReceiverExperience({ data }: ReceiverExperienceProps) {
  const [unlocked, setUnlocked] = useState(!data.pin);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ambienceOn, setAmbienceOn] = useState(false);
  const photos = useMemo(() => normalizePhotos(data.photos), [data.photos]);
  const hasMusic = Boolean(getSpotifyTrackId(data.spotifyUrl || ''));
  const youtubeId = useMemo(() => data.youtubeId || extractYouTubeId(data.youtubeUrl || ''), [data.youtubeId, data.youtubeUrl]);

  const scenes = useMemo(
    () => [
      { id: 'intro', label: 'Intro' },
      ...photos.map((_, index) => ({ id: `memory-${index + 1}`, label: `Memory ${index + 1}` })),
      ...(hasMusic ? [{ id: 'music', label: 'Music' }] : []),
      ...(youtubeId ? [{ id: 'youtube', label: 'YouTube' }] : []),
      { id: 'letter', label: 'Letter' },
    ],
    [hasMusic, photos, youtubeId],
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
    if (active === 'music') return { density: 18, variant: 'bubbles' as const };
    if (active === 'youtube') return { density: 12, variant: 'petals' as const };
    if (active === 'letter') return { density: 30, variant: 'petals' as const };
    if (active.includes('memory-1') || active.includes('memory-5')) return { density: 26, variant: 'petals' as const };
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
      {photos.map((photo, index) => (
        <MemoryScene
          index={index}
          key={`${photo.url}-${index}`}
          photo={photo}
          senderName={data.senderName}
          total={photos.length}
        />
      ))}
      {hasMusic && <MusicScene spotifyUrl={data.spotifyUrl} />}
      {youtubeId && <YouTubeScene youtubeId={youtubeId} />}
      <LetterScene letter={data.letter} senderName={data.senderName} />
    </main>
  );
}
