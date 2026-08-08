import React, { useMemo } from 'react'
import { Plus } from 'lucide-react'

// Adapted from the "Background Boxes" hover-grid effect. Two changes from
// the original: (1) grid density cut way down and per-cell hover moved from
// Framer Motion (whileHover) to plain CSS :hover — the original's 150x100
// grid is 15,000 mounted motion components, which is a real perf cost for
// something that's just decorative background. (2) colors pull only from
// the site's own amber/cyan accents instead of a nine-color rainbow, so it
// reads as part of the HUD language already used elsewhere (Hero grid,
// Portfolio backdrop, Gallery radar) rather than a new visual style.
const ROWS = 14
const COLS = 26

function BoxesCore({ className = '', ...rest }) {
  const rows = useMemo(() => Array.from({ length: ROWS }), [])
  const cols = useMemo(() => Array.from({ length: COLS }), [])

  return (
    <div
      style={{
        transform: 'translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)',
      }}
      className={`absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 ${className}`}
      {...rest}
    >
      {rows.map((_, i) => (
        <div key={`row-${i}`} className="w-16 h-8 border-l border-line relative">
          {cols.map((_, j) => {
            const alt = (i + j) % 2 === 0
            return (
              <div
                key={`col-${j}`}
                className={`group w-16 h-8 border-r border-t border-line relative transition-colors duration-150 ${
                  alt ? 'hover:bg-amber/25' : 'hover:bg-cyan/25'
                }`}
              >
                {j % 2 === 0 && i % 2 === 0 ? (
                  <Plus
                    className="absolute h-4 w-4 -top-2 -left-2 text-line stroke-[1.5px] pointer-events-none transition-colors duration-150 group-hover:text-paper"
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export const Boxes = React.memo(BoxesCore)
