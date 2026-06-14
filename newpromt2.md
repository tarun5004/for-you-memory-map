# 🔧🌹 FULL AUDIT + FIX + YOUTUBE FEATURE + GIT COMMIT HISTORY
# Prompt for Codex — "For You — Cinematic Love Letter" project

---

## CONTEXT

The app is currently broken in multiple ways:
- Cloudinary photo uploads fail ("Upload failed. Remove and try again.")
- Components are not rendering correctly (rose-bed backgrounds, polaroid frames missing)
- Scroll/scroll-snap is NOT working — user cannot scroll down past the intro scene
- No git commit history exists for the work done so far

This prompt has FOUR parts. Complete them IN ORDER. Do not skip ahead.

---

## PART 1 — GIT HISTORY RECONSTRUCTION (DO THIS FIRST)

The project currently has all changes uncommitted (or as one giant blob). I want a 
clean, readable git history showing the evolution of this project from the original 
"digital-bouquet" idea to the current "For You — Cinematic Love Letter" app.

### Steps:
1. Run `git status` and `git log` to see current state. If no git repo exists, run 
   `git init`.
2. If there's an existing single uncommitted changeset, DO NOT commit it as one blob. 
   Instead, use `git add -p` (interactive patch staging) or stage files in logical 
   groups to create a sequence of commits like this:

```
1. "chore: scaffold Next.js app with Tailwind, Framer Motion, R3F, lz-string"
   → package.json, next.config.mjs, tsconfig.json, app/layout.tsx, globals.css, fonts

2. "feat: add payload codec utility (lz-string encode/decode)"
   → lib/codec.ts or utils/codec.ts

3. "feat: add PolaroidFrame component with tape + heart doodle styling"
   → components/PolaroidFrame.tsx

4. "feat: add PetalParticles (Three.js + CSS fallback)"
   → components/PetalParticles.tsx

5. "feat: add IntroScene with typewriter animation"
   → components/IntroScene.tsx

6. "feat: add MemoryScene with rotating background palettes"
   → components/MemoryScene.tsx

7. "feat: add MusicScene with Spotify embed + vinyl animation"
   → components/MusicScene.tsx

8. "feat: add LetterScene with paragraph reveal"
   → components/LetterScene.tsx

9. "feat: add ScrollProgress dot navigation"
   → components/ScrollProgress.tsx

10. "feat: add ReceiverExperience orchestrator with PIN gate"
    → components/ReceiverExperience.tsx, components/PinLock.tsx

11. "feat: add CreatorForm with Cloudinary upload, Spotify input, letter, PIN, QR code"
    → components/CreatorForm.tsx, hooks/useCloudinary.ts

12. "feat: wire up App Router pages (creator + receiver modes via ?payload=)"
    → app/page.tsx

13. "chore: add env config for Cloudinary"
    → .env.local (DO NOT commit actual secrets — see Part 1.3 below)

14. "docs: add BUILD_PLAN.md tracking implementation checklist"
    → BUILD_PLAN.md
```

If the actual file structure differs from this list, adapt the grouping logic but 
KEEP THE SAME PRINCIPLE: one logical feature/concern per commit, in the order it 
would naturally have been built (scaffold → utils → leaf components → composite 
components → pages → docs).

### 1.3 — IMPORTANT: Secrets handling
- Ensure `.env.local` and `.env` are in `.gitignore` BEFORE any commit. If they're 
  already tracked, run `git rm --cached .env.local .env` (keep the files on disk, 
  just untrack them).
- If `.env.local`/`.env` was already committed in a previous accidental commit, that's 
  a problem for later — for now just ensure it's gitignored going forward and not in 
  the new commit sequence.
- Create `.env.example` with placeholder values and commit THAT instead:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_here
```

### 1.4 — After reconstruction
Run `git log --oneline` and show me the resulting commit list so I can see the full 
history of what was built.

---

## PART 2 — FULL COMPONENT AUDIT & FIX (rendering + scroll issues)

The user reports: **"render nahi hore, scroll down bhi nahi chal raha"** — components 
aren't rendering and scrolling is completely broken. Audit EVERY component below 
methodically. For each, check render output in browser AND inspect the DOM/console 
for errors.

### 2.1 — Root layout & scroll container
- Open `app/layout.tsx` and the main page/experience container.
- Check: is there a wrapping element with `overflow-y: scroll` (or `auto`) and 
  `height: 100vh` / `100dvh`? Without this, `scroll-snap-type` does nothing.
- Common bug: `html, body { overflow: hidden }` set globally (sometimes added to 
  "prevent scrollbars" for the intro) but never removed/overridden for the scroll 
  container — this would explain "scroll down nahi chal raha" exactly.
- Fix: the scroll container should be:
```css
.scroll-container {
  height: 100dvh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}
.scroll-section {
  min-height: 100dvh;
  scroll-snap-align: start;
}
```
- Verify `html`/`body` do NOT have `overflow: hidden` unless the scroll-container 
  itself is the only scrollable element and is correctly sized to viewport.

### 2.2 — PetalParticles (Three.js)
- Check: does the `<Canvas>` from react-three-fiber have `position: fixed` with 
  `inset: 0` AND `z-index` LOWER than the content, AND `pointer-events: none`?
- A common bug: the Canvas captures pointer/scroll events because `pointer-events` 
  isn't set, which can block scroll on some browsers. Explicitly set 
  `pointer-events: none` on the canvas wrapper div.
- Verify the `dynamic(() => import(...), { ssr: false })` wrapper is correctly used 
  — if R3F tries to render server-side, it throws and can crash the whole tree 
  silently (check console for hydration errors).
- If Three.js is causing ANY console errors, temporarily disable it (comment out 
  the import/usage) and confirm the rest of the app renders — this isolates whether 
  Three.js is the blocker.

### 2.3 — MemoryScene background palettes
- Confirm each `MemoryScene` instance receives a `palette` prop and applies it as 
  either:
  - The section's `style={{ background: paletteGradient }}`, OR
  - A separate absolutely-positioned div behind content with `inset-0` and the 
    gradient as background
- Check the palette-cycling array/modulo logic actually produces different values 
  for different indices — log `console.log('palette for scene', index, palette)` 
  temporarily to verify.
- Confirm NO parent container has a solid `background-color` that's painted ON TOP 
  of (i.e., after, in DOM order / higher z-index than) the palette div.

### 2.4 — PolaroidFrame
- Confirm `imageUrl` prop is actually a valid string (not `undefined` or empty) — 
  this connects to the Cloudinary fix in Part 3. If `imageUrl` is falsy, the `<img>` 
  tag renders broken/empty, which may visually look like "nothing renders."
- Add a fallback: if `imageUrl` is missing, render a placeholder colored div instead 
  of a broken `<img>`, so layout doesn't collapse.

### 2.5 — ReceiverExperience orchestration
- Confirm the component correctly maps over `data.photos` array to render one 
  `MemoryScene` per photo. If `data.photos` is empty/undefined (because of upload 
  failures), NO MemoryScenes render at all — only Intro shows, which matches what 
  the user is seeing (stuck on intro, can't scroll because there's nothing below it 
  except maybe one tiny LetterScene).
- Confirm `MusicScene` and `LetterScene` ALWAYS render even if `photos` is empty, so 
  there's always something to scroll to.

### 2.6 — ScrollProgress
- Confirm this component doesn't have `position: fixed` covering the full screen 
  (which would block scroll/click events on content beneath it). It should only 
  occupy a thin strip on the right edge with `pointer-events: none` on its container 
  and `pointer-events: auto` only on the individual dots.

### 2.7 — Run and visually verify
After fixes, run `npm run dev`, open `localhost:3000`, generate a test payload (even 
with placeholder image URLs if Cloudinary still isn't fixed — use a public placeholder 
image URL like `https://picsum.photos/400/500` temporarily to isolate scroll issues 
from upload issues), and confirm:
- [ ] Page scrolls smoothly from Intro → Memory scenes → Music → Letter
- [ ] Scroll-snap feels intentional (each scene fills viewport)
- [ ] Side dots update as you scroll
- [ ] No console errors

---

## PART 3 — CLOUDINARY UPLOAD FIX (carry over from previous fix attempt)

Apply the SAME diagnostic steps as before — this is still broken:

1. Log the FULL Cloudinary error response (`await response.json()`) on upload failure, 
   not just a generic message.
2. Verify `.env.local` has correct `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and 
   `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (no quotes, no typos).
3. Verify in Cloudinary dashboard that the upload preset's mode is **Unsigned**.
4. RESTART the dev server after any `.env` change (Next.js doesn't hot-reload env vars).
5. Update the error UI to show the real error message: 
   `Upload failed: ${err.message}` instead of generic text.
6. Re-test all 6 photo uploads — confirm "6/6 uploaded" with zero red error text.

---

## PART 4 — NEW FEATURE: YouTube Video Embed Scene

Add a new optional scene: **`YouTubeScene.tsx`** — same family as `MusicScene`, 
placed in the scroll sequence AFTER `MusicScene` and BEFORE `LetterScene` (only if 
a YouTube URL was provided; otherwise skip it entirely, no empty scene).

### 4.1 — CreatorForm changes
- Add a new text input: "YouTube video URL (optional)" below the Spotify URL field.
- Validate/extract video ID:
```typescript
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
```
- If a valid ID is extracted, show a small inline preview thumbnail 
  (`https://img.youtube.com/vi/{id}/mqdefault.jpg`) below the input so the creator 
  knows it worked.
- Add `youtubeUrl` (or just the extracted `youtubeId`) to the payload object.

### 4.2 — YouTubeScene.tsx component
```
Background: Palette B (cream ivory) or a new "Palette E — Soft Sage" 
  (linear-gradient(160deg, #E8F0E3 0%, #C5D9C0 100%)) for variety.
PetalParticles: leaves variant (reuse petals variant, or add a 'leaves' option using 
  🍃 styling) at low density.

Layout:
  - Caption above: "a little moment 🎬" in Dancing Script
  - Embedded YouTube iframe inside a frame styled consistently with PolaroidFrame 
    (white border, subtle shadow, slight rotation ±1deg) — but WIDER aspect ratio 
    (16:9) than the photo polaroids:
```
```tsx
<div className="bg-[#FAFAFA] p-4 pb-8 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.25)] 
                w-[320px] sm:w-[480px] rotate-[-1deg]">
  <div className="bg-white p-1.5 aspect-video">
    <iframe
      className="w-full h-full"
      src={`https://www.youtube.com/embed/${youtubeId}`}
      title="YouTube video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
  {/* small tape element, same as PolaroidFrame */}
</div>
```
- Entrance animation: same `whileInView` spring pattern as MemoryScene/PolaroidFrame 
  for visual consistency.

### 4.3 — Wire into ReceiverExperience
- After MusicScene, conditionally render `<YouTubeScene youtubeId={data.youtubeId} />` 
  only if `data.youtubeId` exists.
- Update `ScrollProgress` dot count to account for this conditional scene (the dots 
  array should be built dynamically based on which scenes actually render, not a 
  hardcoded count).

---

## PART 5 — ADDITIONAL POLISH FEATURES (your call, use good judgment)

Add these IF they don't break the timeline/scope — prioritize Parts 1–4 first, but 
if time permits:

1. **Background ambient audio toggle**: small floating button (bottom-left, all scenes) 
   — a muted/unmuted speaker icon. If creator provides a Spotify track, this could 
   tie into autoplay-after-interaction (browsers block autoplay with sound until user 
   interacts) — OR simplest: just a visual toggle that doesn't need actual audio if 
   no separate audio file exists. Keep this simple — don't over-engineer.

2. **Scene counter**: "2 / 7" style counter (top-right, small, Quicksand font, low 
   opacity) showing current scene / total scenes — total should dynamically include 
   YouTube scene if present.

3. **"Replay" button**: at the very end of LetterScene, a small button "watch again 🔄" 
   that smooth-scrolls back to the IntroScene (`scrollIntoView({ behavior: 'smooth' })`).

4. **Loading state**: while photos are being fetched/decoded from the payload on the 
   receiver side, show a brief branded loading screen (small bouncing heart or flower 
   emoji + "loading your gift...") instead of a blank flash.

---

## FINAL DELIVERABLE CHECKLIST

- [ ] Part 1: Clean git history with logical commits, `git log --oneline` shown to me
- [ ] Part 2: Scroll works end-to-end, all scenes render, no console errors
- [ ] Part 3: Cloudinary uploads succeed (6/6, zero errors), real error messages shown 
      if they ever fail again
- [ ] Part 4: YouTube scene works — input → validation → preview → embedded scene in 
      receiver experience, scroll dots account for it
- [ ] Part 5: Whatever polish features were feasible, implemented cleanly
- [ ] `npm run build` passes with zero errors
- [ ] Full test: Creator form (real photos + Spotify + YouTube + letter + PIN) → 
      Generate → Preview → entire scroll experience works smoothly on both desktop 
      and mobile width (375px)
- [ ] Final commit: "feat: add YouTube scene, fix scroll/render issues, fix Cloudinary 
      uploads" (or split into multiple commits per the Part 1 pattern — your judgment, 
      but keep history readable)

---

**Work through Parts 1→5 in order. After each part, briefly report what you found 
and fixed before moving to the next. Do not declare the project "done" until the 
Final Deliverable Checklist is fully checked and you've demonstrated (describe what 
you saw in browser) that scroll works and all scenes render with real data.**