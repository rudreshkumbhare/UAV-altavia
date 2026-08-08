import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export const BoxesCore = ({ className, ...rest }) => {
  const containerRef = useRef(null)
  const rows = new Array(90).fill(1)
  const cols = new Array(65).fill(1)

  // Altavia's vibrant high-visibility accent color palette
  const colors = [
    '#ff8c3d', // amber bright
    '#ffaa66', // amber gold
    '#5ce1e6', // cyan glow
    '#3fb8af', // cyan teal
    '#e8e6de', // paper white
    '#ffc299', // soft amber
    '#7de3e8', // bright cyan
  ]

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (typeof document === 'undefined' || !document.elementsFromPoint) return
      const elements = document.elementsFromPoint(e.clientX, e.clientY)
      const box = elements.find((el) => el.classList?.contains('box-cell'))

      if (box) {
        const color = getRandomColor()
        box.style.backgroundColor = color
        box.style.boxShadow = `0 0 14px ${color}`
        box.style.borderColor = color
        box.style.transition = 'background-color 0s, box-shadow 0s, border-color 0s'

        if (box._fadeTimer) clearTimeout(box._fadeTimer)
        box._fadeTimer = setTimeout(() => {
          box.style.transition = 'background-color 1.5s ease-out, box-shadow 1.5s ease-out, border-color 1.5s ease-out'
          box.style.backgroundColor = 'transparent'
          box.style.boxShadow = 'none'
          box.style.borderColor = 'rgba(255, 140, 61, 0.18)'
        }, 50)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate(-25%, -35%) skewX(-48deg) skewY(14deg) scale(0.85) translateZ(0)`,
      }}
      className={cn(
        'absolute left-0 top-0 flex w-[2600px] h-[2600px] z-0 pointer-events-auto',
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <div
          key={`row` + i}
          className="w-16 h-8 border-l border-amber/18 relative shrink-0"
        >
          {cols.map((_, j) => (
            <div
              key={`col` + j}
              className="box-cell w-16 h-8 border-r border-t border-amber/18 relative cursor-pointer transition-all duration-700"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-amber/35 stroke-[1px] pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export const Boxes = React.memo(BoxesCore)
export default Boxes
