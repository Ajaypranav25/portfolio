import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function Toast({ message }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-5 z-[6000] flex justify-center" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-400/20">
              <Check className="h-3 w-3 text-emerald-300" />
            </span>
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
