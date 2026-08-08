import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SectionEyebrow } from '../components/Telemetry'

const STEPS = [
  { n: '01', label: 'Concept', desc: 'Mission profile defined. Constraints, payload, and operating envelope locked before a single line is drawn.' },
  { n: '02', label: 'Design', desc: 'Airframe geometry, systems architecture, and structural layout developed in parallel.' },
  { n: '03', label: 'Simulation', desc: 'CFD, structural load, and flight-control models run thousands of cycles before any hardware exists.' },
  { n: '04', label: 'Manufacturing', desc: 'Composite layup, precision machining, and systems integration under controlled tolerances.' },
  { n: '05', label: 'Flight Testing', desc: 'Instrumented test flights validate the model against reality, envelope expansion in stages.' },
  { n: '06', label: 'Deployment', desc: 'Delivered, commissioned, and supported in the field for the duration of its service life.' },
]

export default function Workflow() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.75', 'end 0.4'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="workflow" className="relative py-28 md:py-36 border-t border-line overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionEyebrow index="05" label="Engineering Workflow" />
        <h2 className="font-display text-4xl md:text-5xl font-medium max-w-xl leading-tight mb-16">
          Concept to deployment.
          <br />
          No step skipped.
        </h2>

        <div className="hud-frame relative border border-line bg-graphite hover:bg-surface transition-colors duration-300 backdrop-blur-md p-6 md:p-12 overflow-hidden rounded-lg">
          <div ref={ref} className="relative z-20 max-w-3xl">
            {/* track */}
            <div className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-line" />
            <motion.div
              style={{ height: lineHeight }}
              className="absolute left-[15px] md:left-[19px] top-2 w-px bg-amber"
            />

            <div className="flex flex-col gap-14">
              {STEPS.map((s, i) => (
                <StepRow key={s.n} step={s} index={i} total={STEPS.length} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StepRow({ step, index, total }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.5'],
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1])
  const x = useTransform(scrollYProgress, [0, 1], [-8, 0])

  return (
    <motion.div ref={ref} style={{ opacity, x }} className="relative flex gap-6 md:gap-8 pl-0">
      <div className="relative z-10 shrink-0">
        <motion.div
          style={{ opacity }}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-amber bg-graphite flex items-center justify-center mono-label text-[10px] text-amber"
        >
          {step.n}
        </motion.div>
      </div>
      <div className="pt-1 md:pt-2">
        <h3 className="font-display text-2xl md:text-3xl font-medium mb-2">{step.label}</h3>
        <p className="text-paper-dim leading-relaxed max-w-md">{step.desc}</p>
      </div>
    </motion.div>
  )
}
