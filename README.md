# WpDev Keyboard — Scrollytelling Landing Page

![Project Animation Demo](public/video.mov)

A high-end, scroll-driven animation landing page for the **WpDev** mechanical keyboard brand. Built with **Next.js 14**, **Framer Motion**, and **HTML5 Canvas**.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion (`useScroll`) |
| Rendering | HTML5 Canvas (60fps, DPR-aware) |
| Fonts | Inter (Google Fonts) |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your image frames

Place 192 JPG frames in `public/frames/` with 5-digit zero-padded naming:

```
00001.jpg
00002.jpg
...
00192.jpg
```

See `public/frames/README.md` for full export instructions.

#### Quick test with placeholder frames

```bash
npm install canvas  # one-time
node scripts/generate-placeholder-frames.js
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout + SEO metadata
│   ├── page.tsx            # Main page (nav + scroll experience + footer)
│   └── globals.css         # Design system, fog colors, typography
│
├── components/
│   └── KeyboardScroll.tsx  # ★ Core scroll animation component
│
├── public/
│   └── frames/             # 192 JPG frames (you provide)
│       └── README.md
│
└── scripts/
    └── generate-placeholder-frames.js  # Dev placeholder generator
```

---

## How the Animation Works

1. **Sticky Canvas** — A `h-[400vh]` container makes the page very long. Inside is a `position: sticky` viewport-height canvas.

2. **useScroll** — Framer Motion tracks scroll progress (0→1) within the container.

3. **Frame mapping** — `progress × 191` gives the current frame index. Clamped and deduplicated to avoid redundant canvas draws.

4. **Canvas draw** — Each frame is drawn with a responsive "cover" fit. This dynamically scales the image to completely fill the screen (`Math.max(w / imgW, h / imgH)`) while remaining fully centered. This prevents cropping the primary keyboard animation while perfectly accommodating all mobile screen aspect ratios and resizes!

5. **Story overlays** — 4 text beats fade in/out at specific scroll percentages using interpolated opacity + Y translate.

---

## Customization

### Fog color
If your layout/body background needs to seamlessly bleed with any potential letterboxing on extreme ultrawides, update `globals.css`:
```css
:root {
  --fog: #E8E8E8; /* ← eyedrop out-of-bounds color from your frame */
}
```

### Number of frames
Change `TOTAL_FRAMES` in `components/KeyboardScroll.tsx`:
```typescript
const TOTAL_FRAMES = 192 // ← your frame count
```

### Story beats
Edit the `STORY_BEATS` array in `KeyboardScroll.tsx` to adjust timing and copy.

---

## Performance Notes

- All frames are preloaded before playback starts.
- `requestAnimationFrame` batches canvas draws.
- `devicePixelRatio` support prevents blurry rendering on retina displays.
- Redundant draws are skipped if the frame index hasn't changed.
- `ResizeObserver` redraws correctly on window resize.

---

## Deploy

```bash
npm run build
npm start
```

Or push to Vercel — zero config needed.
