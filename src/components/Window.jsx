import { useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'

const MIN_W = 340
const MIN_H = 240
const TOP = 40 // keep clear of the top bar
const DOCK_GAP = 104 // keep maximised windows clear of the dock
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)
const spring = { type: 'spring', stiffness: 380, damping: 36 }
// Body tints live on the scroll area so they fill the window at any size
const TONES = { terminal: 'bg-black/30' }

// Edge / corner handles: direction letters say which edges move
const HANDLES = [
  { dir: 'n', cursor: 'ns', className: 'inset-x-3 -top-1 h-2' },
  { dir: 's', cursor: 'ns', className: 'inset-x-3 -bottom-1 h-2' },
  { dir: 'w', cursor: 'ew', className: 'inset-y-3 -left-1 w-2' },
  { dir: 'e', cursor: 'ew', className: 'inset-y-3 -right-1 w-2' },
  { dir: 'nw', cursor: 'nwse', className: '-left-1 -top-1 h-4 w-4' },
  { dir: 'se', cursor: 'nwse', className: '-bottom-1 -right-1 h-4 w-4' },
  { dir: 'ne', cursor: 'nesw', className: '-right-1 -top-1 h-4 w-4' },
  { dir: 'sw', cursor: 'nesw', className: '-bottom-1 -left-1 h-4 w-4' },
]

// Runs a pointer-drag gesture on window, with text selection suppressed while it lasts
function track(e, onMove) {
  e.preventDefault()
  const prev = document.body.style.userSelect
  document.body.style.userSelect = 'none'
  const move = (ev) => onMove(ev.clientX - e.clientX, ev.clientY - e.clientY)
  const up = () => {
    document.body.style.userSelect = prev
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
    window.removeEventListener('blur', up)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
  window.addEventListener('blur', up)
}

export default function Window(props) {
  return props.mobile ? <MobileSheet {...props} /> : <DesktopWindow {...props} />
}

// Movable, resizable glass OS window
function DesktopWindow({ title, w = 720, h = 620, mono, tone, slot = 0, z, focused, minimized, onClose, onFocus, onMinimize, children }) {
  const [initial] = useState(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const width = Math.min(w, vw - 32)
    const height = Math.min(h, vh - TOP - DOCK_GAP)
    const step = (slot % 6) * 28 - 56 // cascade new windows
    return {
      width,
      height,
      x: clamp((vw - width) / 2 + step, 8, vw - width - 8),
      y: clamp((vh - DOCK_GAP - height) / 2 + step, TOP, vh - height - 8),
    }
  })
  const x = useMotionValue(initial.x)
  const y = useMotionValue(initial.y)
  const width = useMotionValue(initial.width)
  const height = useMotionValue(initial.height)
  const [maximized, setMaximized] = useState(false)
  const restore = useRef(null)

  const startMove = (e) => {
    if (e.button !== 0 || e.target.closest('button') || maximized) return
    const sx = x.get()
    const sy = y.get()
    track(e, (dx, dy) => {
      x.set(clamp(sx + dx, 120 - width.get(), window.innerWidth - 120))
      y.set(clamp(sy + dy, 0, window.innerHeight - 60))
    })
  }

  const startResize = (dir) => (e) => {
    if (e.button !== 0 || maximized) return
    e.stopPropagation()
    onFocus()
    const s = { x: x.get(), y: y.get(), w: width.get(), h: height.get() }
    track(e, (dx, dy) => {
      if (dir.includes('e')) width.set(clamp(s.w + dx, MIN_W, window.innerWidth - s.x))
      if (dir.includes('s')) height.set(clamp(s.h + dy, MIN_H, window.innerHeight - s.y))
      if (dir.includes('w')) {
        const nw = clamp(s.w - dx, MIN_W, s.x + s.w)
        width.set(nw)
        x.set(s.x + s.w - nw)
      }
      if (dir.includes('n')) {
        const nh = clamp(s.h - dy, MIN_H, s.y + s.h)
        height.set(nh)
        y.set(s.y + s.h - nh)
      }
    })
  }

  const toggleMaximize = () => {
    const target = maximized
      ? restore.current
      : { x: 8, y: TOP, w: window.innerWidth - 16, h: window.innerHeight - TOP - DOCK_GAP }
    if (!maximized) restore.current = { x: x.get(), y: y.get(), w: width.get(), h: height.get() }
    animate(x, target.x, spring)
    animate(y, target.y, spring)
    animate(width, target.w, spring)
    animate(height, target.h, spring)
    setMaximized(!maximized)
  }

  return (
    <motion.section
      role="dialog"
      aria-label={title}
      onPointerDownCapture={() => !focused && onFocus()}
      initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
      animate={
        minimized
          ? { opacity: 0, scale: 0.25, filter: 'blur(6px)', transition: { duration: 0.28, ease: 'easeIn' } }
          : { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 260, damping: 26 } }
      }
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(6px)', transition: { duration: 0.18 } }}
      style={{
        x,
        y,
        width,
        height,
        zIndex: z,
        transformOrigin: minimized ? '50% 140%' : '50% 50%',
        pointerEvents: minimized ? 'none' : 'auto',
      }}
      className={`glass-window fixed left-0 top-0 flex flex-col overflow-hidden rounded-2xl transition-shadow ${
        focused ? '' : 'shadow-[0_20px_50px_-20px_rgba(0,0,0,.6)]'
      }`}
    >
      <header
        onPointerDown={startMove}
        onDoubleClick={(e) => !e.target.closest('button') && toggleMaximize()}
        className="flex h-11 shrink-0 items-center border-b border-white/10 bg-white/[0.03] px-4"
      >
        <TrafficLights focused={focused} onClose={onClose} onMinimize={onMinimize} onMaximize={toggleMaximize} />
        <h2
          className={`pointer-events-none flex-1 truncate pl-4 pr-16 text-center text-xs transition ${
            focused ? 'text-white/60' : 'text-white/30'
          } ${mono ? 'font-mono' : 'font-medium'}`}
        >
          {title}
        </h2>
      </header>

      <div className={`@container thin-scrollbar min-h-0 flex-1 overflow-y-auto ${TONES[tone] ?? ''}`}>{children}</div>

      {!maximized &&
        HANDLES.map((hdl) => (
          <div
            key={hdl.dir}
            data-resize={hdl.cursor}
            onPointerDown={startResize(hdl.dir)}
            className={`absolute z-10 ${hdl.className}`}
          />
        ))}
    </motion.section>
  )
}

function TrafficLights({ focused, onClose, onMinimize, onMaximize }) {
  const lights = [
    { label: 'Close window', color: 'bg-[#ff5f57]', idle: 'bg-white/20 group-hover/lights:bg-[#ff5f57]', glyph: '×', onClick: onClose },
    { label: 'Minimise window', color: 'bg-[#febc2e]', idle: 'bg-white/20 group-hover/lights:bg-[#febc2e]', glyph: '−', onClick: onMinimize },
    { label: 'Maximise window', color: 'bg-[#28c840]', idle: 'bg-white/20 group-hover/lights:bg-[#28c840]', glyph: '+', onClick: onMaximize },
  ]
  return (
    <div className="group/lights flex shrink-0 gap-2">
      {lights.map((l) => (
        <button
          key={l.label}
          type="button"
          aria-label={l.label}
          onClick={l.onClick}
          className={`grid h-3 w-3 place-items-center rounded-full transition ${focused ? l.color : l.idle}`}
        >
          <span className="text-[9px] font-bold leading-none text-black/60 opacity-0 group-hover/lights:opacity-100">
            {l.glyph}
          </span>
        </button>
      ))}
    </div>
  )
}

// Small screens: one full-width sheet at a time with a backdrop
function MobileSheet({ title, mono, tone, onClose, children }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center p-3 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 26 } }}
        exit={{ opacity: 0, y: 20, transition: { duration: 0.18 } }}
        className="glass-window relative flex max-h-[80vh] w-full flex-col overflow-hidden rounded-2xl"
      >
        <header className="flex h-11 shrink-0 items-center border-b border-white/10 bg-white/[0.03] px-4">
          <div className="flex gap-2">
            <button type="button" onClick={onClose} aria-label="Close window" className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <h2 className={`flex-1 truncate pl-4 pr-12 text-center text-xs text-white/60 ${mono ? 'font-mono' : 'font-medium'}`}>
            {title}
          </h2>
        </header>
        <div className={`@container thin-scrollbar min-h-0 overflow-y-auto ${TONES[tone] ?? ''}`}>{children}</div>
      </motion.section>
    </motion.div>
  )
}
