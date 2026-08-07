import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { SectionEyebrow } from '../components/Telemetry'

// Abstract generated tiles instead of external stock photography —
// keeps the aesthetic consistent and removes any external asset dependency.
const TILES = [
  { id: 1, label: 'TALON-X / FIELD TEST', tone: 'amber', span: 'lg:col-span-2 lg:row-span-2' },
  { id: 2, label: 'WIND TUNNEL / RUN 14', tone: 'cyan', span: '' },
  { id: 3, label: 'HALCYON / HIGH ALT', tone: 'line', span: '' },
  { id: 4, label: 'GROUND CONTROL', tone: 'cyan', span: '' },
  { id: 5, label: 'VIREO SWARM / MESH', tone: 'amber', span: 'lg:col-span-2' },
  { id: 6, label: 'COMPOSITE LAYUP', tone: 'line', span: '' },
]

function TilePattern({ tone }) {
  const color = tone === 'amber' ? 'var(--color-amber)' : tone === 'cyan' ? 'var(--color-cyan)' : 'var(--color-line)'
  return (
    <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none">
      <defs>
        <pattern id={`grid-${tone}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke={color} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${tone})`} />
      <circle cx="30%" cy="40%" r="60" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      <circle cx="70%" cy="65%" r="30" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

export default function Gallery() {
  const [active, setActive] = useState(null)

  return (
    <section id="gallery" className="relative py-28 md:py-36 border-t border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionEyebrow index="07" label="Gallery" />
        <h2 className="font-display text-4xl md:text-5xl font-medium max-w-xl leading-tight mb-16">
          From wind tunnel
          <br />
          to open sky.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[200px] gap-4">
          {TILES.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActive(t)}
              className={`hud-frame relative overflow-hidden bg-surface border border-line min-h-[180px] text-left group ${t.span}`}
            >
              <TilePattern tone={t.tone} />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="mono-label text-[10px] text-paper-dim group-hover:text-amber transition-colors">
                  {t.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] bg-graphite/95 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl aspect-video bg-surface border border-line overflow-hidden"
            >
              <TilePattern tone={active.tone} />
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 p-2 border border-line hover:border-amber transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-6 left-6">
                <span className="mono-label text-xs text-amber">{active.label}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
