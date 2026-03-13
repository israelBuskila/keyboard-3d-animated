'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from 'framer-motion'

// ─── Constants ───────────────────────────────────────────────────────────────

const TOTAL_FRAMES = 192
const FRAME_DIR = '/frames'

// Naming: 00001.jpg → 00192.jpg  (1-based, 5-digit zero-padded)
function getFrameUrl(index: number): string {
    const n = String(index + 1).padStart(5, '0')
    return `${FRAME_DIR}/${n}.jpg`
}

// ─── Story Beats ──────────────────────────────────────────────────────────────

interface StoryBeat {
    id: string
    startProgress: number
    endProgress: number
    heading: string
    subtext: string
    align: 'center' | 'left' | 'right'
    cta?: boolean
}

const STORY_BEATS: StoryBeat[] = [
    {
        id: 'intro',
        startProgress: 0,
        endProgress: 0.15,
        heading: 'WpDev Keyboard.',
        subtext: 'Engineered clarity.',
        align: 'center',
    },
    {
        id: 'precision',
        startProgress: 0.2,
        endProgress: 0.38,
        heading: 'Built for\nPrecision.',
        subtext: 'Every detail, measured.',
        align: 'left',
    },
    {
        id: 'layers',
        startProgress: 0.52,
        endProgress: 0.72,
        heading: 'Layered\nEngineering.',
        subtext: 'See what\'s inside.',
        align: 'right',
    },
    {
        id: 'assembled',
        startProgress: 0.83,
        endProgress: 1.0,
        heading: 'Assembled.\nReady.',
        subtext: 'Scroll back to replay.',
        align: 'center',
        cta: true,
    },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val))
}

function computeOverlayOpacity(progress: number, beat: StoryBeat): number {
    const fadeWindow = 0.05
    const { startProgress, endProgress } = beat

    if (progress < startProgress) return 0
    if (progress > endProgress) return 0

    // Fade in
    if (progress <= startProgress + fadeWindow) {
        return easeInOutCubic((progress - startProgress) / fadeWindow)
    }
    // Fade out
    if (progress >= endProgress - fadeWindow) {
        return easeInOutCubic((endProgress - progress) / fadeWindow)
    }
    return 1
}

// ─── Loading Overlay ──────────────────────────────────────────────────────────

function LoadingOverlay({ progress }: { progress: number }) {
    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ backgroundColor: 'var(--fog)' }}
        >
            {/* Spinner */}
            <div className="relative w-10 h-10 mb-6">
                <svg
                    className="animate-spin-slow"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="20"
                        cy="20"
                        r="17"
                        stroke="rgba(0,0,0,0.1)"
                        strokeWidth="2"
                    />
                    <path
                        d="M20 3 A17 17 0 0 1 37 20"
                        stroke="rgba(0,0,0,0.7)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Label */}
            <p
                className="text-xs font-medium tracking-widest uppercase animate-pulse-subtle"
                style={{ color: 'var(--text-muted)', letterSpacing: '0.14em' }}
            >
                Loading WpDev sequence…
            </p>

            {/* Progress bar */}
            <div
                className="mt-5 h-px w-40 overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.08)' }}
            >
                <div
                    className="h-full transition-all duration-300"
                    style={{
                        width: `${Math.round(progress * 100)}%`,
                        background: 'rgba(0,0,0,0.45)',
                    }}
                />
            </div>
        </div>
    )
}

// ─── Story Text Overlay ───────────────────────────────────────────────────────

function StoryOverlay({
    beat,
    opacity,
    yOffset,
}: {
    beat: StoryBeat
    opacity: number
    yOffset: number
}) {
    const alignClass = {
        center: 'items-center text-center',
        left: 'items-start text-left',
        right: 'items-end text-right',
    }[beat.align]

    const positionStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
        opacity,
        transform: `translateY(${yOffset}px)`,
        willChange: 'opacity, transform',
    }

    // Horizontal padding & positioning per alignment
    const innerStyle: React.CSSProperties = {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 clamp(24px, 6vw, 80px)',
        paddingBottom: 'clamp(60px, 10vh, 120px)',
    }

    const headingLines = beat.heading.split('\n')

    return (
        <div style={positionStyle}>
            <div className={`flex flex-col ${alignClass}`} style={innerStyle}>
                <h2 className="overlay-heading">
                    {headingLines.map((line, i) => (
                        <span key={i} style={{ display: 'block' }}>
                            {line}
                        </span>
                    ))}
                </h2>
                <p className="overlay-subtext">{beat.subtext}</p>
                {beat.cta && (
                    <button
                        className="btn-primary"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        style={{ pointerEvents: 'auto', alignSelf: beat.align === 'center' ? 'center' : beat.align === 'right' ? 'flex-end' : 'flex-start' }}
                    >
                        <span>Replay</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M7 1L7 4M7 1L4.5 3.5M7 1L9.5 3.5"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M2 7C2 4.23858 4.23858 2 7 2C8.5 2 9.85 2.67 10.76 3.75"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M12 7C12 9.76142 9.76142 12 7 12C5.5 12 4.15 11.33 3.24 10.25"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KeyboardScroll() {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imagesRef = useRef<HTMLImageElement[]>([])
    const bgImageRef = useRef<HTMLImageElement | null>(null)
    const currentFrameRef = useRef<number>(-1)
    const rafRef = useRef<number | null>(null)
    const progressRef = useRef<number>(0)

    const [loadedCount, setLoadedCount] = useState(0)
    const [allLoaded, setAllLoaded] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    })

    // ── Canvas draw ────────────────────────────────────────────────────────────

    const drawFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const img = imagesRef.current[frameIndex]
        if (!img || !img.complete || !img.naturalWidth) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Always sync canvas pixel buffer to actual rendered size
        const w = canvas.offsetWidth
        const h = canvas.offsetHeight
        if (w === 0 || h === 0) return

        canvas.width = w
        canvas.height = h

        const imgW = img.naturalWidth
        const imgH = img.naturalHeight
        const isMobile = w < 1024

        // Draw background filling the entire canvas ("cover")
        const bgImg = bgImageRef.current
        if (bgImg && bgImg.complete && bgImg.naturalWidth) {
            const bgW = bgImg.naturalWidth
            const bgH = bgImg.naturalHeight
            const bgScale = Math.max(w / bgW, h / bgH)
            const drawBgW = bgW * bgScale
            const drawBgH = bgH * bgScale
            const bgX = (w - drawBgW) / 2
            const bgY = (h - drawBgH) / 2
            ctx.drawImage(bgImg, bgX, bgY, drawBgW, drawBgH)
        } else {
            ctx.clearRect(0, 0, w, h)
            ctx.fillStyle = 'var(--fog, #f2f2f2)'
            ctx.fillRect(0, 0, w, h)
        }

        if (isMobile) {
            // ── Mobile: sharp keyboard (contain, centered) ──────────
            // Fits the entire frame inside the screen without cropping
            const containScale = Math.min(w / imgW, h / imgH)
            const containW = imgW * containScale
            const containH = imgH * containScale
            const containX = (w - containW) / 2
            const containY = (h - containH) / 2

            ctx.drawImage(img, containX, containY, containW, containH)
        } else {
            // ── Desktop: standard "cover" fill ────────────────────────────────────
            const scale = Math.max(w / imgW, h / imgH)
            const drawW = imgW * scale
            const drawH = imgH * scale
            const offsetX = (w - drawW) / 2
            const offsetY = (h - drawH) / 2

            ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
        }
    }, [])

    const scheduleFrame = useCallback((progress: number) => {
        const frameIndex = clamp(
            Math.round(progress * (TOTAL_FRAMES - 1)),
            0,
            TOTAL_FRAMES - 1
        )

        if (frameIndex === currentFrameRef.current) return
        currentFrameRef.current = frameIndex

        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(() => {
            drawFrame(frameIndex)
        })
    }, [drawFrame])

    // ── Canvas resize handler ─────────────────────────────────────────────────

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1
            const displayW = canvas.clientWidth
            const displayH = canvas.clientHeight
            canvas.width = Math.round(displayW * dpr)
            canvas.height = Math.round(displayH * dpr)
            // Redraw current frame after resize
            if (currentFrameRef.current >= 0) {
                const ctx = canvas.getContext('2d')
                if (ctx) ctx.scale(dpr, dpr)
                drawFrame(currentFrameRef.current)
            }
        }

        const ro = new ResizeObserver(handleResize)
        ro.observe(canvas)
        return () => ro.disconnect()
    }, [drawFrame])

    // ── Image preloading ──────────────────────────────────────────────────────

    useEffect(() => {
        let loaded = 0
        const totalToLoad = TOTAL_FRAMES + 1 // +1 for the static background
        const images: HTMLImageElement[] = []

        const checkDone = () => {
            loaded++
            setLoadedCount(Math.min(loaded, TOTAL_FRAMES))
            if (loaded === totalToLoad) {
                setAllLoaded(true)
                imagesRef.current = images
                drawFrame(0)
                currentFrameRef.current = 0
            }
        }

        // Preload static background image
        const bgImg = new Image()
        bgImg.src = '/background.png'
        bgImg.onload = () => {
            bgImageRef.current = bgImg
            checkDone()
        }
        bgImg.onerror = checkDone

        // Preload sequential keyboard frames
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image()
            img.src = getFrameUrl(i)
            img.onload = checkDone
            img.onerror = checkDone
            images.push(img)
        }

        imagesRef.current = images

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [drawFrame])

    // ── Scroll → Frame ────────────────────────────────────────────────────────

    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
        progressRef.current = latest
        setScrollProgress(latest)
        if (allLoaded) {
            scheduleFrame(latest)
        }
    })

    // ── Active beat detection ─────────────────────────────────────────────────

    const activeBeats = STORY_BEATS.map((beat) => ({
        beat,
        opacity: computeOverlayOpacity(scrollProgress, beat),
        yOffset: (1 - computeOverlayOpacity(scrollProgress, beat)) * 12,
    })).filter(({ opacity }) => opacity > 0.001)

    const loadProgress = TOTAL_FRAMES > 0 ? loadedCount / TOTAL_FRAMES : 0

    return (
        <>
            {/* Loading overlay */}
            <AnimatePresence>
                {!allLoaded && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <LoadingOverlay progress={loadProgress} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scroll container: 400vh drives the animation */}
            <div ref={containerRef} style={{ height: '400vh', position: 'relative' }}>
                {/* Sticky canvas viewport */}
                <div
                    style={{
                        position: 'sticky',
                        top: 0,
                        height: '100vh',
                        width: '100%',
                        overflow: 'hidden',
                        backgroundColor: 'var(--fog)',
                    }}
                >
                    {/* Canvas */}
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            display: 'block',
                        }}
                    />

                    {/* Story text overlays */}
                    {activeBeats.map(({ beat, opacity, yOffset }) => (
                        <StoryOverlay
                            key={beat.id}
                            beat={beat}
                            opacity={opacity}
                            yOffset={yOffset}
                        />
                    ))}

                    {/* Scroll indicator (only at start) */}
                    {scrollProgress < 0.04 && allLoaded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            style={{
                                position: 'absolute',
                                bottom: '2.5rem',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                pointerEvents: 'none',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '0.65rem',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-muted)',
                                }}
                            >
                                Scroll
                            </span>
                            <motion.div
                                animate={{ y: [0, 6, 0] }}
                                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9 3V15M9 15L4.5 10.5M9 15L13.5 10.5"
                                        stroke="rgba(0,0,0,0.3)"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Progress pill */}
                    {allLoaded && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '2.5rem',
                                right: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                opacity: 0.5,
                            }}
                        >
                            <div
                                style={{
                                    width: 48,
                                    height: 2,
                                    background: 'rgba(0,0,0,0.1)',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        width: `${scrollProgress * 100}%`,
                                        height: '100%',
                                        background: 'rgba(0,0,0,0.5)',
                                        transition: 'width 0.1s linear',
                                        borderRadius: 1,
                                    }}
                                />
                            </div>
                            <span
                                style={{
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.1em',
                                    color: 'var(--text-muted)',
                                }}
                            >
                                {Math.round(scrollProgress * 100)}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
