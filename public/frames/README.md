# Image Frames Directory

Place your 120 WebP frames here, exported from ezgif-split.

## Naming Convention

Files must follow this exact pattern:

```
frame_0_delay-0.04s.webp
frame_1_delay-0.04s.webp
frame_2_delay-0.04s.webp
...
frame_119_delay-0.04s.webp
```

## How to Generate

1. Take your keyboard animation GIF/video
2. Upload to [ezgif.com/split](https://ezgif.com/split)
3. Export as WebP with 0.04s delay
4. Rename files to match the naming convention above
5. Drop all 120 files in this `/public/frames/` directory

## Fog Color Matching

The `KeyboardScroll.tsx` component uses `#E8E8E8` as the canvas background.
Make sure your frame backgrounds match this fog tone for seamless blending.

If your frames use a slightly different fog shade, update the `ctx.fillStyle` in `components/KeyboardScroll.tsx`:

```typescript
ctx.fillStyle = '#E8E8E8' // ← change this to match your frames
```
