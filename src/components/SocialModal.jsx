import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, BookMarked, GitFork, Loader2, Star, Users } from 'lucide-react'
import Window from './Window'
import { SectionLabel } from './ProjectModal'
import { GithubIcon, InstagramIcon, LinkedinIcon } from './BrandIcons'
import { profile } from '../data/profile'

// GitHub, LinkedIn and Instagram all refuse to be framed (X-Frame-Options / CSP),
// so the in-site view is a native profile card with a button to open the real page in a new tab.
const networks = {
  github: { title: 'github.com', Body: GithubBody, h: 640 },
  linkedin: { title: 'linkedin.com', Body: LinkedinBody, h: 480 },
  instagram: { title: 'instagram.com', Body: InstagramBody, h: 470 },
}

const rise = {
  hidden: { opacity: 0, y: 10 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: 0.08 + i * 0.04, type: 'spring', stiffness: 300, damping: 26 } }),
}

export default function SocialModal({ network, win }) {
  const { title, Body, h } = networks[network]
  return (
    <Window {...win} title={title} w={680} h={h} mono>
      <div className="p-6 @xl:p-8">
        <Body />
      </div>
    </Window>
  )
}

function OpenButton({ href, label, className = 'bg-white text-zinc-900 hover:bg-zinc-200' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${className}`}
    >
      {label}
      <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  )
}

function useGithub(username) {
  const [state, setState] = useState({ status: 'loading' })
  useEffect(() => {
    let cancelled = false
    const api = `https://api.github.com/users/${username}`
    Promise.all([fetch(api), fetch(`${api}/repos?sort=updated&per_page=6`)])
      .then(async ([u, r]) => {
        if (!u.ok || !r.ok) throw new Error(u.status === 403 ? 'rate-limited' : 'failed')
        return { user: await u.json(), repos: await r.json() }
      })
      .then((data) => !cancelled && setState({ status: 'ready', ...data }))
      .catch(() => !cancelled && setState({ status: 'error' }))
    return () => {
      cancelled = true
    }
  }, [username])
  return state
}

function GithubBody() {
  const username = profile.links.github.split('/').pop()
  const gh = useGithub(username)

  return (
    <>
      <motion.div variants={rise} initial="hidden" animate="visible" className="flex items-center gap-5">
        {gh.status === 'ready' ? (
          <img src={gh.user.avatar_url} alt="" className="h-20 w-20 rounded-full border border-white/15 grayscale" />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-full border border-white/15 bg-white/5">
            <GithubIcon className="h-9 w-9 text-white/70" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-serif text-3xl leading-tight text-white @xl:text-4xl">
            {gh.user?.name ?? profile.name}
          </h3>
          <p className="font-mono text-xs text-white/50">@{username}</p>
          {gh.status === 'ready' && (
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <BookMarked className="h-3.5 w-3.5" /> {gh.user.public_repos} repos
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> {gh.user.followers} followers · {gh.user.following} following
              </span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="mt-7">
        <SectionLabel>Recently updated</SectionLabel>
        {gh.status === 'loading' && (
          <p className="mt-4 flex items-center gap-2 text-sm text-white/50">
            <Loader2 className="h-4 w-4 animate-spin" /> Fetching repositories…
          </p>
        )}
        {gh.status === 'error' && (
          <p className="mt-4 text-sm text-white/50">Couldn't load repositories right now. The full profile is one click away.</p>
        )}
        {gh.status === 'ready' && (
          <div className="mt-3 grid gap-2 @xl:grid-cols-2">
            {gh.repos.map((repo, i) => (
              <motion.a
                key={repo.id}
                custom={i}
                variants={rise}
                initial="hidden"
                animate="visible"
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col rounded-xl border border-white/10 bg-black/20 p-3.5 transition hover:border-white/25 hover:bg-white/5"
              >
                <span className="flex items-center gap-1 truncate text-sm font-medium text-white/90">
                  {repo.name}
                  <ArrowUpRight className="h-3 w-3 shrink-0 text-white/30 transition group-hover:text-white/70" />
                </span>
                <span className="mt-1 line-clamp-2 min-h-[2lh] text-xs leading-snug text-white/45">
                  {repo.description ?? 'No description'}
                </span>
                <span className="mt-2.5 flex items-center gap-3 font-mono text-[10px] text-white/40">
                  {repo.language && <span>{repo.language}</span>}
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" /> {repo.forks_count}
                  </span>
                </span>
              </motion.a>
            ))}
          </div>
        )}
      </div>

      <div className="mt-7 border-t border-white/10 pt-6">
        <OpenButton href={profile.links.github} label="Open GitHub profile" />
      </div>
    </>
  )
}

function LinkedinBody() {
  return (
    <motion.div variants={rise} initial="hidden" animate="visible">
      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="h-20 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-900" />
        <div className="bg-black/20 px-5 pb-5">
          <div className="-mt-10 grid h-20 w-20 place-items-center overflow-hidden rounded-full border-4 border-zinc-900 bg-zinc-800">
            <img src={profile.portraitUrl} alt="" className="h-full w-full object-cover object-top grayscale" />
          </div>
          <h3 className="mt-3 font-serif text-3xl text-white">{profile.name}</h3>
          <p className="mt-1 text-sm text-white/70">
            {profile.education.degree} · {profile.education.school}
          </p>
          <p className="mt-1 text-xs text-white/45">{profile.focus.join(' · ')}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <OpenButton href={profile.links.linkedin} label="Connect on LinkedIn" />
        <LinkedinIcon className="h-5 w-5 text-white/30" />
      </div>
    </motion.div>
  )
}

function InstagramBody() {
  const handle = profile.links.instagram.split('/').pop()
  return (
    <motion.div variants={rise} initial="hidden" animate="visible" className="flex flex-col items-center text-center">
      <div className="rounded-full bg-[conic-gradient(from_210deg,#fdf497,#fd5949,#d6249f,#285AEB,#fdf497)] p-[3px]">
        <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-zinc-900 bg-zinc-800">
          <img src={profile.portraitUrl} alt="" className="h-full w-full object-cover object-top" />
        </div>
      </div>
      <h3 className="mt-4 font-mono text-lg text-white">@{handle}</h3>
      <p className="mt-1 text-sm text-white/55">{profile.name}</p>
      <OpenButton
        href={profile.links.instagram}
        label="Follow on Instagram"
        className="mt-6 bg-gradient-to-r from-[#fd5949] via-[#d6249f] to-[#285AEB] text-white hover:opacity-90"
      />
      <InstagramIcon className="mt-5 h-5 w-5 text-white/25" />
    </motion.div>
  )
}
