'use client'

import { useEffect, useState } from 'react'

interface TypingAnimationProps {
  children: string
  className?: string
  duration?: number
}

export function TypingAnimation({ 
  children, 
  className = '', 
  duration = 50 
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < children.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + children[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, duration)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, children, duration])

  return (
    <p className={className}>
      {displayedText}
      {currentIndex < children.length && (
        <span className="animate-pulse">|</span>
      )}
    </p>
  )
}
