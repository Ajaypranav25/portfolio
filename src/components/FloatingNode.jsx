import { useRef } from 'react'
import { motion } from 'framer-motion'
import Thumbnail from './Thumbnail'

export default function FloatingNode({ label, thumb, pos, index, constraintsRef, onOpen }) {
  const dragged = useRef(false)
  const duration = 5 + (index % 3) * 1.3

  return (
    <motion.div
      className="absolute z-10 -translate-x-1/2"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      dragElastic={0.12}
      onPointerDown={() => (dragged.current = false)}
      onDragStart={() => (dragged.current = true)}
      initial={{ opacity: 0, scale: 0.6, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay: 0.5 + index * 0.09, type: 'spring', stiffness: 180, damping: 18 }}
      whileDrag={{ scale: 1.08, zIndex: 30 }}
    >
      {/* continuous levitation lives on an inner layer so it never fights the drag transform */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
      >
        <motion.button
          type="button"
          onClick={() => !dragged.current && onOpen()}
          whileHover="hover"
          whileTap={{ scale: 0.94 }}
          className="group flex w-28 flex-col items-center gap-2 rounded-2xl p-2 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <motion.div
            variants={{ hover: { y: -3, scale: 1.06 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="relative"
          >
            {/* hover glow */}
            <div className="absolute -inset-3 rounded-2xl bg-white/0 blur-xl transition duration-300 group-hover:bg-white/25" />
            <div className="relative rounded-[10px] border border-white/15 bg-white/10 p-[3px] shadow-[0_10px_30px_-8px_rgba(0,0,0,.6)] backdrop-blur-md">
              <Thumbnail kind={thumb} className="h-10 w-16 rounded-[7px]" />
            </div>
          </motion.div>
          <span className="rounded-md px-1.5 py-0.5 text-[11px] font-medium tracking-wide text-white/85 [text-shadow:0_1px_8px_rgba(0,0,0,.8)] transition group-hover:bg-white/10 group-hover:text-white">
            {label}
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
