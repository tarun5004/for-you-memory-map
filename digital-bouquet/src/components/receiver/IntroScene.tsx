'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type IntroSceneProps = {
  receiverName: string;
};

function useTypewriter(text: string, delay = 0) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue('');
    let index = 0;
    const start = window.setTimeout(() => {
      const interval = window.setInterval(() => {
        index += 1;
        setValue(text.slice(0, index));
        if (index >= text.length) window.clearInterval(interval);
      }, 40);
    }, delay);

    return () => window.clearTimeout(start);
  }, [delay, text]);

  return value;
}

export default function IntroScene({ receiverName }: IntroSceneProps) {
  const safeName = useMemo(() => receiverName?.trim() || 'you', [receiverName]);
  const lineOne = useTypewriter(`Hey ${safeName},`, 150);
  const lineTwo = useTypewriter('I made something for you...', 1500);

  return (
    <section className="story-scene palette-c intro-scene" id="intro" data-scene-section>
      <div className="scene-content intro-content">
        <motion.p className="scene-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {lineOne}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: lineTwo ? 1 : 0, y: 0 }}>
          {lineTwo}
        </motion.h1>
        <motion.span
          className="scroll-cue"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 3 }, y: { delay: 3, duration: 1.4, repeat: Infinity } }}
        >
          scroll to begin
        </motion.span>
      </div>
    </section>
  );
}
