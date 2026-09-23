import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import FloatingNode from './FloatingNode'
import Portrait from './Portrait'
import { projects } from '../data/projects'
import { profile } from '../data/profile'

const readmeNode = { id: 'readme', label: 'readme.txt', thumb: 'readme', pos: { x: 86, y: 51 } }

export default function Canvas({ onOpenProject, onOpenPanel }) {
  const ref = useRef(null)
  const pointer = { x: useMotionValue(0.5), y: useMotionValue(0.5) }

  const onMove = (e) => {
    pointer.x.set(e.clientX / window.innerWidth)
    pointer.y.set(e.clientY / window.innerHeight)
  }

  return (
    <main
      ref={ref}
      onPointerMove={onMove}
      className="relative h-dvh w-full overflow-hidden bg-ink-950"
      style={{
        background:
          'radial-gradient(ellipse 70% 80% at 50% 38%, #71717a 0%, #3f3f46 28%, #18181b 62%, #0d0d0e 100%)',
      }}
    >
      {/* Editorial wordmark behind the figure */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="pointer-events-none absolute inset-x-0 top-[21%] select-none text-center font-serif leading-[0.8] tracking-[-0.04em] text-white/[0.13]"
        style={{ fontSize: 'clamp(6rem, 19vw, 22rem)' }}
      >
        <span className="italic">Ajay</span> Pranav
      </motion.h1>

      <Portrait
        src={profile.portraitUrl}
        pointer={pointer}
        className="absolute bottom-0 left-1/2 h-[92%] w-[min(82vh,900px)] -translate-x-1/2"
      />

      {/* Vignette + grain */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 45%, transparent 45%, rgba(0,0,0,.65) 100%)' }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="grain" />
      </div>

      <TopBar />

      {/* Caption, lower-left, editorial style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        className="pointer-events-none absolute bottom-8 left-8 hidden max-w-[240px] lg:block"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Portfolio — Vol. 01</p>
        <p className="mt-2 font-serif text-2xl leading-tight text-white/85">
          Full-stack engineer building with <span className="italic">applied AI</span>.
        </p>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="pointer-events-none absolute bottom-9 right-8 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-white/35 lg:block"
      >
        Drag the icons · Click to open
      </motion.p>

      {/* Scattered nodes */}
      {projects.map((p, i) => (
        <FloatingNode
          key={p.id}
          index={i}
          label={p.label}
          thumb={p.thumb}
          pos={p.pos}
          constraintsRef={ref}
          onOpen={() => onOpenProject(p.id)}
        />
      ))}
      <FloatingNode
        index={projects.length}
        label={readmeNode.label}
        thumb={readmeNode.thumb}
        pos={readmeNode.pos}
        constraintsRef={ref}
        onOpen={() => onOpenPanel('about')}
      />
    </main>
  )
}

function TopBar() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-4 text-xs text-white/60"
    >
      <span className="font-medium tracking-wide text-white/80">{profile.shortName}</span>
      <span className="font-mono">
        {now.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}{' '}
        {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
      </span>
    </motion.div>
  )
}
