# 🌸 ANTIGRAVITY / CURSOR / WINDSURF — GOD LEVEL AGENT PROMPT

# Digital Bouquet Gift Website — Personal Use

# Copy this ENTIRE prompt into the AI chat panel of your IDE

-----

You are an elite Senior React Engineer and UI/UX expert. Your task is to build a **production-ready, fully aesthetic digital gift website** from scratch. This is for **personal use only** — one creator (me) builds gifts, receivers open them via a shareable link.

## CRITICAL RULES — DO NOT VIOLATE

1. **NO backend. NO Node.js server. NO database. NO Express. NO MongoDB.** Pure frontend only.
1. **First action**: Create `SPEC.md` in project root with the full architecture. Do not write a single component until SPEC.md exists.
1. **Do not stop** until every item in the checklist inside SPEC.md is complete.
1. **Do not ask me questions**. Make all design decisions yourself following this brief exactly.
1. Every component must be **fully written** — no TODO comments, no placeholder content, no “// add logic here”.
1. The **animated background must be running** before you write any other receiver component. Background first, then build on top.

-----

## STEP 0 — MANDATORY FIRST ACTION

Before ANY code, create `SPEC.md` in the project root with this exact content:

```markdown
# Digital Bouquet Gift — Build Spec
## Status Tracker
- [ ] Vite scaffold + deps installed
- [ ] Google Fonts linked
- [ ] codec.js utility
- [ ] App.jsx URL router
- [ ] BouquetBuilder.jsx
- [ ] MediaUploader.jsx (Cloudinary)
- [ ] ThemeSelector.jsx
- [ ] SetupForm.jsx + link generator + QR code
- [ ] PinLock.jsx with shake/dissolve animations
- [ ] AnimatedBackground.jsx (4 themes)
- [ ] BouquetReveal.jsx (entrance + float loop)
- [ ] Envelope.jsx (3-stage open sequence)
- [ ] MediaGallery.jsx (Polaroid + Spotify + YouTube)
- [ ] ReceiverView.jsx (wires all receiver components)
- [ ] CreatorDashboard.jsx (wires all creator components)
- [ ] Full design system applied everywhere
- [ ] Mobile responsive (375px to 1440px)
- [ ] End-to-end flow tested
- [ ] Vercel deploy config
```

Update each checkbox as you complete it. Do not proceed to the next item until current item works.

-----

## STEP 1 — PROJECT SETUP

```bash
npm create vite@latest digital-bouquet -- --template react
cd digital-bouquet
npm install framer-motion lz-string swiper qrcode.react react-player
```

In `index.html`, add inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Quicksand:wght@300;400;500;600;700&family=Fredoka+One&display=swap" rel="stylesheet">
```

Create `.env` file:

```
VITE_CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME_HERE
VITE_CLOUDINARY_UPLOAD_PRESET=gift_unsigned_preset
```

Set up Tailwind CSS with this custom config (add to `tailwind.config.js`):

```js
theme: {
  extend: {
    colors: {
      'bg-base': '#FEF6F0',
      'bg-card': '#FFFAF7',
      'rose-soft': '#FFB1B1',
      'rose-deep': '#E8748A',
      'text-dark': '#3D2C34',
      'text-muted': '#9B7B87',
    },
    fontFamily: {
      script: ['Dancing Script', 'cursive'],
      ui: ['Quicksand', 'sans-serif'],
      display: ['Fredoka One', 'cursive'],
    },
  }
}
```

-----

## STEP 2 — UTILITY: `src/utils/codec.js`

```javascript
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

export const encodePayload = (obj) => {
  return compressToEncodedURIComponent(JSON.stringify(obj));
};

export const decodePayload = (str) => {
  try {
    return JSON.parse(decompressFromEncodedURIComponent(str));
  } catch {
    return null;
  }
};
```

-----

## STEP 3 — APP.JSX (URL Router)

```jsx
import { useEffect, useState } from 'react';
import { decodePayload } from './utils/codec';
import CreatorDashboard from './components/creator/CreatorDashboard';
import ReceiverView from './components/receiver/ReceiverView';

export default function App() {
  const [giftData, setGiftData] = useState(null);
  const [isReceiverMode, setIsReceiverMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payload = params.get('payload');
    if (payload) {
      const decoded = decodePayload(payload);
      if (decoded) {
        setGiftData(decoded);
        setIsReceiverMode(true);
      }
    }
  }, []);

  if (isReceiverMode && giftData) {
    return <ReceiverView data={giftData} />;
  }
  return <CreatorDashboard />;
}
```

-----

## STEP 4 — ANIMATED BACKGROUND (BUILD THIS FIRST, BEFORE ANY OTHER RECEIVER COMPONENT)

`src/components/receiver/AnimatedBackground.jsx`

This is the most important visual element. Build it completely before anything else in the receiver.

**4 themes the creator can choose:**

### Theme 1: “Underwater Dream” (default — matches the screenshots)

- Floating elements: blue fish SVGs, pink jellyfish, seashells, bubbles, pearl beads
- Colors: teal/aqua gradient base (`#B2EBF2` → `#E0F7FA`)
- Elements drift horizontally AND vertically at different speeds
- Some elements have subtle opacity pulse

### Theme 2: “Flower Fall”

- Rose petals, cherry blossoms, sakura SVGs fall from top
- Soft rotation as they fall
- Warm cream background

### Theme 3: “Starry Night”

- Stars twinkle (opacity oscillation)
- Shooting star occasionally crosses
- Deep navy/purple gradient

### Theme 4: “Garden Bokeh”

- Large blurred circles (CSS filter: blur) in pink, mint, lavender
- Slow drift
- Very soft, dreamy

**Implementation pattern for ALL themes:**

```jsx
// Generate 15-25 elements per theme
// Each element gets:
const elements = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,      // vw percentage
  y: Math.random() * 100,      // vh percentage  
  scale: 0.3 + Math.random() * 1.2,
  duration: 8 + Math.random() * 15,
  delay: Math.random() * 8,
  type: pickRandomType(),       // fish, bubble, shell, etc.
}));

// Framer Motion for each:
<motion.div
  key={el.id}
  style={{ position: 'fixed', left: `${el.x}%`, top: `${el.y}%`, zIndex: 0, pointerEvents: 'none' }}
  animate={{ 
    y: [0, -30, 0],
    x: [0, 15, -10, 0],
    opacity: [0.6, 1, 0.6],
    rotate: [0, 5, -5, 0]
  }}
  transition={{ 
    duration: el.duration, 
    repeat: Infinity, 
    delay: el.delay,
    ease: 'easeInOut'
  }}
>
  {/* SVG or emoji element */}
</motion.div>
```

Use inline SVGs for fish, bubbles, flowers. You can use Unicode/emoji as fallback but SVGs look better.

-----

## STEP 5 — PIN LOCK SCREEN

`src/components/receiver/PinLock.jsx`

```
VISUAL DESIGN:
- Full viewport, animated background running behind
- Center: glassmorphism card (backdrop-blur, semi-transparent white)
- "🌸 Hey [receiverName],"
- "Someone sent you a secret gift."
- "Enter your 4-digit PIN to unwrap it"
- 4 custom dot inputs (NOT a single input — 4 individual boxes)
- Each box: 48x48px, rounded-xl, border-2 border-rose-soft
- Filled: bg-rose-deep, shows • character
- Active: border-rose-deep with glow box-shadow
- Auto-advance to next box on digit entry
- Wrong PIN: entire card does shake animation (x: [0, -10, 10, -10, 10, 0])
                + red flash (border turns red briefly)
- Correct PIN: card scales up then dissolves (opacity: 0, scale: 1.1) 
              then onUnlock() callback fires
```

-----

## STEP 6 — BOUQUET REVEAL

`src/components/receiver/BouquetReveal.jsx`

After PIN unlock:

1. Bouquet image/SVG starts at `y: '100vh', opacity: 0, scale: 0.5`
1. Spring animation: `y: 0, opacity: 1, scale: 1` (stiffness: 80, damping: 15)
1. After settling (2.5s delay): gentle float loop `y: [0, -15, 0]` every 3s
1. Soft radial gradient glow behind bouquet (CSS radial-gradient or box-shadow spread)
1. Text below: “Click to open your gift 💌” — fade in after 3s
1. On click: triggers envelope reveal phase

The bouquet should look like Image 6 from the screenshots — white cherry blossom bouquet on dreamy background with fish/bubbles floating around it.

-----

## STEP 7 — ENVELOPE OPEN SEQUENCE

`src/components/receiver/Envelope.jsx`

**3D Envelope that opens in stages:**

```
Stage 1 (idle): Envelope sits center screen
  - Slow pulse: scale [1, 1.04, 1] every 2s
  - Soft shadow beneath
  - "Click to open" text pulses below

Stage 2 (opening): User clicks
  - Top flap rotates open: rotateX from 0 to -180deg
  - perspective: 800px on parent for 3D effect
  - Duration: 0.6s, ease: easeOut

Stage 3 (letter emerges):
  - Letter card: y from 60px to -180px, opacity 0 to 1
  - Delay: 0.4s after flap starts
  - Letter card expands to fill screen (scale 0.6 to 1)

Stage 4 (letter readable):
  - Full letter visible
  - "From: [senderName]" at top in Fredoka One
  - "To: [receiverName]" 
  - Letter text in Dancing Script, 18px, line-height 1.8
  - Decorative wax seal SVG at bottom
  - Small pressed flower illustrations at corners (decorative SVGs)
```

Envelope colors: blush pink (`#F4A7B9` body, `#E8748A` flap line), like Image 4.

-----

## STEP 8 — MEDIA GALLERY

`src/components/receiver/MediaGallery.jsx`

Below the letter, smooth scroll reveals:

**Section 1 — Spotify:**

```jsx
{spotifyTrackId && (
  <div className="rounded-2xl overflow-hidden shadow-lg">
    <iframe
      src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`}
      width="100%"
      height="80"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  </div>
)}
```

**Section 2 — Photo Carousel (Polaroid style):**

- Use Swiper.js with `effect="cards"` or `effect="coverflow"`
- Each photo in polaroid frame: white bg, thick bottom padding, slight random rotation (-3 to +3 deg)
- Box shadow for depth
- Swipe-enabled on mobile
- If no photos: hide this section

**Section 3 — YouTube:**

```jsx
{youtubeUrl && (
  <ReactPlayer url={youtubeUrl} width="100%" height="200px" style={{ borderRadius: '16px', overflow: 'hidden' }} />
)}
```

-----

## STEP 9 — CREATOR DASHBOARD

`src/components/creator/CreatorDashboard.jsx`

Clean, minimal setup UI. NOT overly styled — this is just for me.

**Layout:** Single page, vertical scroll

1. Header: “🌸 Create Your Digital Bouquet”
1. `<BouquetBuilder />` — flower canvas + picker
1. `<ThemeSelector />` — 4 background theme cards, click to select
1. `<MediaUploader />` — drag & drop or click to upload, max 6 photos
1. `<SetupForm />` — all text fields
1. “Generate Gift” button → shows result:
- The full URL (copyable)
- QR Code (downloadable)
- “Preview Gift” button (opens in new tab)

-----

## STEP 10 — CLOUDINARY UPLOAD HOOK

`src/hooks/useCloudinary.js`

```javascript
export const useCloudinary = () => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );
    
    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.secure_url;
  };

  return { uploadImage };
};
```

-----

## STEP 11 — RECEIVER VIEW (ORCHESTRATOR)

`src/components/receiver/ReceiverView.jsx`

```jsx
// States: 'pin' | 'bouquet' | 'envelope' | 'gallery'
// AnimatedBackground always renders (behind everything)
// State machine:
//   'pin' → PinLock → on correct PIN → 'bouquet'
//   'bouquet' → BouquetReveal → on click → 'envelope'
//   'envelope' → Envelope → after letter shown → 'gallery' (scroll appears)
//   'gallery' → MediaGallery visible below
```

Use `AnimatePresence` for transitions between states.

-----

## FINAL QUALITY CHECKLIST

Before marking done, verify ALL:

✅ Animated background plays immediately when receiver opens link (before PIN even)
✅ Background elements move smoothly, no jank, different speeds
✅ PIN shake animation on wrong entry
✅ Envelope flap opens in 3D (rotateX with perspective)
✅ Letter slides out of envelope smoothly
✅ Dancing Script font renders on letter text
✅ Polaroid photos have rotation, shadow, white border
✅ Spotify iframe renders and plays
✅ On mobile (375px): everything stacks, touch swipe works on carousel
✅ QR code generates correctly in creator dashboard
✅ URL with payload actually encodes all data
✅ Decoding URL actually renders correct gift
✅ No console errors in production build
✅ `npm run build` succeeds
✅ `vercel.json` exists for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

-----

**START NOW. Create SPEC.md first. Then proceed through every step without stopping.**
**Do not consider this task done until the animated background with photos is fully working.**   