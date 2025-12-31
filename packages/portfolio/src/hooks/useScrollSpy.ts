'use client'

import { useEffect, useState } from 'react'

type UseScrollSpyOptions<T extends string> = {
  sections: readonly T[]
  deactivateOn?: string
  initialSection?: T | null
  threshold?: number
}

export const useScrollSpy = <T extends string>({
  sections,
  deactivateOn,
  initialSection = null,
  threshold = 0.3,
}: UseScrollSpyOptions<T>) => {
  const [activeSection, setActiveSection] = useState<T | null>(initialSection)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (!element) continue

      const observer = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveSection(sectionId)
            }
          }
        },
        { threshold },
      )

      observer.observe(element)
      observers.push(observer)
    }

    // Observe deactivation section
    if (deactivateOn) {
      const deactivateElement = document.getElementById(deactivateOn)
      if (deactivateElement) {
        const deactivateObserver = new IntersectionObserver(
          entries => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                setActiveSection(null)
              }
            }
          },
          { threshold },
        )
        deactivateObserver.observe(deactivateElement)
        observers.push(deactivateObserver)
      }
    }

    return () => {
      for (const obs of observers) obs.disconnect()
    }
  }, [sections, deactivateOn, threshold])

  return activeSection
}
