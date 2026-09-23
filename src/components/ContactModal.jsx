import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Send } from 'lucide-react'
import Window from './Window'
import { profile } from '../data/profile'

export default function ContactModal({ win, onCopy }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fall back to a hidden textarea
      const t = document.createElement('textarea')
      t.value = profile.email
      document.body.appendChild(t)
      t.select()
      document.execCommand('copy')
      t.remove()
    }
    setCopied(true)
    onCopy()
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Window {...win} title="mail — new message" w={520} h={390} mono tone="terminal">
      <div className="p-6 font-mono text-[13px] @xl:p-8">
        <p className="text-white/40">
          <span className="text-emerald-400">ajay@vit</span>:~$ <span className="text-white">echo $EMAIL</span>
        </p>

        <button
          type="button"
          onClick={copy}
          className="group mt-4 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-white/25 hover:bg-white/10"
        >
          <span className="flex-1 truncate font-sans text-lg text-white @xl:text-xl">{profile.email}</span>
          <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white/80">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? 'y' : 'n'}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
              >
                {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>
        <p className="mt-2 text-[11px] text-white/35">click to copy</p>

        <a
          href={`mailto:${profile.email}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-sans text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
        >
          <Send className="h-3.5 w-3.5" /> Open mail app
        </a>
      </div>
    </Window>
  )
}
