'use client';

import { motion } from 'framer-motion';

type LetterSceneProps = {
  letter: string;
  senderName: string;
};

export default function LetterScene({ letter, senderName }: LetterSceneProps) {
  const paragraphs = (letter || 'I hope this little page makes you smile.').split(/\n\s*\n/).filter(Boolean);

  return (
    <section className="story-scene palette-a rose-bed letter-scene" id="letter" data-scene-section>
      <div className="scene-content letter-content">
        <motion.div
          className="letter-envelope"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 75, damping: 14 }}
        >
          <svg viewBox="0 0 120 82" aria-hidden="true">
            <path d="M9 22h102v51H9z" fill="#F6A8BB" />
            <path d="M9 22 60 56l51-34v51H9z" fill="#E87996" />
            <path d="M9 22 60 55l51-33L60 6Z" fill="#FFD9E2" />
            <circle cx="60" cy="47" r="11" fill="#A92A35" />
            <path d="M56 47c3 4 7 4 9 0" stroke="#F7C7C7" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </motion.div>

        <article className="letter-paper">
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={`${paragraph.slice(0, 16)}-${index}`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ delay: index * 0.18, duration: 0.55 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </article>

        <motion.div
          className="letter-signature"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2 }}
        >
          <span>— {senderName || 'me'}</span>
          <svg viewBox="0 0 260 34" aria-hidden="true">
            <motion.path
              d="M4 21c34-8 67-10 101-2 32 7 65 9 104-3 18-5 33-5 47 2"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 1.1 }}
            />
          </svg>
        </motion.div>
        <small className="made-with">made with love</small>
      </div>
    </section>
  );
}
