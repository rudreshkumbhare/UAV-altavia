import { useEffect, useRef } from 'react'
import { Boxes } from '@/components/ui/background-boxes'

// Fixed, full-viewport canvas that sits behind all page content.
// Draws 3D interactive background boxes across the site, a slowly drifting grid,
// an occasional radar-style sweep, and faint interactive particles.
export default function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const CELL = 52
    let width = 0
    let height = 0
    let dpr = 1
    let particles = []
    let blips = []
    let rafId = null
    const start = performance.now()

    // Mouse tracking for interactive particle dispersion
    const mouse = {
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      prevX: -1000,
      prevY: -1000,
      active: false,
    }

    function handleMouseMove(e) {
      const x = e.clientX
      const y = e.clientY
      if (mouse.prevX === -1000) {
        mouse.vx = 0
        mouse.vy = 0
      } else {
        mouse.vx = x - mouse.prevX
        mouse.vy = y - mouse.prevY
      }
      mouse.x = x
      mouse.y = y
      mouse.prevX = x
      mouse.prevY = y
      mouse.active = true
    }

    function handleMouseLeave() {
      mouse.active = false
      mouse.x = -1000
      mouse.y = -1000
      mouse.prevX = -1000
      mouse.prevY = -1000
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    function initParticles() {
      const count = Math.min(85, Math.floor((width * height) / 18000))
      particles = Array.from({ length: count }, () => {
        const isAmber = Math.random() < 0.25
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          r: Math.random() * 1.5 + 0.6,
          speed: Math.random() * 0.18 + 0.04,
          drift: (Math.random() - 0.5) * 0.1,
          baseAlpha: Math.random() * 0.35 + 0.1,
          alpha: 0.2,
          isAmber,
        }
      })

      const cols = Math.ceil(width / CELL) + 2
      const rows = Math.ceil(height / CELL) + 2
      blips = Array.from({ length: 6 }, () => ({
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
        phase: Math.random() * Math.PI * 2,
        speedMul: 0.4 + Math.random() * 0.6,
      }))
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles()
    }

    function drawSweep(t) {
      if (!ctx.createConicGradient) return
      const cx = width * 0.84
      const cy = height * 0.16
      const radius = Math.max(width, height) * 0.95
      const angle = (t * 0.00016) % (Math.PI * 2)
      const grad = ctx.createConicGradient(angle, cx, cy)
      grad.addColorStop(0, 'rgba(255,140,61,0.10)')
      grad.addColorStop(0.05, 'rgba(255,140,61,0.025)')
      grad.addColorStop(0.1, 'rgba(255,140,61,0)')
      grad.addColorStop(1, 'rgba(255,140,61,0)')
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
    }

    function drawGrid(t) {
      const offsetX = (t * 0.006) % CELL
      const offsetY = (t * 0.004) % CELL

      ctx.strokeStyle = 'rgba(232,230,222,0.05)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = -CELL + offsetX; x < width + CELL; x += CELL) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = -CELL + offsetY; y < height + CELL; y += CELL) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      blips.forEach((b) => {
        const bx = b.col * CELL + offsetX - CELL
        const by = b.row * CELL + offsetY - CELL
        const pulse = (Math.sin(t * 0.0007 * b.speedMul + b.phase) + 1) / 2
        if (pulse < 0.6) return
        const a = (pulse - 0.6) / 0.4
        ctx.beginPath()
        ctx.arc(bx, by, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,140,61,${a * 0.55})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(bx, by, 5 + a * 5, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255,140,61,${a * 0.25})`
        ctx.lineWidth = 1
        ctx.stroke()
      })
    }

    function drawParticles() {
      mouse.vx *= 0.85
      mouse.vy *= 0.85
      const radius = 170

      particles.forEach((p) => {
        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.hypot(dx, dy)

          if (dist < radius && dist > 0) {
            const force = (radius - dist) / radius
            const angle = Math.atan2(dy, dx)

            p.vx += Math.cos(angle) * force * 0.9
            p.vy += Math.sin(angle) * force * 0.9

            p.vx += mouse.vx * 0.04 * force
            p.vy += mouse.vy * 0.04 * force

            p.alpha = Math.min(0.85, p.baseAlpha + force * 0.55)
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.05
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05
        }

        p.vx *= 0.92
        p.vy *= 0.92

        p.x += p.vx + p.drift
        p.y += p.vy - p.speed

        if (p.y < -20) {
          p.y = height + 20
          p.x = Math.random() * width
        } else if (p.y > height + 20) {
          p.y = -20
          p.x = Math.random() * width
        }

        if (p.x < -20) p.x = width + 20
        else if (p.x > width + 20) p.x = -20

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r + (p.alpha > 0.5 ? 0.5 : 0), 0, Math.PI * 2)
        if (p.isAmber) {
          ctx.fillStyle = `rgba(255,140,61,${p.alpha})`
        } else {
          ctx.fillStyle = `rgba(232,230,222,${p.alpha})`
        }
        ctx.fill()
      })

      if (mouse.active) {
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i]
          const distToMouse = Math.hypot(p1.x - mouse.x, p1.y - mouse.y)
          if (distToMouse > radius * 1.2) continue

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j]
            const pDist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
            if (pDist < 85) {
              const lineAlpha = (1 - pDist / 85) * 0.18 * (1 - distToMouse / (radius * 1.2))
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle =
                p1.isAmber || p2.isAmber
                  ? `rgba(255,140,61,${lineAlpha})`
                  : `rgba(232,230,222,${lineAlpha})`
              ctx.lineWidth = 0.8
              ctx.stroke()
            }
          }
        }
      }
    }

    function frame(now) {
      const t = now - start
      ctx.clearRect(0, 0, width, height)
      drawSweep(t)
      drawGrid(t)
      drawParticles()
      rafId = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)

    if (reduceMotion) {
      ctx.clearRect(0, 0, width, height)
      drawGrid(0)
    } else {
      rafId = requestAnimationFrame(frame)
    }

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* 3D Interactive Background Boxes across the whole site */}
      <Boxes />

      {/* Uniform dark wash so the interactive box glow stays muted behind text everywhere,
          not just near the screen edges */}
      <div className="absolute inset-0 bg-graphite/60 pointer-events-none" />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="block w-full h-full relative z-10" />
    </div>
  )
}


