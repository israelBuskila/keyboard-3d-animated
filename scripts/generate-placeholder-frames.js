#!/usr/bin/env node

/**
 * generate-placeholder-frames.js
 *
 * Generates 120 placeholder WebP frames using the Canvas API (via node-canvas).
 * Run this ONLY to preview the animation structure before your real frames arrive.
 *
 * Usage:
 *   npm install canvas  ← one-time
 *   node scripts/generate-placeholder-frames.js
 */

const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

const TOTAL = 120
const WIDTH = 1920
const HEIGHT = 1080
const OUT_DIR = path.join(__dirname, '../public/frames')
const FOG = '#E8E8E8'

fs.mkdirSync(OUT_DIR, { recursive: true })

for (let i = 0; i < TOTAL; i++) {
    const canvas = createCanvas(WIDTH, HEIGHT)
    const ctx = canvas.getContext('2d')

    // Fog background
    ctx.fillStyle = FOG
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // Animate a simple keyboard outline that "opens" as frames progress
    const progress = i / (TOTAL - 1)
    const openAngle = progress * 45 // degrees – lid opens

    ctx.save()
    ctx.translate(WIDTH / 2, HEIGHT / 2)

    // Base (bottom half of keyboard)
    ctx.fillStyle = `rgba(160,155,150,${0.5 + 0.3 * (1 - progress)})`
    ctx.beginPath()
    ctx.roundRect(-380, 40, 760, 200, 16)
    ctx.fill()

    // Key grid
    ctx.fillStyle = `rgba(100,95,90,${0.4 + 0.2 * (1 - progress)})`
    const rows = 4
    const cols = 14
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            ctx.beginPath()
            ctx.roundRect(-360 + c * 52, 50 + r * 44, 46, 38, 6)
            ctx.fill()
        }
    }

    // Lid (top plate) – rotates open
    ctx.save()
    ctx.translate(0, 40)
    ctx.rotate((-openAngle * Math.PI) / 180)
    ctx.translate(0, -40)

    ctx.fillStyle = `rgba(200,198,195,${0.6 + 0.3 * (1 - progress)})`
    ctx.beginPath()
    ctx.roundRect(-380, -200, 760, 200, 12)
    ctx.fill()

    // PCB layer hint (visible when open)
    if (progress > 0.3) {
        const layerAlpha = Math.min(1, (progress - 0.3) / 0.4)
        ctx.fillStyle = `rgba(60,120,60,${layerAlpha * 0.4})`
        ctx.beginPath()
        ctx.roundRect(-360, -190, 720, 180, 8)
        ctx.fill()

        ctx.fillStyle = `rgba(80,160,80,${layerAlpha * 0.6})`
        const traceCount = 18
        for (let t = 0; t < traceCount; t++) {
            ctx.beginPath()
            ctx.rect(-350 + t * 38, -185, 2, 170)
            ctx.fill()
        }
    }

    ctx.restore()

    // WpDev wordmark
    ctx.fillStyle = `rgba(0,0,0,${0.15 + 0.05 * Math.sin(progress * Math.PI)})`
    ctx.font = 'bold 28px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('WpDev', 0, 140)

    // Frame counter (dev only)
    ctx.fillStyle = 'rgba(0,0,0,0.12)'
    ctx.font = '14px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`${i + 1} / ${TOTAL}`, 900, 520)

    ctx.restore()

    const filename = `frame_${i}_delay-0.04s.webp`
    const outPath = path.join(OUT_DIR, filename)

    // Write as PNG (node-canvas doesn't natively output webp; rename works for demo)
    const buf = canvas.toBuffer('image/png')
    fs.writeFileSync(outPath, buf)

    if (i % 20 === 0 || i === TOTAL - 1) {
        console.log(`  ✓ Generated ${i + 1}/${TOTAL} frames`)
    }
}

console.log(`\n✅ Done! ${TOTAL} placeholder frames written to public/frames/`)
console.log('   Note: frames are PNG encoded (WebP label only). Replace with real frames.')
