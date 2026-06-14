'use client';

import { motion } from 'framer-motion';

type MusicSceneProps = {
  spotifyUrl: string;
};

const getSpotifyTrackId = (url: string) => url.match(/track\/([a-zA-Z0-9]+)/)?.[1] ?? '';

export default function MusicScene({ spotifyUrl }: MusicSceneProps) {
  const trackId = getSpotifyTrackId(spotifyUrl);
  if (!trackId) return null;

  return (
    <section className="story-scene palette-d music-scene" id="music" data-scene-section>
      <div className="scene-content music-content">
        <motion.p
          className="music-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          our song
        </motion.p>
        <motion.div
          className="vinyl"
          initial={{ opacity: 0, scale: 0.82 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ type: 'spring', stiffness: 80, damping: 14 }}
        >
          <span />
        </motion.div>
        <motion.div
          className="spotify-card"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ delay: 0.18 }}
        >
          <iframe
            title="Spotify track"
            src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
            width="100%"
            height="80"
            allow="autoplay; clipboard-write; compute-pressure; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}
