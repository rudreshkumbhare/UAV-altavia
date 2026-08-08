import { motion } from 'framer-motion'
import {
  Wind,
  Bone,
  Radar,
  BrainCircuit,
  Eye,
  CircuitBoard,
  Code2,
  SatelliteDish,
} from 'lucide-react'
import { SectionEyebrow } from '../components/Telemetry'
import TiltCard from '../components/TiltCard'

const DOMAINS = [
  {
    code: 'AD-01',
    title: 'Aerodynamics',
    desc: 'Airframe geometry and lift modeling tuned for sustained autonomous flight envelopes.',
    icon: Wind,
  },
  {
    code: 'UD-02',
    title: 'UAV Design & Development',
    desc: 'From structural layout to material selection — airframes built for mission-specific payloads.',
    icon: Bone,
  },
  {
    code: 'FC-03',
    title: 'Flight Control Systems',
    desc: 'Redundant control loops and stability augmentation for craft that fly without a hand on the stick.',
    icon: Radar,
  },
  {
    code: 'AI-04',
    title: 'Artificial Intelligence',
    desc: 'Decision systems for autonomous navigation, obstacle response, and mission adaptation.',
    icon: BrainCircuit,
  },
  {
    code: 'CV-05',
    title: 'Computer Vision',
    desc: 'Real-time perception pipelines for terrain mapping, tracking, and object recognition.',
    icon: Eye,
  },
  {
    code: 'ES-06',
    title: 'Embedded Systems',
    desc: 'Low-latency firmware running on constrained hardware, built for flight-critical reliability.',
    icon: CircuitBoard,
  },
  {
    code: 'SE-07',
    title: 'Software Engineering',
    desc: 'Ground control software, telemetry pipelines, and mission planning tooling.',
    icon: Code2,
  },
  {
    code: 'CN-08',
    title: 'Communication & Navigation',
    desc: 'Long-range link systems and positioning stacks for beyond-visual-line-of-sight operation.',
    icon: SatelliteDish,
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const card = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function Domains() {
  return (
    <section id="domains" className="relative py-28 md:py-36 border-t border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionEyebrow index="03" label="Core Engineering Domains" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-medium max-w-xl leading-tight">
            Eight disciplines.
            <br />
            One airframe.
          </h2>
          <p className="text-paper-dim max-w-sm text-sm leading-relaxed">
            Every ALTAVIA platform is the product of these disciplines working
            in the same loop — not in sequence, but simultaneously.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line"
        >
          {DOMAINS.map((d) => {
            const Icon = d.icon
            return (
              <motion.div key={d.code} variants={card} className="h-full">
                <TiltCard className="h-full hud-frame group bg-graphite p-7 flex flex-col gap-5 hover:bg-surface transition-colors duration-300">
                  <div className="flex items-start justify-between">
                    <Icon
                      className="w-6 h-6 text-amber group-hover:scale-110 transition-transform duration-300"
                      strokeWidth={1.5}
                    />
                    <span className="mono-label text-[10px] text-paper-dim">{d.code}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-medium mb-2">{d.title}</h3>
                    <p className="text-sm text-paper-dim leading-relaxed">{d.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
