import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Canvas from './components/Canvas'
import MobileFeed from './components/MobileFeed'
import Dock from './components/Dock'
import ProjectModal from './components/ProjectModal'
import AboutModal from './components/AboutModal'
import ProjectsExplorer from './components/ProjectsExplorer'
import ResumeModal from './components/ResumeModal'
import ContactModal from './components/ContactModal'
import SocialModal from './components/SocialModal'
import Cursor from './components/Cursor'
import Toast from './components/Toast'
import { projects } from './data/projects'

const SOCIALS = ['github', 'linkedin', 'instagram']

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export default function App() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  // Open windows: { key, type, id?, z, slot, minimized }. Highest z = focused.
  const [wins, setWins] = useState([])
  const [toast, setToast] = useState(null)
  const zTop = useRef(100)
  const cascade = useRef(0)
  const toastTimer = useRef()

  // Opening an already-open window restores and focuses it instead of duplicating it
  const open = useCallback((key, type, extra) => {
    const z = ++zTop.current
    const slot = cascade.current++
    setWins((ws) =>
      ws.some((w) => w.key === key)
        ? ws.map((w) => (w.key === key ? { ...w, z, minimized: false } : w))
        : [...ws, { key, type, ...extra, z, slot, minimized: false }],
    )
  }, [])
  const focus = useCallback((key) => {
    const z = ++zTop.current
    setWins((ws) => ws.map((w) => (w.key === key ? { ...w, z } : w)))
  }, [])
  const close = useCallback((key) => setWins((ws) => ws.filter((w) => w.key !== key)), [])
  const minimize = useCallback(
    (key) => setWins((ws) => ws.map((w) => (w.key === key ? { ...w, minimized: true } : w))),
    [],
  )

  const openProject = useCallback((id) => open(`project:${id}`, 'project', { id }), [open])
  const openPanel = useCallback((type) => open(type, type), [open])

  const focusedKey = useMemo(() => {
    const visible = wins.filter((w) => !w.minimized)
    return visible.length ? visible.reduce((a, b) => (b.z > a.z ? b : a)).key : null
  }, [wins])

  // Dock clicks toggle like macOS: the front window minimises; a minimised or buried one comes forward
  const onDockSelect = (type) => (type === focusedKey ? minimize(type) : openPanel(type))

  // Esc closes the front window
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && focusedKey && close(focusedKey)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusedKey, close])

  const showToast = (msg) => {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }

  const renderWindow = (w) => {
    const win = {
      z: w.z,
      slot: w.slot,
      minimized: w.minimized,
      focused: w.key === focusedKey,
      mobile: !isDesktop,
      onClose: () => close(w.key),
      onFocus: () => focus(w.key),
      onMinimize: () => minimize(w.key),
    }
    switch (w.type) {
      case 'project':
        return <ProjectModal key={w.key} win={win} project={projects.find((p) => p.id === w.id)} />
      case 'about':
        return <AboutModal key={w.key} win={win} onOpen={openPanel} onOpenProject={openProject} />
      case 'projects':
        return <ProjectsExplorer key={w.key} win={win} onOpenProject={openProject} />
      case 'resume':
        return <ResumeModal key={w.key} win={win} />
      case 'contact':
        return <ContactModal key={w.key} win={win} onCopy={() => showToast('Email copied to clipboard')} />
      default:
        return SOCIALS.includes(w.type) ? <SocialModal key={w.key} win={win} network={w.type} /> : null
    }
  }

  // Phones get one sheet at a time: the front-most window
  const shown = isDesktop ? wins : wins.filter((w) => w.key === focusedKey)
  const openTypes = new Set(wins.map((w) => w.type))

  return (
    <>
      {isDesktop ? (
        <Canvas onOpenProject={openProject} onOpenPanel={openPanel} />
      ) : (
        <MobileFeed onOpenProject={openProject} />
      )}

      <AnimatePresence>{shown.map(renderWindow)}</AnimatePresence>

      <Dock openTypes={openTypes} onSelect={onDockSelect} compact={!isDesktop} />
      <Toast message={toast} />
      <Cursor />
    </>
  )
}
