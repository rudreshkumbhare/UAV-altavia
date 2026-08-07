import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionEyebrow } from '../components/Telemetry'
import MagneticButton from '../components/MagneticButton'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function Contact() {
  return (
    <section id="contact" className="relative pt-28 md:pt-36 border-t border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <SectionEyebrow index="08" label="Contact" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-20"
        >
          <div className="max-w-xl">
            <h2 className="font-display text-4xl md:text-6xl font-medium leading-tight mb-6">
              Open a
              <br />
              transmission.
            </h2>
            <p className="text-paper-dim text-base md:text-lg leading-relaxed">
              Have a mission profile, a research collaboration, or a platform
              you want engineered? We read every message that comes through.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="hud-frame border border-line bg-surface p-8 w-full md:w-[380px] shrink-0 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <label className="mono-label text-[10px] text-paper-dim" htmlFor="name">
                Callsign / Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="bg-transparent border-b border-line py-2 focus:outline-none focus:border-amber transition-colors"
                placeholder="Your name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="mono-label text-[10px] text-paper-dim" htmlFor="email">
                Frequency / Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="bg-transparent border-b border-line py-2 focus:outline-none focus:border-amber transition-colors"
                placeholder="you@domain.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="mono-label text-[10px] text-paper-dim" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={3}
                className="bg-transparent border-b border-line py-2 focus:outline-none focus:border-amber transition-colors resize-none"
                placeholder="What are you building?"
              />
            </div>
            <MagneticButton
              as="button"
              type="submit"
              strength={0.2}
              className="btn-shine mono-label text-xs bg-amber text-graphite px-6 py-3.5 hover:bg-paper transition-colors mt-2 flex items-center justify-center gap-2"
            >
              Send Transmission
              <ArrowUpRight className="w-3.5 h-3.5" />
            </MagneticButton>
          </form>
        </motion.div>
      </div>

      <footer className="border-t border-line">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-amber rounded-full" />
            <span className="font-display font-semibold text-sm">ALTAVIA</span>
            <span className="mono-label text-[10px] text-paper-dim">Aerosystems</span>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {['GitHub', 'LinkedIn', 'Twitter / X'].map((s) => (
              <a
                key={s}
                href="#"
                className="mono-label text-xs text-paper-dim hover:text-amber transition-colors"
              >
                {s}
              </a>
            ))}
          </div>

          <span className="mono-label text-[10px] text-paper-dim">
            © 2026 ALTAVIA AEROSYSTEMS — ALL SYSTEMS NOMINAL
          </span>
        </div>
      </footer>
    </section>
  )
}
