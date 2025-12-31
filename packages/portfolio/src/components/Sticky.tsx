import { type ReactNode, useEffect, useRef, useState } from 'react'

type StickyProps = {
  topOffset?: number
  children: ReactNode
  className?: string
  onStickyChange?: (isSticky: boolean) => void
}

type Dimensions = { left: number; width: number; height: number }

export const Sticky = ({ topOffset = 0, children, className, onStickyChange }: StickyProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [dimensions, setDimensions] = useState<Dimensions>({ left: 0, width: 0, height: 0 })

  // Notify parent when sticky state changes
  useEffect(() => {
    onStickyChange?.(isSticky)
  }, [isSticky, onStickyChange])

  // Track dimensions - only update when not sticky to get true layout position
  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const updateDimensions = () => {
      if (!isSticky) {
        const containerRect = container.getBoundingClientRect()
        const contentRect = content.getBoundingClientRect()
        setDimensions({
          left: containerRect.left,
          width: containerRect.width,
          height: contentRect.height,
        })
      }
    }

    updateDimensions()

    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(container)
    resizeObserver.observe(content)

    window.addEventListener('resize', updateDimensions)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateDimensions)
    }
  }, [isSticky])

  // Observe when container top + offset reaches viewport top
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // rootMargin top: negative offset means trigger when element is that far from viewport top
    // We want to trigger when element.top + topOffset <= viewport.top (i.e., element.top <= -topOffset relative to viewport)
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When not intersecting and bounding rect top is negative, we've scrolled past
        const rect = entry.boundingClientRect
        const shouldBeSticky = rect.top <= topOffset
        setIsSticky(shouldBeSticky)
      },
      {
        threshold: [0, 1],
        rootMargin: `-${topOffset}px 0px 0px 0px`,
      },
    )

    observer.observe(container)

    // Also handle scroll for more responsive updates
    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      setIsSticky(rect.top <= topOffset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [topOffset])

  return (
    <div
      ref={containerRef}
      className={className}
      // Preserve container size when sticky to prevent layout shift
      style={isSticky ? { minHeight: dimensions.height, minWidth: dimensions.width } : undefined}
    >
      <div
        ref={contentRef}
        style={
          isSticky
            ? {
                position: 'fixed',
                top: topOffset,
                left: dimensions.left,
                width: dimensions.width,
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  )
}
