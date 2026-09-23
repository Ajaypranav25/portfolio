import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

// Uses public/portrait.jpg when present; otherwise renders a generated studio silhouette.
export default function Portrait({ src, pointer, className = '' }) {
  const [hasPhoto, setHasPhoto] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setHasPhoto(img.naturalWidth > 0)
    img.src = src
  }, [src])

  // Gentle counter-parallax against the pointer
  const sx = useSpring(useTransform(pointer.x, [0, 1], [14, -14]), { stiffness: 60, damping: 20 })
  const sy = useSpring(useTransform(pointer.y, [0, 1], [8, -8]), { stiffness: 60, damping: 20 })

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-none select-none ${className}`}
    >
      {hasPhoto ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-contain object-bottom grayscale contrast-[1.1] brightness-[1.05] drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]"
          style={{
            maskImage: 'linear-gradient(to bottom, #000 62%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000 62%, transparent 100%)',
          }}
        />
      ) : (
        <Silhouette />
      )}
    </motion.div>
  )
}

function Silhouette() {
  return (
    <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMax meet" className="h-full w-full">
      <defs>
        <linearGradient id="body" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#71717a" />
          <stop offset="0.35" stopColor="#3f3f46" />
          <stop offset="1" stopColor="#09090b" />
        </linearGradient>
        <radialGradient id="key" cx="0.32" cy="0.28" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="fadeMask">
          <rect width="600" height="800" fill="url(#fade)" />
        </mask>
        <filter id="soft">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id="rim">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <g mask="url(#fadeMask)">
        {/* rim light */}
        <path d={FIGURE} fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="10" filter="url(#rim)" />
        <path d={FIGURE} fill="url(#body)" filter="url(#soft)" />
        <path d={FIGURE} fill="url(#key)" />
        {/* collar / hood fold hints */}
        <path d="M232 470 C 260 520, 340 520, 368 470" fill="none" stroke="#000" strokeOpacity=".35" strokeWidth="14" filter="url(#rim)" />
        <path d="M168 610 C 220 560, 250 560, 280 600" fill="none" stroke="#fff" strokeOpacity=".07" strokeWidth="18" filter="url(#rim)" />
      </g>
    </svg>
  )
}

// Head, neck and shoulders — a hooded, three-quarter studio silhouette
const FIGURE = `
  M300 118
  C 372 118, 414 178, 414 258
  C 414 318, 396 372, 364 408
  C 356 432, 356 452, 368 470
  C 440 500, 520 540, 560 640
  L 600 800 L 0 800 L 40 650
  C 76 548, 160 500, 232 470
  C 244 452, 244 432, 236 408
  C 204 372, 186 318, 186 258
  C 186 178, 228 118, 300 118 Z`
