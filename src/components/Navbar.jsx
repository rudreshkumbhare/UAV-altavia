import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Domains', href: '#domains' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-graphite/90 backdrop-blur-md border-b border-line' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="w-2 h-2 bg-amber rounded-full group-hover:animate-pulse" />
          <span className="font-display font-semibold tracking-wide text-sm md:text-base">
            ALTAVIA
          </span>
          <span className="mono-label text-[10px] text-paper-dim hidden sm:inline">Aerosystems</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="mono-label text-xs text-paper-dim hover:text-amber transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-block mono-label text-xs border border-line hover:border-amber hover:text-amber transition-colors px-4 py-2"
        >
          Initiate Contact
        </a>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-px bg-paper transition-transform ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`w-6 h-px bg-paper transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-px bg-paper transition-transform ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-graphite border-t border-line px-6 py-4 flex flex-col gap-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="mono-label text-xs text-paper-dim hover:text-amber"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </motion.header>
  )
}
