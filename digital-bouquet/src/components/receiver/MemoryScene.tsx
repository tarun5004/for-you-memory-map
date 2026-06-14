'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import PolaroidFrame from './PolaroidFrame';
import type { GiftPhoto } from '@/types/gift';

const rotations = [-2, 0, 2, -1, 1.5, -1.5];
const palettes = ['palette-a rose-bed', 'palette-d', 'palette-b', 'palette-c', 'palette-a rose-bed', 'palette-d'];

type MemorySceneProps = {
  photo: GiftPhoto;
  index: number;
  total: number;
  senderName: string;
};

export default function MemoryScene({ photo, index, total, senderName }: MemorySceneProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const paletteClass = palettes[index % palettes.length];

  return (
    <section
      className={`story-scene memory-scene ${paletteClass}`}
      id={`memory-${index + 1}`}
      ref={ref}
      data-scene-section
    >
      <span className="scene-index">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
      <div className="scene-content memory-content">
        <PolaroidFrame
          caption={photo.caption}
          imageUrl={photo.url}
          imageY={imageY}
          rotation={rotations[index % rotations.length]}
          showHeart={index % 2 === 0}
          watermark={`for you, ${senderName || 'me'}`}
        />
        {photo.caption && (
          <motion.p
            className="memory-caption"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ delay: 0.32, duration: 0.55 }}
          >
            {photo.caption}
          </motion.p>
        )}
      </div>
    </section>
  );
}
