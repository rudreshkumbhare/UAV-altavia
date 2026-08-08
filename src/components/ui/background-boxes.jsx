import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export const BoxesCore = ({ className, ...rest }) => {
  const rows = new Array(50).fill(1)
  const cols = new Array(35).fill(1)

  // Custom accent color palette tuned to Altavia's Amber, Cyan, Gold & Paper tones
  const colors = [
    'rgb(255 140 61)',  // amber
    'rgb(255 178 115)', // amber-light
    'rgb(92 225 230)',  // cyan-glow
    'rgb(63 184 175)',  // cyan-teal
    'rgb(232 230 222)', // paper
    'rgb(255 200 120)', // gold
    'rgb(42 157 149)',  // deep-teal
  ]

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        'absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 pointer-events-auto',
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-16 h-8 border-l border-line/50 relative"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-line/50 relative cursor-pointer"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-line stroke-[1px] pointer-events-none opacity-60"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

export const Boxes = React.memo(BoxesCore)
export default Boxes
