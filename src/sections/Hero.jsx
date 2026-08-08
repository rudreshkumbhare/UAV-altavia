import { motion, useScroll, useTransform } from 'framer-motion'
import { Suspense, lazy, useRef } from 'react'
import { CoordTag } from '../components/Telemetry'
import MagneticButton from '../components/MagneticButton'
import GradientShimmer from '../components/ui/gradient-shimmer'
const UAVScene = lazy(() => import('../components/UAVScene'))
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
    <section ref={ref} id="top" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-graphite pointer-events-none" />
      {/* 3D scene, right side on desktop, background on mobile */}
      <div className="absolute inset-0 md:inset-y-0 md:right-0 md:left-[35%] opacity-40 md:opacity-90 z-0 pointer-events-none flex items-center justify-center">
        <div
          data-cursor="drag"
          className="relative w-[420px] h-[420px] sm:w-[540px] sm:h-[540px] md:w-[600px] md:h-[600px] rounded-full pointer-events-auto flex items-center justify-center"
        >
          <Suspense fallback={null}>
            <UAVScene />
          </Suspense>
        </div>
      </div>
      {/* mobile-only scrim so the wireframe UAV never fights the headline for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-graphite via-graphite/80 to-graphite md:hidden pointer-events-none" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="hidden md:block absolute bottom-10 right-10 mono-label text-[10px] text-paper-dim pointer-events-none z-20"
      >
        Drag to rotate
      </motion.div>
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full pointer-events-none">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl pointer-events-auto">
          <motion.div variants={item} className="flex items-center gap-3 mb-6">
            <span className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
            <span className="mono-label text-xs text-amber">Systems Online</span>
          </motion.div>
          <motion.h1
            variants={item}
            className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.98] font-medium tracking-tight"
          >
            <GradientShimmer
              gradient="sunrise"
              duration={1.8}
              spread={4}
              angle={105}
              pauseBetween={3500}
              baseColor="var(--color-paper)"
            >
              Engineering
            </GradientShimmer>
            <br />
            <GradientShimmer
              gradient="sunrise"
              duration={1.8}
              spread={4}
              angle={105}
              pauseBetween={3500}
              baseColor="var(--color-paper)"
            >
              the aircraft
            </GradientShimmer>
            <br />
            <GradientShimmer
              gradient="sunrise"
              duration={1.8}
              spread={4}
              angle={105}
              pauseBetween={3500}
              baseColor="var(--color-paper)"
            >
              no one has flown.
            </GradientShimmer>
          </motion.h1>
          <motion.p variants={item} className="mt-6 text-paper-dim text-base md:text-lg max-w-md leading-relaxed">
            ALTAVIA designs autonomous flight systems — from airframe to flight
            control — for the environments where piloted aircraft can't go.
          </motion.p>
          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
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
          <motion.div variants={item} className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
            <CoordTag label="LAT" value="37.4275° N" />
            <CoordTag label="LON" value="122.1697° W" />
            <CoordTag label="ALT" value="12,400 FT" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}