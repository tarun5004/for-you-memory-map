'use client';

import { motion } from 'framer-motion';

type YouTubeSceneProps = {
  youtubeId: string;
};

export default function YouTubeScene({ youtubeId }: YouTubeSceneProps) {
  return (
    <section className="story-scene palette-e youtube-scene" id="youtube" data-scene-section>
      <div className="scene-content youtube-content">
        <motion.p
          className="youtube-title"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          a little moment
        </motion.p>

        <motion.div
          className="youtube-frame"
          initial={{ opacity: 0, y: 70, rotateX: 16, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: 'spring', stiffness: 70, damping: 14 }}
        >
          <div className="polaroid-tape" />
          <div className="youtube-video-shell">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; compute-pressure; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
