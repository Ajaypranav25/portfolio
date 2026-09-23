import { motion, useMotionValue } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Portrait from './Portrait'
import Thumbnail from './Thumbnail'
import { projects } from '../data/projects'
import { profile } from '../data/profile'

// Vertical spatial feed for small screens — same content, no drag canvas.
export default function MobileFeed({ onOpenProject }) {
  const pointer = { x: useMotionValue(0.5), y: useMotionValue(0.5) }

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-ink-950 pb-28">
      <section
        className="relative h-[68vh] overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 35%, #71717a 0%, #3f3f46 30%, #18181b 70%, #0d0d0e 100%)' }}
      >
        <h1 className="pointer-events-none absolute inset-x-0 top-[16%] text-center font-serif text-[27vw] leading-[0.8] tracking-[-0.04em] text-white/[0.14]">
          <span className="italic">Ajay</span>
          <br />
          Pranav
        </h1>
        <Portrait src={profile.portraitUrl} pointer={pointer} className="absolute bottom-0 left-1/2 h-[88%] w-[120%] -translate-x-1/2" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="grain" />
        </div>
        <div className="absolute inset-x-5 bottom-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Portfolio — Vol. 01</p>
          <p className="mt-2 font-serif text-3xl leading-tight text-white">
            {profile.name.split(' ').slice(0, 2).join(' ')}, building with <span className="italic">applied AI</span>.
          </p>
        </div>
      </section>

      <section className="px-4 pt-6">
        <p className="px-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Projects</p>
        <div className="mt-3 space-y-3">
          {projects.map((p, i) => (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => onOpenProject(p.id)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 200, damping: 24, delay: i * 0.03 }}
              whileTap={{ scale: 0.98 }}
              className="glass flex w-full items-center gap-4 rounded-2xl p-3 text-left"
            >
              <div className="rounded-lg border border-white/15 bg-white/10 p-[3px]">
                <Thumbnail kind={p.thumb} className="h-12 w-20 rounded-md" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white">{p.label}</p>
                <p className="truncate text-xs text-white/50">{p.tagline}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40" />
            </motion.button>
          ))}
        </div>
      </section>
    </main>
  )
}
