import { motion } from 'framer-motion'
import { SectionEyebrow } from '../components/Telemetry'
import TiltCard from '../components/TiltCard'

const TEAM = [
  { name: 'Mayur', role: 'Flight Control Systems', code: 'FC' },
  { name: 'Soumil', role: 'Aerodynamics Lead', code: 'AD' },
  { name: 'Sharvari', role: 'Computer Vision', code: 'CV' },
  { name: 'Samiksha', role: 'Embedded Systems', code: 'ES' },
  { name: 'Prachi', role: 'UAV Structural Design', code: 'UD' },
  { name: 'Rudresh', role: 'Comms & Navigation', code: 'CN' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function Team() {
  return (
    <section id="team" className="relative py-28 md:py-36 border-t border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionEyebrow index="06" label="Team" />
        <h2 className="font-display text-4xl md:text-5xl font-medium max-w-xl leading-tight mb-16">
          The people
          <br />
          behind the airframe.
        </h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line"
        >
          {TEAM.map((t) => (
            <motion.div key={t.name} variants={item} className="h-full">
              <TiltCard className="h-full hud-frame group bg-graphite p-8 flex flex-col gap-6 hover:bg-surface transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-full border border-line flex items-center justify-center font-display text-lg group-hover:border-amber transition-colors">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span className="mono-label text-[10px] text-paper-dim">{t.code}</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium mb-1">{t.name}</h3>
                  <p className="text-sm text-paper-dim">{t.role}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
