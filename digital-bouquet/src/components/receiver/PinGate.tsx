'use client';

import { KeyboardEvent, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type PinGateProps = {
  receiverName: string;
  pin: string;
  onUnlock: () => void;
};

export default function PinGate({ receiverName, pin, onUnlock }: PinGateProps) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'success'>('idle');
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const verify = (nextDigits: string[]) => {
    const value = nextDigits.join('');
    if (value.length !== 4) return;

    if (value === pin) {
      setStatus('success');
      window.setTimeout(onUnlock, 520);
      return;
    }

    setStatus('wrong');
    window.setTimeout(() => {
      setDigits(['', '', '', '']);
      refs.current[0]?.focus();
      setStatus('idle');
    }, 520);
  };

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = digits.map((item, itemIndex) => (itemIndex === index ? digit : item));
    setDigits(next);
    if (digit && index < 3) refs.current[index + 1]?.focus();
    verify(next);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="pin-shell">
      <motion.div
        className={`pin-card ${status}`}
        animate={
          status === 'wrong'
            ? { x: [0, -10, 10, -10, 10, 0] }
            : status === 'success'
              ? { opacity: 0, scale: 1.08, filter: 'blur(8px)' }
              : { opacity: 1, scale: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: status === 'wrong' ? 0.42 : 0.5 }}
      >
        <p className="pin-eyebrow">Private note</p>
        <h1>Hey {receiverName || 'you'},</h1>
        <p>Someone made this memory box just for you.</p>
        <div className="pin-inputs">
          {digits.map((digit, index) => (
            <input
              aria-label={`PIN digit ${index + 1}`}
              autoFocus={index === 0}
              inputMode="numeric"
              key={index}
              maxLength={1}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="password"
              value={digit}
            />
          ))}
        </div>
        <span>Enter the 4-digit PIN to begin.</span>
      </motion.div>
    </div>
  );
}
