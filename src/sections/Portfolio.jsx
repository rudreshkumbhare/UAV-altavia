import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionEyebrow } from '../components/Telemetry'
import DroneViewport from '../components/DroneViewport'

const CRAFT = [
  {
    id: 'talon',
    name: 'TALON-X',
    class: 'Reconnaissance UAV',
    wingspan: '3.4 m',
    range: '480 km',
    ceiling: '18,000 ft',
    endurance: '14 hrs',
    desc: 'A long-endurance surveillance platform built for persistent overwatch in contested terrain. Carbon airframe, modular sensor bay, and a signature so quiet it reads as background noise on most radar.',
  },
  {
    id: 'kestrel',
    name: 'KESTREL-2',
    class: 'Rapid-Deploy Scout',
    wingspan: '1.1 m',
    range: '40 km',
    ceiling: '6,000 ft',
    endurance: '55 min',
    desc: 'Field-deployable in under two minutes. Built for units that need eyes overhead now, not after a checklist — foldable wings, tool-less battery swap, encrypted link out of the box.',
  },
  {
    id: 'halcyon',
    name: 'HALCYON HAE',
    class: 'High-Altitude Endurance',
    wingspan: '9.2 m',
    range: '2,100 km',
    ceiling: '52,000 ft',
    endurance: '30+ hrs',
    desc: 'Solar-augmented endurance platform designed to loiter above weather systems for days at a time — atmospheric research, disaster monitoring, and communications relay in one airframe.',
  },
  {
    id: 'vireo',
    name: 'VIREO SWARM',
    class: 'Coordinated Micro-UAV',
    wingspan: '0.4 m',
    range: '8 km',
    ceiling: '1,500 ft',
    endurance: '22 min',
    desc: 'Not a single aircraft — a coordinated fleet. Vireo units fly as a distributed mesh, sharing sensor data in real time to cover ground no single platform could alone.',
  },
]

function Stat({ label, value }) {
  return (
    <div>
      <div className="mono-label text-[10px] text-paper-dim mb-1">{label}</div>
      <div className="font-display text-lg">{value}</div>
    </div>
  )
}

export default function Portfolio() {
  const [active, setActive] = useState(CRAFT[0].id)
  const current = CRAFT.find((c) => c.id === active)

  return (
    <section id="portfolio" className="relative py-28 md:py-36 border-t border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionEyebrow index="04" label="Aircraft & UAV Portfolio" />

        <h2 className="font-display text-4xl md:text-5xl font-medium max-w-xl leading-tight mb-16">
          Four platforms.
          <br />
          Every mission profile.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          {/* selector list */}
          <div className="relative">
            <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-graphite to-transparent lg:hidden" />
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {CRAFT.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`text-left px-5 py-4 border transition-colors duration-300 whitespace-nowrap lg:whitespace-normal shrink-0 ${
                    active === c.id
                      ? 'border-amber bg-surface'
                      : 'border-line bg-graphite hover:bg-surface hover:border-paper-dim'
                  }`}
                >
                  <div className="mono-label text-[10px] text-paper-dim mb-1">{c.class}</div>
                  <div className="font-display text-base font-medium">{c.name}</div>
                </button>
              ))}
            </div>
            <div className="mono-label text-[10px] text-paper-dim mt-2 lg:hidden">← Swipe for all four platforms →</div>
          </div>

          {/* detail panel */}
          <div className="hud-frame border border-line bg-graphite hover:bg-surface transition-colors duration-300 p-8 md:p-12 min-h-[420px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-10"
              >
                <div>
                  <div className="mono-label text-xs text-amber mb-3">{current.class}</div>
                  <h3 className="font-display text-3xl md:text-4xl font-medium mb-6">
                    {current.name}
                  </h3>
                  <p className="text-paper-dim leading-relaxed max-w-lg mb-10">{current.desc}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-line">
                    <Stat label="Wingspan" value={current.wingspan} />
                    <Stat label="Range" value={current.range} />
                    <Stat label="Ceiling" value={current.ceiling} />
                    <Stat label="Endurance" value={current.endurance} />
                  </div>
                </div>

                <DroneViewport craftId={current.id} craftName={current.name} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
