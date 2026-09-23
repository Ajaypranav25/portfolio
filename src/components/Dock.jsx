import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FileText, FolderOpen, Mail, Terminal } from 'lucide-react'
import { GithubIcon, InstagramIcon, LinkedinIcon } from './BrandIcons'

const BASE = 46
const MAX = 70
const RANGE = 150

export const dockItems = [
  {
    id: 'about',
    label: 'About Me',
    icon: Terminal,
    tile: 'bg-gradient-to-b from-zinc-800 to-zinc-950 text-emerald-300',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderOpen,
    tile: 'bg-gradient-to-b from-zinc-100 to-zinc-300 text-zinc-800',
  },
  {
    id: 'resume',
    label: 'Resume',
    icon: FileText,
    tile: 'bg-gradient-to-b from-amber-100 to-amber-300 text-amber-900',
  },
  'divider',
  {
    id: 'github',
    label: 'GitHub',
    icon: GithubIcon,
    tile: 'bg-gradient-to-b from-zinc-700 to-zinc-900 text-white',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: LinkedinIcon,
    tile: 'bg-gradient-to-b from-zinc-200 to-zinc-400 text-zinc-900',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: InstagramIcon,
    tile: 'bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)] text-white',
  },
  'divider',
  {
    id: 'contact',
    label: 'Contact',
    icon: Mail,
    tile: 'bg-gradient-to-b from-white to-zinc-200 text-zinc-900',
  },
]

export default function Dock({ openTypes, onSelect, compact = false }) {
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.nav
      aria-label="Dock"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 140, damping: 18 }}
      onMouseMove={(e) => !compact && mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`glass fixed bottom-4 left-1/2 z-[5000] flex -translate-x-1/2 items-end rounded-[22px] ${
        compact
          ? 'no-scrollbar max-w-[calc(100vw-24px)] gap-1.5 overflow-x-auto px-2 py-2'
          : 'gap-2 px-2.5 pb-2.5 pt-2.5'
      }`}
      style={{ background: 'rgba(24,24,27,.45)' }}
    >
      {dockItems.map((item, i) =>
        item === 'divider' ? (
          <div key={`d${i}`} className={`mx-1 w-px self-stretch bg-white/15 ${compact ? 'my-1' : 'my-2'}`} />
        ) : (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            compact={compact}
            active={openTypes.has(item.id)}
            onSelect={onSelect}
          />
        ),
      )}
    </motion.nav>
  )
}

function DockIcon({ item, mouseX, compact, active, onSelect }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)

  // Neighbour magnification: size falls off with distance from the pointer
  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return x - b.x - b.width / 2
  })
  const target = useTransform(distance, [-RANGE, 0, RANGE], [BASE, MAX, BASE])
  const size = useSpring(target, { mass: 0.1, stiffness: 170, damping: 12 })
  const Icon = item.icon

  const common = {
    ref,
    'aria-label': item.label,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
    style: compact ? { width: 40, height: 40 } : { width: size, height: size },
    whileHover: { y: -4 },
    whileTap: { scale: 0.9 },
    className: 'relative shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-[14px]',
  }

  const tile = (
    <>
      <div
        className={`flex h-full w-full items-center justify-center rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_6px_16px_-6px_rgba(0,0,0,.7)] ${item.tile}`}
      >
        <Icon className="h-[46%] w-[46%]" strokeWidth={1.8} />
      </div>
      <AnimatePresence>
        {hovered && !compact && (
          <motion.span
            initial={{ opacity: 0, y: 6, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 4, x: '-50%' }}
            className="glass pointer-events-none absolute -top-11 left-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium text-white"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {active && <span className="absolute -bottom-[7px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/80" />}
    </>
  )

  return (
    <motion.button {...common} type="button" onClick={() => onSelect(item.id)}>
      {tile}
    </motion.button>
  )
}
