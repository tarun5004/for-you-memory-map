'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { GiftPhoto } from '@/types/gift';
import { extractSpotifyTrackId } from '@/utils/media';

type MemoryMapSceneProps = {
  id: string;
  pageIndex: number;
  photos: GiftPhoto[];
  senderName: string;
  spotifyUrl?: string;
  youtubeId?: string | null;
};

type Slot = {
  className: string;
  rotate: number;
  delay: number;
};

const photoSlots: Slot[][] = [
  [
    { className: 'slot-a', rotate: -7, delay: 0.08 },
    { className: 'slot-b', rotate: 5, delay: 0.18 },
    { className: 'slot-c', rotate: -2, delay: 0.28 },
  ],
  [
    { className: 'slot-d', rotate: 4, delay: 0.08 },
    { className: 'slot-e', rotate: -6, delay: 0.18 },
    { className: 'slot-f', rotate: 7, delay: 0.28 },
  ],
];

function SeaDecorations() {
  return (
    <div className="memory-map-decor" aria-hidden="true">
      <span className="sea-orb sea-orb-a" />
      <span className="sea-orb sea-orb-b" />
      <span className="sea-orb sea-orb-c" />
      <span className="sea-shell sea-shell-a" />
      <span className="sea-shell sea-shell-b" />
      <span className="sea-coral sea-coral-a" />
      <span className="sea-coral sea-coral-b" />
      <span className="sea-pearl sea-pearl-a" />
      <span className="sea-pearl sea-pearl-b" />
      <span className="sea-pearl sea-pearl-c" />
    </div>
  );
}

function MapPhoto({
  photo,
  slot,
  index,
  senderName,
}: {
  photo: GiftPhoto;
  slot: Slot;
  index: number;
  senderName: string;
}) {
  const caption = photo.caption || `memory ${index + 1}`;
  const captionDensity =
    caption.length > 92 ? 'caption-dense' : caption.length > 48 ? 'caption-balanced' : 'caption-short';

  return (
    <motion.article
      className={`map-polaroid ${slot.className} ${captionDensity}`}
      initial={{ opacity: 0, y: 42, scale: 0.92, rotate: slot.rotate - 5 }}
      style={{ rotate: slot.rotate }}
      transition={{ delay: slot.delay, type: 'spring', stiffness: 72, damping: 13 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: slot.rotate }}
    >
      <div className="map-tape" />
      <div className="map-photo-shell">
        {photo.url ? (
          <Image
            alt={photo.caption || `Memory ${index + 1}`}
            className="map-photo"
            fill
            sizes="(max-width: 720px) 42vw, 260px"
            src={photo.url}
            unoptimized
          />
        ) : (
          <div className="map-photo-placeholder">memory</div>
        )}
      </div>
      <p>{caption}</p>
      <span>{senderName ? `from ${senderName}` : 'for you'}</span>
    </motion.article>
  );
}

function SpotifyMapCard({ spotifyUrl }: { spotifyUrl: string }) {
  const trackId = extractSpotifyTrackId(spotifyUrl);
  if (!trackId) return null;

  return (
    <motion.aside
      className="map-media-card map-spotify-card"
      initial={{ opacity: 0, x: 36, rotate: 4 }}
      transition={{ delay: 0.34, type: 'spring', stiffness: 72, damping: 14 }}
      viewport={{ once: true, amount: 0.25 }}
      whileInView={{ opacity: 1, x: 0, rotate: 2 }}
    >
      <span>soundtrack</span>
      <iframe
        title="Spotify track"
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="100%"
        height="80"
        allow="autoplay; clipboard-write; compute-pressure; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </motion.aside>
  );
}

function YouTubeMapCard({ youtubeId }: { youtubeId: string }) {
  return (
    <motion.aside
      className="map-media-card map-youtube-card"
      initial={{ opacity: 0, x: -36, rotate: -5 }}
      transition={{ delay: 0.24, type: 'spring', stiffness: 72, damping: 14 }}
      viewport={{ once: true, amount: 0.25 }}
      whileInView={{ opacity: 1, x: 0, rotate: -2 }}
    >
      <span>little moment</span>
      <div className="map-video-shell">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; compute-pressure; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </motion.aside>
  );
}

export default function MemoryMapScene({
  id,
  pageIndex,
  photos,
  senderName,
  spotifyUrl,
  youtubeId,
}: MemoryMapSceneProps) {
  const slots = photoSlots[pageIndex % photoSlots.length];

  return (
    <section className="story-scene memory-map-scene palette-d" id={id} data-scene-section>
      <SeaDecorations />
      <span className="scene-index">memory map {pageIndex + 1} / 2</span>
      <div className="scene-content memory-map-content">
        <motion.div
          className="memory-map-board"
          initial={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true, amount: 0.25 }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <span className="memory-map-label">Memory map</span>
          {youtubeId && <YouTubeMapCard youtubeId={youtubeId} />}
          {photos.map((photo, index) => (
            <MapPhoto
              index={pageIndex * 3 + index}
              key={`${photo.url}-${index}`}
              photo={photo}
              senderName={senderName}
              slot={slots[index % slots.length]}
            />
          ))}
          {spotifyUrl && <SpotifyMapCard spotifyUrl={spotifyUrl} />}
        </motion.div>
      </div>
    </section>
  );
}
