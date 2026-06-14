# 🌹 “FOR YOU” — Cinematic Digital Love Letter Website

# GOD-LEVEL PROMPT for Codex / AI Coding Agent

# Stack: Next.js + Tailwind + Framer Motion + Three.js (react-three-fiber) + Cloudinary

# Personal use only. Frontend-only. .env already has Cloudinary credentials.

-----

## 🎯 VISION

This is NOT a generic “digital bouquet form.” This is a **cinematic scroll-story experience** —
like opening a digital memory box for someone special. Every screen feels intentional,
designed by a top-tier UI designer, with depth, motion, and emotion.

**Reference assets provided:**

1. A taped Polaroid frame (white border, grey tape at top, small red heart doodle bottom-left, “FRAMEX” watermark style) — THIS is the photo frame used throughout
1. A red/pink rose-bed texture — used as one of the rotating backgrounds
1. Multiple screenshots of “flowersisblooming.com” — underwater bubbles theme, envelope-letter reveal, Spotify embed card

**The result must look 1000% more polished than a typical AI-generated form-based site.**
Think: Apple product page meets handwritten love letter meets Pinterest moodboard.

-----

## 🏗️ STACK & ARCHITECTURE

```
Next.js 14 (App Router) + Tailwind CSS + Framer Motion + react-three-fiber + @react-three/drei + lz-string + Cloudinary (already configured in .env)
```

**Still 100% frontend-only / no database.** Two modes via URL:

- `/` → Creator mode (you fill the form, generate link)
- `/?payload=XXXX` → Receiver mode (the cinematic experience plays)

`.env.local` already has:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
```

-----

## 📜 MANDATORY FIRST STEP

Create `BUILD_PLAN.md` in project root with this checklist. Update as you progress.
**Do not write components until this file exists. Do not stop until every box is checked.**

```markdown
# Build Plan
- [ ] Next.js scaffold + Tailwind + Framer Motion + R3F + lz-string installed
- [ ] Fonts loaded (Dancing Script, Fredoka, Quicksand, Caveat)
- [ ] codec.ts (encode/decode payload)
- [ ] PolaroidFrame.tsx (matches reference image exactly)
- [ ] PetalParticles.tsx (Three.js floating petals/bokeh — used on every scene)
- [ ] IntroScene.tsx (typewriter opening)
- [ ] MemoryScene.tsx (per-photo scroll section with rose-bed bg + polaroid)
- [ ] MusicScene.tsx (Spotify card + spinning vinyl)
- [ ] LetterScene.tsx (final handwritten letter + envelope seal)
- [ ] ScrollProgress.tsx (side dot navigation)
- [ ] ReceiverExperience.tsx (orchestrates all scenes with scroll-snap)
- [ ] CreatorForm.tsx (upload photos, write captions, letter, Spotify, generate link)
- [ ] Cloudinary upload hook
- [ ] Full responsive (mobile-first, this opens on phones)
- [ ] Reduced-motion fallback
- [ ] End-to-end test: create → link → open → full experience plays
```

-----

## 🎨 DESIGN SYSTEM (NON-NEGOTIABLE — APPLY EVERYWHERE)

### Fonts (Google Fonts)

```
- 'Caveat' (600/700) → captions, small handwritten notes
- 'Dancing Script' (600/700) → the main letter text
- 'Playfair Display' (italic, 500) → elegant section titles
- 'Quicksand' (400/500/600) → UI labels, buttons, creator form
```

### Color Palettes (rotate per MemoryScene, cycle through)

```css
/* Palette A — Rose Bed (matches reference image 2) */
--bg-a: radial-gradient(circle at 30% 20%, #fff0f0, transparent), 
        linear-gradient(160deg, #d94f5c 0%, #c2185b 50%, #8e1537 100%);
--text-a: #FFF5F5;

/* Palette B — Cream Ivory */
--bg-b: linear-gradient(160deg, #FFF8F0 0%, #FCEFE3 100%);
--text-b: #4A3740;

/* Palette C — Dusk Lavender */
--bg-c: linear-gradient(160deg, #E8D5F2 0%, #C9A9DD 50%, #9B7EBD 100%);
--text-c: #2E1F3D;

/* Palette D — Underwater Mint (from screenshots) */
--bg-d: linear-gradient(160deg, #D4F1F4 0%, #A6E3E9 50%, #71C9CE 100%);
--text-d: #1A4D52;
```

### Polaroid Frame Spec (CRITICAL — match reference exactly)

```
- Outer card: off-white (#FAFAFA), padding ~24px top/sides, ~64px bottom
- Photo area: white inset border (~16px), photo fills this with object-fit:cover
- Top: small grey tape strip, rotated -3deg, semi-transparent (rgba(200,200,200,0.6)), 
       positioned center-top, slightly hanging off the card edge
- Bottom-left: small red heart doodle (✏️ hand-drawn SVG style, ~24px) — only on SOME 
  cards (alternate or random) for variety
- Bottom-right: tiny watermark text in caption font, low opacity (e.g. "✨ {senderName}")
- Box-shadow: 0 20px 50px rgba(0,0,0,0.25) — feels like it's floating/casting shadow on bg
- Slight rotation per card: alternate between -2deg, 0deg, +2deg, -1deg for organic feel
- On scroll into view: enters with rotateX(15deg) → rotateX(0), translateY(60px) → 0, 
  opacity 0 → 1, spring physics
- On hover (desktop) / tap (mobile): subtle 3D tilt following cursor 
  (use react-three-fiber OR simple CSS transform with mousemove listener — 
   max tilt ±8deg, perspective 1000px)
```

-----

## 🎬 SCENE-BY-SCENE BUILD

### SCENE 0 — `IntroScene.tsx`

```
Full viewport, Palette C (dusk lavender) background with PetalParticles running.
Center: Typewriter animation —
  Line 1: "Hey {receiverName}," (Playfair Display italic, 32px)
  Line 2 (after 1.5s): "I made something for you..." (Dancing Script, 28px)
  Line 3 (after 3s): small bouncing down-arrow "scroll to begin ↓"
Typewriter: reveal one character every ~40ms using Framer Motion or CSS steps animation.
Background petals drift slowly (very subtle, low density ~12 particles).
```

### SCENE 1+ — `MemoryScene.tsx` (one per uploaded photo, 1–6 instances)

```
Full viewport section, scroll-snap-align: start.
Background: cycles through Palette A → D → B → C → A... (one palette per scene, looping)
PetalParticles: density increases slightly with Palette A (rose bed) — more petals,
   warmer color (#fff, #ffd6d6 tones)

Layout:
  - PolaroidFrame centered, containing the photo (Cloudinary URL)
  - Below frame: caption text in Caveat font, fades in 0.4s after frame settles
    e.g. "That day at the beach 🌊" (creator-provided per-photo caption)
  - Small index indicator top-right: "01 / 06" in Quicksand, low opacity

Entrance animation (on scroll into view via Framer Motion's whileInView):
  - PolaroidFrame: initial={ opacity:0, y:80, rotateX:20, scale:0.9 }
    animate={ opacity:1, y:0, rotateX:0, scale:1 }
    transition: spring, stiffness:70, damping:14
  - Caption: initial={opacity:0, y:20}, animate after frame, delay:0.3s
  - Background gradient: cross-fades from previous palette using Framer Motion 
    AnimatePresence or a layered absolute div with opacity transition

PARALLAX: photo inside polaroid shifts slightly opposite to scroll direction 
  (y: useTransform(scrollYProgress, [0,1], [-20, 20])) for depth.
```

### SCENE N — `MusicScene.tsx`

```
Background: Palette D (underwater mint) — matches the dreamy aesthetic from screenshots
PetalParticles: replace petals with floating bubble particles for this scene 
  (pass a `variant="bubbles"` prop to PetalParticles)

Center: 
  - Spinning vinyl record (CSS: black circle, center label with song art from Spotify 
    oEmbed or just a colored circle, animate rotate 360deg infinite, 8s linear)
  - Below vinyl: Spotify embed iframe in a polaroid-style card (white card, 
    rounded-2xl, shadow-2xl)
  - Caption above: "our song 🎵" in Dancing Script

Spotify track ID extraction:
  const trackId = url.match(/track\/([a-zA-Z0-9]+)/)?.[1]
  <iframe src={`https://open.spotify.com/embed/track/${trackId}?theme=0`} 
    width="100%" height="80" style={{borderRadius:12}} allow="encrypted-media" />
```

### FINAL SCENE — `LetterScene.tsx`

```
Background: Palette A (rose bed, matches reference image 2) at FULL intensity — 
  this is the emotional climax screen
PetalParticles: highest density (~30), larger petals, slow fall

Layout:
  - An envelope icon/SVG at top, small wax seal (🔴 or custom SVG), pulses gently
  - Below: the FULL letter text in Dancing Script, 22px, line-height 2, 
    max-width 600px, color: cream/white (#FFF5F5) for contrast against rose bg
  - Letter reveals progressively — each paragraph fades in on scroll 
    (stagger via Framer Motion, 0.2s delay between paragraphs)
  - Signature line at bottom: "— {senderName} 💌" in Caveat, larger size, 
    with a hand-drawn underline SVG that draws itself (pathLength animation 0→1)
  - Final element: small "made with ❤️" footer, very subtle, Quicksand 12px
```

-----

## 🌸 `PetalParticles.tsx` — Three.js Component (react-three-fiber)

```tsx
'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Particles({ count = 20, variant = 'petals' }: { count: number; variant: 'petals' | 'bubbles' }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 10,
        Math.random() * 10 - 5,
        (Math.random() - 0.5) * 5,
      ],
      speed: 0.005 + Math.random() * 0.01,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      scale: 0.1 + Math.random() * 0.2,
    }));
  }, [count]);

  useFrame(() => {
    particles.forEach((p, i) => {
      p.position[1] -= p.speed;
      if (p.position[1] < -5) p.position[1] = 5;
      const matrix = new THREE.Matrix4();
      matrix.compose(
        new THREE.Vector3(...(p.position as [number, number, number])),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, p.position[1] * p.rotationSpeed)),
        new THREE.Vector3(p.scale, p.scale, p.scale)
      );
      mesh.current.setMatrixAt(i, matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  const geometry = variant === 'bubbles' 
    ? <sphereGeometry args={[0.5, 16, 16]} /> 
    : <circleGeometry args={[0.5, 8]} />;
  
  const color = variant === 'bubbles' ? '#ffffff' : '#ffd6d6';

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      {geometry}
      <meshBasicMaterial color={color} transparent opacity={variant === 'bubbles' ? 0.3 : 0.6} />
    </instancedMesh>
  );
}

export default function PetalParticles({ density = 20, variant = 'petals' as 'petals' | 'bubbles' }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Particles count={density} variant={variant} />
      </Canvas>
    </div>
  );
}
```

**IMPORTANT**: Wrap this in a dynamic import with `ssr: false` since it uses WebGL:

```tsx
const PetalParticles = dynamic(() => import('@/components/PetalParticles'), { ssr: false });
```

If WebGL/Three.js causes performance issues on low-end mobile, fall back to a pure
CSS/Framer Motion particle system (absolute-positioned divs with emoji/SVG petals
animating via `animate={{ y: ['-10vh','110vh'], x: [...], rotate: [...] }}`).
Build the Three.js version first; add this as a fallback if `navigator.hardwareConcurrency < 4`.

-----

## 🖼️ `PolaroidFrame.tsx` — Exact Spec Component

```tsx
'use client';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

interface PolaroidFrameProps {
  imageUrl: string;
  rotation?: number; // -2, 0, 2, -1 etc.
  showHeart?: boolean;
  watermark?: string;
}

export default function PolaroidFrame({ imageUrl, rotation = 0, showHeart = false, watermark }: PolaroidFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 8 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      initial={{ opacity: 0, y: 80, rotateX: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: 'spring', stiffness: 70, damping: 14 }}
      style={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        rotate: rotation,
        transformPerspective: 1000,
      }}
      className="relative bg-[#FAFAFA] p-6 pb-16 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.25)] w-[280px] sm:w-[340px]"
    >
      {/* Tape */}
      <div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-7 rotate-[-3deg] bg-gray-300/60 shadow-sm"
        style={{ backdropFilter: 'blur(1px)' }}
      />
      
      {/* Photo */}
      <div className="bg-white p-2 shadow-inner">
        <img 
          src={imageUrl} 
          alt="" 
          className="w-full aspect-[4/5] object-cover"
          loading="lazy"
        />
      </div>

      {/* Heart doodle */}
      {showHeart && (
        <svg className="absolute bottom-4 left-6 w-6 h-6" viewBox="0 0 24 24" fill="#E63946">
          <path d="M12 21s-7-4.5-9.5-9C1 8 2.5 4.5 6 4.5c2 0 3.5 1.2 4.5 2.5 1-1.3 2.5-2.5 4.5-2.5 3.5 0 5 3.5 3.5 7.5C19 16.5 12 21 12 21z" opacity="0.85"/>
        </svg>
      )}

      {/* Watermark */}
      {watermark && (
        <span className="absolute bottom-4 right-6 text-xs font-['Caveat'] text-gray-400">
          {watermark}
        </span>
      )}
    </motion.div>
  );
}
```

-----

## 📝 `CreatorForm.tsx` — What I (Creator) Fill In

```
Fields:
1. Receiver name (text)
2. Sender name (text)  
3. Photo upload (multi, max 6) — each gets a caption text field below it
   → uploads to Cloudinary using existing .env credentials, store secure_url
4. Spotify track URL (text, auto-validates and shows track preview if oEmbed works)
5. Final letter text (large textarea, supports multi-paragraph — split by \n\n 
   for the staggered reveal in LetterScene)
6. 4-digit PIN (optional — if set, ReceiverExperience shows a PIN gate before IntroScene)

On submit:
  payload = { receiverName, senderName, photos: [{url, caption}], spotifyUrl, letter, pin }
  encoded = lzstring.compressToEncodedURIComponent(JSON.stringify(payload))
  finalUrl = `${origin}/?payload=${encoded}`
  → Display: copyable URL + QR code (qrcode.react)
```

Creator form styling: clean, minimal, Quicksand font, soft white card on cream bg.
This page is just for me — doesn’t need the cinematic treatment.

-----

## 🧭 `ScrollProgress.tsx`

```
Fixed position, right edge, vertical center.
One small dot per scene (Intro + each Memory + Music + Letter).
Active dot (current scene in viewport): scales to 1.4x, fills with white/accent color.
Inactive: 0.6 opacity, smaller.
Use Intersection Observer or Framer Motion's useScroll + scrollYProgress mapped to 
  active index.
Clicking a dot smooth-scrolls to that section.
```

-----

## ⚙️ TECHNICAL REQUIREMENTS

1. **Scroll-snap**: Container has `scroll-snap-type: y mandatory`, each scene
   `scroll-snap-align: start; min-height: 100vh`.
1. **Performance**: Lazy-load images via Next.js `<Image>` where possible (use
   `unoptimized` if Cloudinary URLs cause issues, or configure `next.config.js`
   remotePatterns for `res.cloudinary.com`).
1. **PIN gate** (if PIN set in payload): show before IntroScene, same glassmorphism
   4-digit style as previously discussed, with shake-on-wrong / dissolve-on-correct.
1. **Mobile-first**: test at 375px width. Polaroid frames scale down (`w-[280px]`),
   font sizes reduce via responsive Tailwind classes.
1. **Reduced motion**: respect `prefers-reduced-motion` — disable Three.js particles
   and reduce Framer Motion transitions to simple fades.
1. **next.config.js**:

```js
module.exports = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
};
```

-----

## ✅ FINAL QUALITY BAR — DO NOT SHIP UNLESS:

- [ ] Polaroid frames visually match the reference image (tape, heart doodle, proportions, shadow)
- [ ] At least 2 background palettes use rose-bed-style imagery/gradients matching reference image 2
- [ ] Three.js particles render and animate smoothly (or graceful CSS fallback)
- [ ] Scroll-snap works on both mouse wheel and mobile touch swipe
- [ ] Typewriter intro animation plays correctly
- [ ] Spotify embed renders and is playable
- [ ] Letter text reveals paragraph-by-paragraph on scroll
- [ ] Side scroll-progress dots update and are clickable
- [ ] Creator form successfully uploads to Cloudinary and generates a working payload URL
- [ ] Opening generated URL in incognito reproduces the full experience identically
- [ ] `npm run build` succeeds with zero type errors
- [ ] Tested at 375px and 1440px viewports

-----

**This must look like a premium, designer-made gift — not a template.**
**Start by creating BUILD_PLAN.md, then proceed through every component without stopping
or asking questions. Use your best creative judgment for any visual detail not explicitly
specified, always erring toward “more polished, more emotional, more delightful.”**