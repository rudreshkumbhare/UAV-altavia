import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { CoordTag } from '../components/Telemetry'
import MagneticButton from '../components/MagneticButton'
import DecryptText from '../components/ui/decrypt-text'

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
            <DecryptText
              text="Systems Online // Direct Telemetry Feed"
              variant="terminal"
              trigger="mount"
              speed={35}
              stagger={25}
              startDelay={200}
              loop={false}
              className="mono-label text-xs text-amber font-semibold border-none bg-transparent shadow-none p-0 inline-block w-auto"
            />
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.05] font-medium tracking-tight text-center text-paper"
          >
            <DecryptText
              text="Engineering"
              as="span"
              variant="display"
              trigger="mount"
              speed={35}
              stagger={45}
              startDelay={300}
              retriggerOnHover={true}
              loop={false}
              className="inline-block text-paper"
            />
            <br />
            <DecryptText
              text="the aircraft"
              as="span"
              variant="display"
              trigger="mount"
              speed={35}
              stagger={45}
              startDelay={600}
              retriggerOnHover={true}
              loop={false}
              className="inline-block text-paper"
            />
            <br />
            <DecryptText
              text="no one has flown."
              as="span"
              variant="display"
              trigger="mount"
              speed={35}
              stagger={45}
              startDelay={900}
              retriggerOnHover={true}
              loop={false}
              className="inline-block text-paper"
            />
          </motion.h1>

          <motion.div variants={item} className="mt-6 max-w-lg">
            <DecryptText
              text="ALTAVIA designs autonomous flight systems — from airframe to flight control — for the environments where piloted aircraft can't go."
              as="p"
              variant="display"
              trigger="mount"
              speed={20}
              stagger={18}
              startDelay={600}
              retriggerOnHover={true}
              loop={false}
              className="text-paper-dim text-base md:text-lg leading-relaxed text-center font-normal tracking-normal text-balance"
            />
          </motion.div>

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