'use client';

import Image from 'next/image';
import { motion, MotionValue } from 'framer-motion';
import { MouseEvent, useRef, useState } from 'react';

type PolaroidFrameProps = {
  imageUrl: string;
  rotation?: number;
  showHeart?: boolean;
  watermark?: string;
  caption?: string;
  imageY?: MotionValue<number>;
};

export default function PolaroidFrame({
  imageUrl,
  rotation = 0,
  showHeart = false,
  watermark,
  caption = 'Memory photo',
  imageY,
}: PolaroidFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 8 });
  };

  return (
    <motion.div
      ref={ref}
      className="polaroid-frame"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      initial={{ opacity: 0, y: 80, rotateX: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ type: 'spring', stiffness: 70, damping: 14 }}
      style={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        rotate: rotation,
        transformPerspective: 1000,
      }}
    >
      <div className="polaroid-tape" />
      <div className="polaroid-photo-shell">
        <motion.div className="polaroid-photo-motion" style={{ y: imageY }}>
          <Image
            src={imageUrl}
            alt={caption}
            fill
            sizes="(max-width: 640px) 280px, 340px"
            className="polaroid-photo"
            unoptimized
          />
        </motion.div>
      </div>

      {showHeart && (
        <svg className="polaroid-heart" viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M16 27s-9.3-6-12-12.1C2 10.4 4.2 5.8 8.5 5.8c2.8 0 5.1 1.8 7.5 4.6 2.4-2.8 4.7-4.6 7.5-4.6 4.3 0 6.5 4.6 4.5 9.1C25.3 21 16 27 16 27Z"
            fill="none"
            stroke="#E63946"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {watermark && <span className="polaroid-watermark">{watermark}</span>}
    </motion.div>
  );
}
