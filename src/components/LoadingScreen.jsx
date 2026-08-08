import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINES = [
  'INITIALIZING FLIGHT SYSTEMS',
  'CALIBRATING SENSOR ARRAY',
  'LINKING TELEMETRY FEED',
  'SYSTEMS ONLINE',
]

export default function LoadingScreen({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const lineTimer = setInterval(() => {
      setLineIndex((i) => Math.min(i + 1, LINES.length - 1))
    }, 380)

    const doneTimer = setTimeout(() => {
      document.body.style.overflow = prevOverflow
      onComplete()
    }, 1900)

    return () => {
      clearInterval(lineTimer)
      clearTimeout(doneTimer)
      document.body.style.overflow = prevOverflow
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9998] bg-graphite flex items-center justify-center"
    >
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #e8e6de 1px, transparent 1px), linear-gradient(to bottom, #e8e6de 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-amber rounded-full animate-pulse" />
          <span className="font-display font-semibold tracking-wide text-2xl sm:text-3xl">ALTAVIA</span>
        </div>

        <div className="w-80 sm:w-[26rem] h-1.5 bg-line overflow-hidden rounded-full">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left' }}
            className="h-full bg-amber rounded-full"
          />
        </div>

        <div className="h-5">
          <motion.span
            key={lineIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mono-label text-xs text-paper-dim"
          >
            {LINES[lineIndex]}
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}
