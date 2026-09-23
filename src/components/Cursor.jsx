import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const INTERACTIVE = 'a, button, [role="button"], [data-cursor="pointer"]'
const RESIZE_ANGLE = { ew: 0, ns: 90, nwse: 45, nesw: -45 }
// shift each glyph so its hotspot sits on the true pointer position
const offsets = {
  arrow: { translateX: -6, translateY: -3.5 },
  hand: { translateX: -12, translateY: -3 },
  resize: { translateX: -15, translateY: -15 },
}

// Smooth custom cursor: arrow by default, pointing hand over interactive elements,
// double arrows over window resize handles.
// Only mounts for precise pointers (mouse / trackpad).
export default function Cursor() {
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const [mode, setMode] = useState('arrow')
  const [pressed, setPressed] = useState(false)
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 900, damping: 50, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 900, damping: 50, mass: 0.3 })

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-custom-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const resize = e.target.closest?.('[data-resize]')
      setMode(resize ? resize.dataset.resize : e.target.closest?.(INTERACTIVE) ? 'hand' : 'arrow')
    }
    const down = () => setPressed(true)
    const up = () => setPressed(false)
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.addEventListener('pointerleave', leave)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
    >
      <motion.svg
        viewBox="0 0 24 24"
        width="30"
        height="30"
        animate={{ scale: pressed ? 0.85 : 1 }}
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        style={offsets[mode] ?? offsets.resize}
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,.45)]"
      >
        {RESIZE_ANGLE[mode] !== undefined ? (
          <path
            d="M2.5 12 6.5 8v2.5h11V8l4 4-4 4v-2.5h-11V16Z"
            fill="#fff"
            stroke="#111"
            strokeWidth="1.2"
            strokeLinejoin="round"
            transform={`rotate(${RESIZE_ANGLE[mode]} 12 12)`}
          />
        ) : mode === 'hand' ? (
          <g fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
            <path d="M8.5 13.5V4a1.5 1.5 0 0 1 3 0v6.5V9.5a1.5 1.5 0 0 1 3 0V11v-.5a1.5 1.5 0 0 1 3 0V12v-.2a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2.5a5.5 5.5 0 0 1-4.4-2.2L4.2 16a1.5 1.5 0 0 1 2.3-1.9Z" />
            <path d="M11.5 10.5V14M14.5 11V14M17.5 12V14" fill="none" />
          </g>
        ) : (
          <path
            d="M5 3v16l4.2-3.8 2.7 5.8 2.4-1-2.6-5.7h5.8Z"
            fill="#fff"
            stroke="#111"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        )}
      </motion.svg>
    </motion.div>
  )
}
