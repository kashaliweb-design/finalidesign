'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const IMAGES = [1, 2, 3, 4, 5, 6]

export default function Marquee3D() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const columns = container.querySelectorAll('.marquee-column')
    
    columns.forEach((col, index) => {
      const speed = 30 + (index * 10)
      const direction = index % 2 === 0 ? 1 : -1
      let position = 0

      const animate = () => {
        position += direction * 0.5
        if (col instanceof HTMLElement) {
          col.style.transform = `translateY(${position}px)`
        }
        requestAnimationFrame(animate)
      }

      animate()
    })
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10 pointer-events-none" />
      
      <div className="flex gap-4 h-full">
        {[1, 2, 3, 4].map((colIndex) => (
          <div 
            key={colIndex}
            className="marquee-column flex-1 flex flex-col gap-4"
            style={{
              animation: `marquee${colIndex} ${20 + colIndex * 5}s linear infinite`,
            }}
          >
            {IMAGES.concat(IMAGES).map((num, idx) => (
              <div 
                key={`${colIndex}-${idx}`}
                className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <Image 
                  src={`/assets/${num}.jpeg`} 
                  alt={`Skill ${num}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 20vw"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee1 {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee2 {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        @keyframes marquee3 {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee4 {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
