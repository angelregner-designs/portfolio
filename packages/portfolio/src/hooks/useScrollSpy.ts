'use client'

import { useState, useEffect } from 'react'

interface UseScrollSpyOptions<T extends string> {
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

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(sectionId)
            }
          })
        },
        { threshold }
      )

      observer.observe(element)
      observers.push(observer)
    })

    // Observe deactivation section
    if (deactivateOn) {
      const deactivateElement = document.getElementById(deactivateOn)
      if (deactivateElement) {
        const deactivateObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(null)
              }
            })
          },
          { threshold }
        )
        deactivateObserver.observe(deactivateElement)
        observers.push(deactivateObserver)
      }
    }

    return () => observers.forEach((obs) => obs.disconnect())
  }, [sections, deactivateOn, threshold])

  return activeSection
}
