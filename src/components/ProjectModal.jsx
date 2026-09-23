import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronRight, Globe } from 'lucide-react'
import Window from './Window'
import Thumbnail from './Thumbnail'
import { GithubIcon } from './BrandIcons'

const stagger = {
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
}
const rise = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } },
}

export default function ProjectModal({ project, win }) {
  return (
    <Window {...win} title={`${project.label.toLowerCase().replace(/\s+/g, '-')}.app`} w={780} h={640} mono>
      <motion.div variants={stagger} initial="hidden" animate="visible" className="p-6 @xl:p-8">
        {/* Header */}
        <motion.div variants={rise} className="flex flex-col gap-5 @xl:flex-row @xl:items-center">
          <div className="rounded-xl border border-white/15 bg-white/10 p-1 shadow-2xl">
            <Thumbnail kind={project.thumb} className="h-20 w-32 rounded-lg" />
          </div>
          <div>
            <h3 className="font-serif text-4xl leading-none tracking-tight text-white @xl:text-5xl">{project.label}</h3>
            <p className="mt-2 text-sm text-white/60">{project.tagline}</p>
          </div>
        </motion.div>

        <motion.p variants={rise} className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/75">
          {project.summary}
        </motion.p>

        {/* Tech */}
        <motion.div variants={rise} className="mt-6 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/75">
              {t}
            </span>
          ))}
        </motion.div>

        <div className="mt-8 grid gap-8 @2xl:grid-cols-[1.1fr_1fr]">
          {/* Highlights */}
          <motion.div variants={rise}>
            <SectionLabel>Key highlights</SectionLabel>
            <ul className="mt-3 space-y-2.5">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-white/80">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-white/50" />
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Architecture */}
          <motion.div variants={rise}>
            <SectionLabel>Architecture</SectionLabel>
            <ol className="mt-3 space-y-1.5">
              {project.architecture.map((step, i) => (
                <li key={step.name}>
                  <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                    <span className="font-mono text-[10px] text-white/35">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-sm font-medium text-white/90">{step.name}</span>
                    <span className="ml-auto text-right font-mono text-[11px] text-white/45">{step.detail}</span>
                  </div>
                  {i < project.architecture.length - 1 && (
                    <div className="ml-[22px] h-1.5 w-px bg-white/15" />
                  )}
                </li>
              ))}
            </ol>
          </motion.div>
        </div>

        {/* Links */}
        <motion.div variants={rise} className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
          {project.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
            >
              {l.kind === 'github' ? <GithubIcon className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              {l.label}
              <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ))}
          <span className="ml-auto hidden items-center gap-1 self-center font-mono text-[11px] text-white/35 @xl:flex">
            esc closes the front window <ChevronRight className="h-3 w-3" />
          </span>
        </motion.div>
      </motion.div>
    </Window>
  )
}

export function SectionLabel({ children }) {
  return <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{children}</h4>
}
