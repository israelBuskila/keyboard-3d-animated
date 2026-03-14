# Image Frames Directory

Place your 192 JPG frames here, exported from a high quality animation sequence.

## Naming Convention

Files must follow a 5-digit zero-padded index, 1-based pattern:

```
00001.jpg
00002.jpg
00003.jpg
...
00192.jpg
```

## How to Generate

1. Take your keyboard 3D animation sequence.
2. Render as individual high-quality `.jpg` frames.
3. Keep the file names starting from `00001.jpg` up to the number of frames.
4. Drop all the files into this `/public/frames/` directory.

## Canvas Background

The `KeyboardScroll.tsx` component is styled with a responsive "cover" layout, scaling your image naturally according to the screen width vs height (`Math.max(w / imgW, h / imgH)`). By ensuring your .jpg images are high-res and beautifully rendered with an intact margin/safe-zone around your product, no cropping of the core product will be observed on phones or large screens!
