import { motion } from 'framer-motion'
import { ChevronRight, Folder } from 'lucide-react'
import Window from './Window'
import Thumbnail from './Thumbnail'
import { SectionLabel } from './ProjectModal'
import { additionalProjects, projects } from '../data/projects'
import { profile } from '../data/profile'

const grid = { visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } }
const cell = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 24 } },
}

export default function ProjectsExplorer({ win, onOpenProject }) {
  return (
    <Window {...win} title="Projects" w={900} h={600}>
      <div className="flex min-h-full">
        {/* Finder sidebar */}
        <aside className="hidden w-44 shrink-0 border-r border-white/10 bg-black/20 p-3 text-xs text-white/60 @xl:block">
          <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-white/35">Favourites</p>
          {['Featured', 'Additional'].map((s) => (
            <a
              key={s}
              href={`#explorer-${s.toLowerCase()}`}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/10 hover:text-white"
            >
              <Folder className="h-3.5 w-3.5 text-sky-300" /> {s}
            </a>
          ))}
        </aside>

        <div className="flex-1 p-5 @xl:p-6">
          <div className="mb-5 flex items-center gap-1 text-xs text-white/45">
            ~ <ChevronRight className="h-3 w-3" /> ajay <ChevronRight className="h-3 w-3" />
            <span className="text-white/80">projects</span>
            <span className="ml-auto">{projects.length + additionalProjects.length} items</span>
          </div>

          <SectionLabel>
            <span id="explorer-featured">Featured</span>
          </SectionLabel>
          <motion.div
            variants={grid}
            initial="hidden"
            animate="visible"
            className="mt-3 grid grid-cols-2 gap-2 @xl:grid-cols-3 @4xl:grid-cols-5"
          >
            {projects.map((p) => (
              <motion.button
                key={p.id}
                variants={cell}
                type="button"
                onClick={() => onOpenProject(p.id)}
                whileHover={{ y: -3 }}
                className="group flex flex-col items-center gap-2 rounded-xl p-3 text-center transition hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
              >
                <div className="rounded-lg border border-white/15 bg-white/10 p-[3px] shadow-lg">
                  <Thumbnail kind={p.thumb} className="h-12 w-20 rounded-md" />
                </div>
                <span className="text-xs font-medium text-white/90">{p.label}</span>
                <span className="-mt-1.5 text-[10px] leading-snug text-white/40">{p.tagline}</span>
              </motion.button>
            ))}
          </motion.div>

          <div className="mt-8">
            <SectionLabel>
              <span id="explorer-additional">Additional</span>
            </SectionLabel>
            <div className="mt-3 divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10">
              {additionalProjects.map((p) => (
                <a
                  key={p.id}
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 bg-black/10 px-4 py-3 transition hover:bg-white/5"
                >
                  <Thumbnail kind={p.thumb} className="h-8 w-12 shrink-0 rounded-md" />
                  <div>
                    <p className="text-sm text-white/90">{p.label}</p>
                    <p className="text-xs text-white/45">{p.tagline}</p>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 text-white/30" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Window>
  )
}
