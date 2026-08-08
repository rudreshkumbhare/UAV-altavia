import { motion } from 'framer-motion'
import { SectionEyebrow, CoordTag } from '../components/Telemetry'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-36 border-t border-line overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #e8e6de 1px, transparent 1px), linear-gradient(to bottom, #e8e6de 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <SectionEyebrow index="02" label="About Altavia" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="lg:col-span-7"
          >
            <h2 className="font-display text-4xl md:text-5xl font-medium leading-tight mb-8">
              We build for the airspace
              <br />
              between the ground
              <br />
              <span className="text-amber">and orbit.</span>
            </h2>
            <p className="text-paper-dim text-base md:text-lg leading-relaxed max-w-xl mb-6">
              ALTAVIA is an aerospace engineering studio focused entirely on
              unmanned and autonomous flight. We don't build aircraft that need
              a pilot on board — we build the ones that don't.
            </p>
            <p className="text-paper-dim text-base md:text-lg leading-relaxed max-w-xl">
              From reconnaissance platforms flying quiet overwatch to
              high-altitude craft that loiter above weather systems for days,
              every airframe we ship carries the same engineering discipline:
              simulate before you build, test before you trust.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-5 flex flex-col gap-px bg-line border border-line"
          >
            <div className="hud-frame bg-graphite p-8">
              <div className="mono-label text-xs text-amber mb-3">Mission</div>
              <p className="text-paper leading-relaxed">
                Extend human reach into airspace too dangerous, too remote, or
                too repetitive for a crewed aircraft to justify.
              </p>
            </div>
            <div className="hud-frame bg-graphite p-8">
              <div className="mono-label text-xs text-cyan mb-3">Vision</div>
              <p className="text-paper leading-relaxed">
                A future where autonomous flight is boring — reliable enough
                that nobody thinks twice about what's flying overhead.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.25 }}
          className="mt-20 pt-10 border-t border-line grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <CoordTag label="FOUNDED" value="2019" />
          <CoordTag label="AIRFRAMES" value="14 IN SERVICE" />
          <CoordTag label="FLIGHT HRS" value="42,000+" />
          <CoordTag label="STATUS" value="OPERATIONAL" />
        </motion.div>
      </div>
    </section>
  )
}
