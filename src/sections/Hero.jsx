import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { CoordTag } from '../components/Telemetry'
import MagneticButton from '../components/MagneticButton'
import GradientShimmer from '../components/ui/gradient-shimmer'
import { DecryptText } from '../components/ui/decrypt-text'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export default function Hero() {
  const ref = useRef(null)
  const [decrypted, setDecrypted] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  return (
    <section ref={ref} id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-graphite pointer-events-none" />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 w-full text-center flex flex-col items-center justify-center">
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center max-w-3xl">
          <motion.div variants={item} className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
            <span className="mono-label text-xs text-amber">Systems Online</span>
          </motion.div>

          <motion.div variants={item} className="text-center">
            {decrypted ? (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.05] font-medium tracking-tight text-center"
              >
                <GradientShimmer
                  gradient="sunrise"
                  duration={1.8}
                  delay={0.1}
                  spread={4}
                  angle={105}
                  pauseBetween={3500}
                  baseColor="var(--color-paper)"
                >
                  Engineering the aircraft no one has flown.
                </GradientShimmer>
              </motion.h1>
            ) : (
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.05] font-medium tracking-tight text-center text-paper">
                <DecryptText
                  as="span"
                  text="Engineering the aircraft no one has flown."
                  variant="display"
                  trigger="mount"
                  speed={35}
                  stagger={25}
                  startDelay={200}
                  loop={false}
                  retriggerOnHover={false}
                  onDecrypted={() => setDecrypted(true)}
                  className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.05] font-medium tracking-tight text-center text-paper"
                />
              </h1>
            )}
          </motion.div>

          <motion.p variants={item} className="mt-6 text-paper-dim text-base md:text-lg max-w-lg leading-relaxed text-center">
            ALTAVIA designs autonomous flight systems — from airframe to flight
            control — for the environments where piloted aircraft can't go.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              as="a"
              href="#portfolio"
              className="btn-shine mono-label text-xs bg-amber text-graphite px-6 py-3.5 hover:bg-paper transition-colors inline-block"
            >
              View Portfolio
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#about"
              className="mono-label text-xs border border-line px-6 py-3.5 hover:border-amber hover:text-amber transition-colors inline-block"
            >
              Mission Briefing
            </MagneticButton>
          </motion.div>

          <motion.div variants={item} className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3">
            <CoordTag label="LAT" value="37.4275° N" />
            <CoordTag label="LON" value="122.1697° W" />
            <CoordTag label="ALT" value="12,400 FT" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
