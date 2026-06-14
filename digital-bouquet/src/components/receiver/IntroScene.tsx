'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type IntroSceneProps = {
  receiverName: string;
};

const flowers = [
  { id: 'rose', className: 'rose', delay: 0, duration: 4.8 },
  { id: 'sunflower', className: 'sunflower', delay: 0.35, duration: 5.2 },
  { id: 'peony', className: 'peony', delay: 0.65, duration: 5 },
  { id: 'magnolia', className: 'magnolia', delay: 0.15, duration: 5.4 },
  { id: 'iris', className: 'iris', delay: 0.5, duration: 4.9 },
  { id: 'tulip', className: 'tulip', delay: 0.8, duration: 5.3 },
] as const;

type FlowerId = (typeof flowers)[number]['id'];

function LeafPair() {
  return (
    <g>
      <path d="M58 154 C36 130 22 132 14 148 C33 155 45 157 58 154Z" fill="#8da463" />
      <path d="M72 132 C93 112 108 118 114 134 C96 140 84 140 72 132Z" fill="#9db374" />
    </g>
  );
}

function FlowerSvg({ type }: { type: FlowerId }) {
  if (type === 'sunflower') {
    return (
      <svg viewBox="0 0 128 178" role="img" aria-label="Sunflower illustration">
        <path d="M62 70 C58 96 54 126 47 174" stroke="#74885b" strokeWidth="5" strokeLinecap="round" />
        <LeafPair />
        <g transform="translate(64 54)">
          {Array.from({ length: 16 }, (_, index) => (
            <ellipse
              cx="0"
              cy="-30"
              fill={index % 2 ? '#f6c64d' : '#ffd76c'}
              key={index}
              rx="8"
              ry="22"
              transform={`rotate(${index * 22.5})`}
            />
          ))}
          <circle r="25" fill="#9c5d2f" />
          <circle r="14" fill="#6f391f" />
        </g>
      </svg>
    );
  }

  if (type === 'peony') {
    return (
      <svg viewBox="0 0 128 178" role="img" aria-label="Peony illustration">
        <path d="M68 82 C64 106 60 136 56 174" stroke="#7c936a" strokeWidth="5" strokeLinecap="round" />
        <LeafPair />
        <g transform="translate(66 54)">
          <ellipse cx="-22" cy="-5" rx="24" ry="34" fill="#f8c4b8" transform="rotate(-34)" />
          <ellipse cx="22" cy="-7" rx="24" ry="35" fill="#f3a89e" transform="rotate(34)" />
          <ellipse cx="0" cy="-20" rx="25" ry="36" fill="#ffd2c8" />
          <ellipse cx="-12" cy="9" rx="25" ry="31" fill="#eb8f8e" />
          <ellipse cx="14" cy="8" rx="25" ry="31" fill="#f3b2a8" />
          <circle cx="0" cy="2" r="11" fill="#d17b63" />
        </g>
      </svg>
    );
  }

  if (type === 'magnolia') {
    return (
      <svg viewBox="0 0 128 178" role="img" aria-label="Magnolia illustration">
        <path d="M58 90 C58 116 56 140 52 174" stroke="#73885b" strokeWidth="5" strokeLinecap="round" />
        <LeafPair />
        <g transform="translate(60 60)">
          <ellipse cx="-22" cy="-4" rx="18" ry="40" fill="#fff4e2" transform="rotate(-42)" />
          <ellipse cx="23" cy="-6" rx="18" ry="40" fill="#ffe9d8" transform="rotate(42)" />
          <ellipse cx="0" cy="-18" rx="17" ry="43" fill="#fff8ea" />
          <ellipse cx="-8" cy="8" rx="20" ry="34" fill="#f8dfcf" transform="rotate(-16)" />
          <ellipse cx="13" cy="8" rx="20" ry="34" fill="#fff0df" transform="rotate(18)" />
          <circle cx="1" cy="10" r="8" fill="#d3b65b" />
        </g>
      </svg>
    );
  }

  if (type === 'iris') {
    return (
      <svg viewBox="0 0 128 178" role="img" aria-label="Iris illustration">
        <path d="M66 92 C62 118 58 145 55 174" stroke="#88a076" strokeWidth="5" strokeLinecap="round" />
        <path d="M54 158 C38 132 28 126 20 132 C31 151 42 160 54 158Z" fill="#9eb586" />
        <path d="M69 154 C88 130 100 126 110 135 C95 153 82 160 69 154Z" fill="#a6bc91" />
        <g transform="translate(65 64)">
          <ellipse cx="-20" cy="-6" rx="17" ry="34" fill="#5632a1" transform="rotate(-38)" />
          <ellipse cx="21" cy="-6" rx="17" ry="34" fill="#6b42b6" transform="rotate(38)" />
          <ellipse cx="0" cy="-25" rx="18" ry="32" fill="#9376d5" />
          <ellipse cx="-16" cy="16" rx="17" ry="32" fill="#47248d" transform="rotate(36)" />
          <ellipse cx="16" cy="16" rx="17" ry="32" fill="#5f38aa" transform="rotate(-36)" />
          <path d="M-8 9 C-2 16 4 17 10 8" stroke="#ffd661" strokeWidth="5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (type === 'tulip') {
    return (
      <svg viewBox="0 0 128 178" role="img" aria-label="Tulip illustration">
        <path d="M66 82 C68 112 67 142 64 174" stroke="#81977a" strokeWidth="5" strokeLinecap="round" />
        <path d="M56 174 C42 137 29 121 18 118 C25 151 39 169 56 174Z" fill="#a9baa1" />
        <path d="M70 174 C88 139 102 126 113 125 C105 155 89 171 70 174Z" fill="#b7c7ad" />
        <g transform="translate(66 58)">
          <path d="M-31 -9 C-20 25 18 28 31 -8 C14 -20 8 -1 0 -28 C-8 -1 -16 -19 -31 -9Z" fill="#f09d8c" />
          <path d="M-17 -20 C-18 12 -5 29 0 31 C5 29 18 12 17 -20 C8 -15 0 -2 -17 -20Z" fill="#ffb4a5" />
          <path d="M-30 -10 C-14 13 14 14 30 -10" fill="none" stroke="#df7f75" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 128 178" role="img" aria-label="Rose illustration">
      <path d="M66 78 C61 106 56 136 51 174" stroke="#74885b" strokeWidth="5" strokeLinecap="round" />
      <LeafPair />
      <g transform="translate(64 54)">
        <circle cx="0" cy="0" r="36" fill="#d95f57" />
        <path d="M-26 -2 C-14 -32 20 -30 29 -4 C18 -14 0 -12 -7 6 C-13 -3 -22 -2 -26 -2Z" fill="#ef8f7d" />
        <path d="M-25 7 C-4 -3 17 -2 29 9 C17 34 -15 33 -25 7Z" fill="#c9474e" />
        <path d="M-10 -13 C9 -23 26 -12 22 9 C12 -4 -2 0 -10 13 C-18 5 -19 -6 -10 -13Z" fill="#f2a191" />
        <path d="M-4 -2 C8 -8 17 0 14 11 C4 17 -8 11 -4 -2Z" fill="#a93444" />
      </g>
    </svg>
  );
}

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
  const scrollToFirstScene = () => {
    const target =
      document.getElementById('memories-1') ||
      document.getElementById('memories-2') ||
      document.getElementById('letter');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="story-scene palette-a rose-bed intro-scene" id="intro" data-scene-section>
      <div className="intro-flower-field" aria-hidden="true">
        {flowers.map((flower) => (
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] }}
            className={`intro-flower intro-flower-${flower.className}`}
            key={flower.id}
            transition={{
              delay: flower.delay,
              duration: flower.duration,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          >
            <FlowerSvg type={flower.id} />
          </motion.div>
        ))}
      </div>
      <div className="scene-content intro-content">
        <motion.p className="scene-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {lineOne}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: lineTwo ? 1 : 0, y: 0 }}>
          {lineTwo}
        </motion.h1>
        <motion.button
          className="scroll-cue"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={scrollToFirstScene}
          transition={{ delay: 3, duration: 0.45 }}
          type="button"
        >
          scroll to begin
        </motion.button>
      </div>
    </section>
  );
}
