import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionEyebrow } from '../components/Telemetry'

// Sample N points along a quadratic bezier so we can animate a marker
// smoothly along the curve without extra plugins/deps.
function sampleQuadratic(p0, p1, p2, steps = 60) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0]
    const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1]
    pts.push([x, y])
  }
  return pts
}

const ROUTES = [
  {
    id: 'talon',
    label: 'TALON-X / RECON LOOP',
    color: 'var(--color-amber)',
    p0: [70, 300],
    p1: [340, 60],
    p2: [560, 260],
    duration: 6,
  },
  {
    id: 'halcyon',
    label: 'HALCYON / HIGH TRANSIT',
    color: 'var(--color-cyan)',
    p0: [40, 120],
    p1: [420, 340],
    p2: [800, 90],
    duration: 9,
  },
  {
    id: 'vireo',
    label: 'VIREO / MESH SWEEP',
    color: 'var(--color-paper)',
    p0: [640, 320],
    p1: [500, 150],
    p2: [830, 60],
    duration: 5,
  },
]

function toPathD(p0, p1, p2) {
  return `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`
}

function RouteMarker({ route }) {
  const points = useMemo(() => sampleQuadratic(route.p0, route.p1, route.p2), [route])
  const cx = points.map((p) => p[0])
  const cy = points.map((p) => p[1])

  return (
    <motion.circle
      r={5}
      fill={route.color}
      animate={{ cx, cy }}
      transition={{ duration: route.duration, repeat: Infinity, ease: 'linear' }}
    />
  )
}

export default function Gallery() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="gallery" className="relative py-28 md:py-36 border-t border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionEyebrow index="07" label="Gallery — Live Flight Paths" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-medium max-w-xl leading-tight">
            Three routes.
            <br />
            Running right now.
          </h2>
          <p className="text-paper-dim max-w-sm text-sm leading-relaxed">
            A simulated telemetry feed — each line is a route flown by one of
            our platforms, looping continuously.
          </p>
        </div>

        <div className="hud-frame relative border border-line bg-surface p-4 md:p-8 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #e8e6de 1px, transparent 1px), linear-gradient(to bottom, #e8e6de 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <svg viewBox="0 0 900 400" className="w-full h-auto relative z-10" role="img" aria-label="Animated flight path map">
            <circle cx="450" cy="200" r="180" fill="none" stroke="var(--color-line)" strokeWidth="1" opacity="0.5" />
            <circle cx="450" cy="200" r="120" fill="none" stroke="var(--color-line)" strokeWidth="1" opacity="0.4" />
            <circle cx="450" cy="200" r="60" fill="none" stroke="var(--color-line)" strokeWidth="1" opacity="0.3" />

            {ROUTES.map((r, i) => (
              <g
                key={r.id}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                <path d={toPathD(r.p0, r.p1, r.p2)} fill="none" stroke={r.color} strokeWidth="1" opacity="0.15" />
                <motion.path
                  d={toPathD(r.p0, r.p1, r.p2)}
                  fill="none"
                  stroke={r.color}
                  strokeWidth={hovered === r.id ? 2.5 : 1.5}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: hovered && hovered !== r.id ? 0.3 : 0.9 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: i * 0.25, ease: [0.16, 1, 0.3, 1] }}
                />
                <RouteMarker route={r} />
                <circle cx={r.p0[0]} cy={r.p0[1]} r={3} fill={r.color} opacity="0.6" />
                <circle cx={r.p2[0]} cy={r.p2[1]} r={3} fill={r.color} opacity="0.6" />
              </g>
            ))}
          </svg>

          <div className="relative z-10 flex flex-wrap gap-x-8 gap-y-3 mt-6 pt-6 border-t border-line">
            {ROUTES.map((r) => (
              <button
                key={r.id}
                onMouseEnter={() => setHovered(r.id)}
                onMouseLeave={() => setHovered(null)}
                className="flex items-center gap-2 group"
              >
                <span
                  className="w-2 h-2 rounded-full transition-transform group-hover:scale-125"
                  style={{ backgroundColor: r.color }}
                />
                <span className="mono-label text-[10px] text-paper-dim group-hover:text-paper transition-colors">
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
