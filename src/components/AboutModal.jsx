import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Window from './Window'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { COMMANDS, OPEN_TARGETS } from './terminalCommands'

const lines = {
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}
const line = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
}

function PromptLabel() {
  return (
    <>
      <span className="text-emerald-400">ajay@vit</span>
      <span className="text-white/40">:</span>
      <span className="text-sky-300">~</span>
      <span className="text-white/40">$ </span>
    </>
  )
}

function Prompt({ children, animated = true }) {
  const Tag = animated ? motion.div : 'div'
  return (
    <Tag {...(animated && { variants: line })} className="mt-5 whitespace-pre-wrap break-all first:mt-0">
      <PromptLabel />
      <span className="text-white">{children}</span>
    </Tag>
  )
}

// The original intro, replayed as the terminal's boot screen
function Boot() {
  return (
    <motion.div variants={lines} initial="hidden" animate="visible">
      <Prompt>whoami</Prompt>
      <motion.p variants={line} className="mt-1 font-serif text-4xl italic tracking-tight text-white @xl:text-5xl">
        {profile.name}
      </motion.p>

      <Prompt>cat education.txt</Prompt>
      <motion.p variants={line} className="mt-1">
        {profile.education.degree}
        <br />
        <span className="text-white/50">
          {profile.education.school} · {profile.education.years}
        </span>
      </motion.p>

      <Prompt>ls ./focus</Prompt>
      <motion.ul variants={line} className="mt-1 grid gap-x-6 @xl:grid-cols-2">
        {profile.focus.map((f) => (
          <li key={f}>
            <span className="text-white/30">→ </span>
            {f}
          </li>
        ))}
      </motion.ul>

      <Prompt>echo $SKILLS</Prompt>
      <motion.div variants={line} className="mt-2 flex flex-wrap gap-1.5">
        {profile.skills.map((s) => (
          <span key={s} className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/85">
            {s}
          </span>
        ))}
      </motion.div>

      <motion.p variants={line} className="mt-5 text-white/40">
        Type <span className="text-sky-300">help</span> to see what else this terminal can do.
      </motion.p>
    </motion.div>
  )
}

// Tab completion: command names first, then arguments for commands that take one
function complete(value) {
  const parts = value.split(/\s+/)
  if (parts.length === 1) {
    const hits = Object.keys(COMMANDS).filter((c) => !COMMANDS[c].hidden && c.startsWith(parts[0].toLowerCase()))
    return { hits, apply: (h) => `${h} ` }
  }
  const [cmd, ...rest] = parts
  const arg = rest.join(' ').toLowerCase()
  const pool =
    cmd === 'open' ? [...OPEN_TARGETS, ...projects.map((p) => p.id)]
    : ['project', 'cat'].includes(cmd) ? projects.map((p) => p.id)
    : cmd === 'ls' ? ['projects/']
    : cmd === 'resume' ? ['--download']
    : []
  const hits = pool.filter((t) => t.startsWith(arg))
  return { hits, apply: (h) => `${cmd} ${h}` }
}

function Terminal({ onOpen, onOpenProject, onExit }) {
  const [entries, setEntries] = useState([{ id: 0, boot: true }])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [cursor, setCursor] = useState(null) // index into history while browsing with ↑/↓
  const nextId = useRef(1)
  const inputRef = useRef(null)
  const rootRef = useRef(null)

  const push = (entry) => setEntries((es) => [...es, { id: nextId.current++, ...entry }])

  // Keep the prompt in view as output grows
  useEffect(() => {
    const scroller = rootRef.current?.closest('.overflow-y-auto')
    if (scroller) scroller.scrollTop = scroller.scrollHeight
  }, [entries])

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 500)
    return () => clearTimeout(t)
  }, [])

  const copy = (text) => navigator.clipboard?.writeText(text).catch(() => {})

  const run = (raw) => {
    const input = raw.trim()
    setValue('')
    setCursor(null)
    if (!input) return push({ cmd: '' })

    const nextHistory = [...history, input]
    setHistory(nextHistory)
    const [name, ...args] = input.split(/\s+/)
    const key = name.toLowerCase()

    if (key === 'clear') return setEntries([])
    const command = COMMANDS[key]
    const out = command ? (
      command.run({ args, open: onOpen, openProject: onOpenProject, exit: onExit, history: nextHistory, copy })
    ) : (
      <p>
        zsh: command not found: {name}. <span className="text-white/40">Type </span>
        <span className="text-sky-300">help</span>
        <span className="text-white/40"> for a list of commands.</span>
      </p>
    )
    push({ cmd: input, out })
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      run(value)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (!history.length) return
      e.preventDefault()
      const up = e.key === 'ArrowUp'
      const i = cursor === null ? (up ? history.length - 1 : null) : cursor + (up ? -1 : 1)
      if (i === null || i >= history.length) {
        setCursor(null)
        setValue('')
      } else {
        const clamped = Math.max(0, i)
        setCursor(clamped)
        setValue(history[clamped])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const { hits, apply } = complete(value)
      if (hits.length === 1) setValue(apply(hits[0]))
      else if (hits.length > 1) push({ cmd: value, out: <p className="text-white/60">{hits.join('   ')}</p> })
    } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
      e.preventDefault()
      setEntries([])
    } else if (e.key.toLowerCase() === 'c' && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault()
      push({ cmd: `${value}^C` })
      setValue('')
    }
  }

  // Clicking anywhere focuses the prompt, unless the user is selecting text
  const focusInput = () => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <div ref={rootRef} onMouseUp={focusInput} className="min-h-full p-6 font-mono text-[13px] leading-relaxed text-white/80 @xl:p-8">
      {entries.map((entry) =>
        entry.boot ? (
          <Boot key={entry.id} />
        ) : (
          <div key={entry.id} className="mt-5 first:mt-0">
            <Prompt animated={false}>{entry.cmd}</Prompt>
            {entry.out && <div className="mt-1">{entry.out}</div>}
          </div>
        ),
      )}

      <label className="mt-5 flex items-center first:mt-0">
        <span className="shrink-0 whitespace-pre">
          <PromptLabel />
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setCursor(null)
          }}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal input"
          className="min-w-0 flex-1 bg-transparent text-white caret-emerald-300 outline-none"
        />
      </label>
    </div>
  )
}

export default function AboutModal({ win, onOpen, onOpenProject }) {
  return (
    <Window {...win} title="ajay — zsh — 80×24" w={660} h={500} mono tone="terminal">
      <Terminal onOpen={onOpen} onOpenProject={onOpenProject} onExit={win.onClose} />
    </Window>
  )
}
