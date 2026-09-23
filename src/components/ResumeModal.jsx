import { motion } from 'framer-motion'
import { Download, ExternalLink, GraduationCap } from 'lucide-react'
import Window from './Window'
import { SectionLabel } from './ProjectModal'
import { profile } from '../data/profile'
import { projects } from '../data/projects'

const stagger = { visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }
const rise = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } },
}

export default function ResumeModal({ win }) {
  return (
    <Window {...win} title="Resume.pdf" w={680} h={660}>
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
        <a
          href={profile.resumeUrl}
          download={profile.resumeFileName}
          className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-900 transition hover:bg-zinc-200"
        >
          <Download className="h-3.5 w-3.5" /> Download PDF
        </a>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
        </a>
      </div>

      {/* Paper-style quick view */}
      <motion.article
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="m-4 rounded-xl bg-zinc-50 p-6 text-zinc-800 shadow-2xl @xl:m-6 @xl:p-8"
      >
        <motion.header variants={rise} className="border-b border-zinc-200 pb-4">
          <h3 className="font-serif text-3xl tracking-tight text-zinc-950">{profile.name}</h3>
          <p className="mt-1 text-xs text-zinc-500">
            {profile.email} · github.com/{profile.links.github.split('/').pop()}
          </p>
        </motion.header>

        <motion.section variants={rise} className="mt-5">
          <SectionLabel>
            <span className="text-zinc-400">Education</span>
          </SectionLabel>
          <div className="mt-2 flex items-start gap-3">
            <GraduationCap className="mt-0.5 h-4 w-4 text-zinc-500" />
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <p className="text-sm font-semibold">{profile.education.school}</p>
                <p className="font-mono text-[11px] text-zinc-500">{profile.education.years}</p>
              </div>
              <p className="text-sm text-zinc-600">{profile.education.degree}</p>
            </div>
          </div>
        </motion.section>

        <motion.section variants={rise} className="mt-6">
          <SectionLabel>
            <span className="text-zinc-400">Projects</span>
          </SectionLabel>
          <ul className="mt-2 space-y-3">
            {projects.map((p) => (
              <li key={p.id}>
                <p className="text-sm">
                  <span className="font-semibold">{p.label}</span>
                  <span className="text-zinc-500"> — {p.tagline}</span>
                </p>
                <p className="font-mono text-[11px] text-zinc-500">{p.tech.join(' · ')}</p>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={rise} className="mt-6">
          <SectionLabel>
            <span className="text-zinc-400">Skills</span>
          </SectionLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.skills.map((s) => (
              <span key={s} className="rounded border border-zinc-200 bg-white px-2 py-0.5 text-xs">
                {s}
              </span>
            ))}
          </div>
        </motion.section>
      </motion.article>
    </Window>
  )
}
