import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionEyebrow } from '../components/Telemetry'

function sampleQuadraticDetailed(p0, p1, p2, steps = 100) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0]
    const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1]
    pts.push({ x, y, t })
  }
  return pts
}

const ROUTES = [
  {
    id: 'talon',
    name: 'TALON-X',
    label: 'TALON-X / RECON LOOP',
    type: 'AUTONOMOUS RECONNAISSANCE',
    color: 'var(--color-amber)',
    hexColor: '#ff8c3d',
    p0: [70, 300],
    p1: [340, 60],
    p2: [560, 260],
    duration: 6,
    alt: '18,400 FT',
    spd: '240 KTS',
    origin: 'DEP: BASE ALPHA',
    target: 'ARR: ZONE DELTA',
    signal: '99.8% LINK OK',
    heading: '042° NE',
  },
  {
    id: 'halcyon',
    name: 'HALCYON',
    label: 'HALCYON / HIGH TRANSIT',
    type: 'HIGH-ALTITUDE LOITER',
    color: 'var(--color-cyan)',
    hexColor: '#3fb8af',
    p0: [40, 120],
    p1: [420, 340],
    p2: [800, 90],
    duration: 9,
    alt: '42,000 FT',
    spd: '195 KTS',
    origin: 'DEP: SECTOR 4',
    target: 'ARR: GRID BRAVO',
    signal: '100% SATELLITE LINK',
    heading: '118° SE',
  },
  {
    id: 'vireo',
    name: 'VIREO',
    label: 'VIREO / MESH SWEEP',
    type: 'SWARM MESH MAPPING',
    color: 'var(--color-paper)',
    hexColor: '#e8e6de',
    p0: [640, 320],
    p1: [500, 150],
    p2: [830, 60],
    duration: 5,
    alt: '8,200 FT',
    spd: '310 KTS',
    origin: 'DEP: HUB WEST',
    target: 'ARR: NODE ECHO',
    signal: '98.4% MESH ACTIVE',
    heading: '305° NW',
  },
]

function toPathD(p0, p1, p2) {
  return `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`
}

function AnimatedFlightCraft({ route, isHovered, isDimmed }) {
  const samples = useMemo(
    () => sampleQuadraticDetailed(route.p0, route.p1, route.p2, 100),
    [route]
  )

  const cx = samples.map((s) => s.x)
  const cy = samples.map((s) => s.y)

  // Sub-sampled trail points for sleek comet tail
  const trail1 = samples.map((_, i) => samples[Math.max(0, i - 4)])
  const trail2 = samples.map((_, i) => samples[Math.max(0, i - 8)])

  return (
    <g className={`transition-opacity duration-300 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}>
      {/* Base Flight Path Line */}
      <path
        d={toPathD(route.p0, route.p1, route.p2)}
        fill="none"
        stroke={route.color}
        strokeWidth={isHovered ? 2.5 : 1}
        opacity={isHovered ? 0.4 : 0.15}
      />

      {/* Flowing Trajectory Dash Animation */}
      <motion.path
        d={toPathD(route.p0, route.p1, route.p2)}
        fill="none"
        stroke={route.color}
        strokeWidth={isHovered ? 2.5 : 1.5}
        strokeDasharray="6 8"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -28 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        opacity={isHovered ? 1 : 0.6}
      />

      {/* Comet Trail Dot 2 */}
      <motion.circle
        r={2}
        fill={route.color}
        opacity={0.3}
        animate={{ cx: trail2.map((t) => t.x), cy: trail2.map((t) => t.y) }}
        transition={{ duration: route.duration, repeat: Infinity, ease: 'linear' }}
      />

      {/* Comet Trail Dot 1 */}
      <motion.circle
        r={3}
        fill={route.color}
        opacity={0.6}
        animate={{ cx: trail1.map((t) => t.x), cy: trail1.map((t) => t.y) }}
        transition={{ duration: route.duration, repeat: Infinity, ease: 'linear' }}
      />

      {/* Pulsing Radar Ring around Aircraft */}
      <motion.circle
        fill="none"
        stroke={route.color}
        strokeWidth={1}
        animate={{
          cx,
          cy,
          r: [4, 16, 4],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{ duration: route.duration, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main Craft Marker */}
      <motion.circle
        r={isHovered ? 6 : 5}
        fill={route.color}
        animate={{ cx, cy }}
        transition={{ duration: route.duration, repeat: Infinity, ease: 'linear' }}
      />

      {/* Waypoint Departure Crosshair */}
      <g transform={`translate(${route.p0[0]}, ${route.p0[1]})`}>
        <circle r={4} fill="none" stroke={route.color} strokeWidth={1} opacity={0.8} />
        <circle r={1.5} fill={route.color} opacity={0.9} />
        <line x1={-6} y1={0} x2={6} y2={0} stroke={route.color} strokeWidth={0.6} opacity={0.5} />
        <line x1={0} y1={-6} x2={0} y2={6} stroke={route.color} strokeWidth={0.6} opacity={0.5} />
        <text x={8} y={3} fill="var(--color-paper-dim)" fontSize="7" fontFamily="monospace">
          {route.origin}
        </text>
      </g>

      {/* Waypoint Arrival Crosshair */}
      <g transform={`translate(${route.p2[0]}, ${route.p2[1]})`}>
        <circle r={4} fill="none" stroke={route.color} strokeWidth={1} opacity={0.8} />
        <circle r={1.5} fill={route.color} opacity={0.9} />
        <line x1={-6} y1={0} x2={6} y2={0} stroke={route.color} strokeWidth={0.6} opacity={0.5} />
        <line x1={0} y1={-6} x2={0} y2={6} stroke={route.color} strokeWidth={0.6} opacity={0.5} />
        <text x={8} y={3} fill="var(--color-paper-dim)" fontSize="7" fontFamily="monospace">
          {route.target}
        </text>
      </g>
    </g>
  )
}

export default function Gallery() {
  const [activeRoute, setActiveRoute] = useState('talon')
  const activeData = ROUTES.find((r) => r.id === activeRoute) || ROUTES[0]

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
            A simulated telemetry feed — select any platform to inspect active airspace vectors,
            altitude, and airspeed metrics.
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

          {/* SVG Tactical Radar Display */}
          <div className="relative -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto md:overflow-visible">
            <div className="pointer-events-none absolute left-4 top-0 bottom-0 w-8 bg-gradient-to-r from-surface to-transparent md:hidden" />
            <div className="pointer-events-none absolute right-4 top-0 bottom-0 w-8 bg-gradient-to-l from-surface to-transparent md:hidden" />
            <svg
              viewBox="0 0 900 400"
              className="h-[280px] w-auto min-w-[640px] md:h-auto md:w-full md:min-w-0 relative z-10"
              role="img"
              aria-label="Animated flight path map"
            >
              {/* Tactical Radar Background Rings */}
              <circle cx="450" cy="200" r="180" fill="none" stroke="var(--color-line)" strokeWidth="1" opacity="0.5" />
              <circle cx="450" cy="200" r="120" fill="none" stroke="var(--color-line)" strokeWidth="1" opacity="0.4" />
              <circle cx="450" cy="200" r="60" fill="none" stroke="var(--color-line)" strokeWidth="1" opacity="0.3" />

              {/* Radar Crosshairs */}
              <line x1="270" y1="200" x2="630" y2="200" stroke="var(--color-line)" strokeWidth="0.8" opacity="0.3" />
              <line x1="450" y1="20" x2="450" y2="380" stroke="var(--color-line)" strokeWidth="0.8" opacity="0.3" />

              {/* Central Rotating Radar Sweep Beam */}
              <g transform="translate(450, 200)">
                <motion.line
                  x1="0"
                  y1="0"
                  x2="180"
                  y2="0"
                  stroke="var(--color-amber)"
                  strokeWidth="1.2"
                  opacity="0.25"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                />
              </g>

              {/* Render Animated Flight Craft & Telemetry for each Route */}
              {ROUTES.map((r) => (
                <g
                  key={r.id}
                  data-cursor="hover"
                  onClick={() => setActiveRoute(r.id)}
                  onMouseEnter={() => setActiveRoute(r.id)}
                >
                  <AnimatedFlightCraft
                    route={r}
                    isHovered={activeRoute === r.id}
                    isDimmed={activeRoute !== r.id}
                  />
                </g>
              ))}
            </svg>
          </div>

          <div className="mono-label text-[10px] text-paper-dim mt-3 md:hidden">← Swipe to explore full flight map →</div>

          {/* Interactive Route Selection Tabs */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-line">
            {ROUTES.map((r) => {
              const selected = activeRoute === r.id
              return (
                <button
                  key={r.id}
                  data-cursor="hover"
                  onClick={() => setActiveRoute(r.id)}
                  onMouseEnter={() => setActiveRoute(r.id)}
                  className={`p-4 border text-left transition-all duration-300 flex flex-col justify-between gap-3 ${
                    selected
                      ? 'border-amber bg-graphite'
                      : 'border-line/60 bg-surface/50 hover:border-line hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full transition-transform"
                        style={{ backgroundColor: r.color }}
                      />
                      <span className="mono-label text-xs font-semibold tracking-wider text-paper">
                        {r.name}
                      </span>
                    </div>
                    <span className="mono-label text-[9px] text-paper-dim">
                      {selected ? 'SELECTED' : 'SELECT'}
                    </span>
                  </div>

                  <div className="mono-label text-[10px] text-paper-dim flex justify-between">
                    <span>{r.spd}</span>
                    <span>{r.alt}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detailed Active Route Telemetry HUD Console */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeData.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-4 p-4 border border-line/60 bg-graphite flex flex-wrap items-center justify-between gap-4 mono-label text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: activeData.color }} />
                <span className="text-paper font-medium">{activeData.label}</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-paper-dim">
                <div>MODE: <span className="text-paper">{activeData.type}</span></div>
                <div>SPD: <span className="text-amber">{activeData.spd}</span></div>
                <div>ALT: <span className="text-cyan">{activeData.alt}</span></div>
                <div>HDG: <span className="text-paper">{activeData.heading}</span></div>
                <div>LINK: <span className="text-amber">{activeData.signal}</span></div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}


