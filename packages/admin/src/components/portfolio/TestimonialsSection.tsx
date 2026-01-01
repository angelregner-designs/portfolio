'use client'

import SortableItem from '@/components/ui/SortableItem'
import type { Testimonial } from '@/types/portfolio'
import { cn } from '@angel-portfolio/shared'
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'

type TestimonialsSectionProps = {
  testimonials: Testimonial[]
  onChange: (testimonials: Testimonial[]) => void
}

// Check if testimonial is empty (new)
const isTestimonialEmpty = (testimonial: Testimonial) =>
  !testimonial.content && !testimonial.personName && !testimonial.company

const TestimonialsSection = ({ testimonials, onChange }: TestimonialsSectionProps) => {
  // Track expanded items by ID
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const isExpanded = (testimonial: Testimonial) =>
    expandedIds.has(testimonial.id) || isTestimonialEmpty(testimonial)

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: crypto.randomUUID(),
      content: '',
      personName: '',
    }
    onChange([...testimonials, newTestimonial])
  }

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
    onChange(testimonials.map(t => (t.id === id ? { ...t, [field]: value } : t)))
  }

  const removeTestimonial = (id: string) => {
    onChange(testimonials.filter(t => t.id !== id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = testimonials.findIndex(t => t.id === active.id)
      const newIndex = testimonials.findIndex(t => t.id === over.id)
      onChange(arrayMove(testimonials, oldIndex, newIndex))
    }
  }

  return (
    <section className={cn('mb-6 p-6', 'bg-white', 'rounded-lg shadow-md')}>
      <div className={cn('flex justify-between items-center', 'mb-4')}>
        <h2 className='text-xl font-semibold'>Testimonials</h2>
        <button
          type='button'
          onClick={addTestimonial}
          className={cn(
            'px-3 py-1.5',
            'text-sm',
            'text-white bg-green-600',
            'rounded-md',
            'hover:bg-green-700',
          )}
        >
          + Add Testimonial
        </button>
      </div>

      {testimonials.length === 0 && (
        <p className={cn('text-sm', 'text-gray-500')}>
          No testimonials yet. Click "Add Testimonial" to create one.
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={testimonials.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className='space-y-4'>
            {testimonials.map((testimonial, index) => {
              const expanded = isExpanded(testimonial)
              return (
                <SortableItem key={testimonial.id} id={testimonial.id}>
                  <div className={cn('p-4 pl-10', 'border border-gray-200', 'rounded-lg')}>
                    <div
                      className={cn(
                        'flex justify-between items-center',
                        !expanded && 'mb-0',
                        expanded && 'mb-3',
                      )}
                    >
                      <button
                        type='button'
                        onClick={() => toggleExpanded(testimonial.id)}
                        className={cn('flex items-center gap-2', 'text-left')}
                      >
                        {/* Chevron */}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                          aria-hidden='true'
                          className={cn(
                            'h-5 w-5',
                            'text-gray-500',
                            'transition-transform',
                            expanded && 'rotate-90',
                          )}
                        >
                          <path
                            fillRule='evenodd'
                            d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className={cn('font-medium', 'text-gray-700')}>
                          Testimonial {index + 1}
                          {!expanded && testimonial.company && (
                            <span className='ml-2 font-normal text-gray-500'>
                              — {testimonial.company}
                            </span>
                          )}
                        </span>
                      </button>
                      <button
                        type='button'
                        onClick={() => removeTestimonial(testimonial.id)}
                        className={cn('text-sm', 'text-red-600', 'hover:text-red-800')}
                      >
                        Remove
                      </button>
                    </div>

                    {expanded && (
                      <div className='space-y-3'>
                        <div>
                          <label
                            htmlFor={`personName-${testimonial.id}`}
                            className={cn('block', 'mb-1', 'text-sm font-medium')}
                          >
                            Person Name
                          </label>
                          <input
                            id={`personName-${testimonial.id}`}
                            type='text'
                            value={testimonial.personName}
                            onChange={e =>
                              updateTestimonial(testimonial.id, 'personName', e.target.value)
                            }
                            className={cn(
                              'w-full',
                              'px-3 py-2',
                              'text-sm',
                              'border border-gray-300',
                              'rounded-md',
                              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            )}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`company-${testimonial.id}`}
                            className={cn('block', 'mb-1', 'text-sm font-medium')}
                          >
                            Company (optional)
                          </label>
                          <input
                            id={`company-${testimonial.id}`}
                            type='text'
                            value={testimonial.company || ''}
                            onChange={e =>
                              updateTestimonial(testimonial.id, 'company', e.target.value)
                            }
                            placeholder='Company name'
                            className={cn(
                              'w-full',
                              'px-3 py-2',
                              'text-sm',
                              'border border-gray-300',
                              'rounded-md',
                              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            )}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`content-${testimonial.id}`}
                            className={cn('block', 'mb-1', 'text-sm font-medium')}
                          >
                            Content
                          </label>
                          <textarea
                            id={`content-${testimonial.id}`}
                            value={testimonial.content}
                            onChange={e =>
                              updateTestimonial(testimonial.id, 'content', e.target.value)
                            }
                            rows={3}
                            className={cn(
                              'w-full',
                              'px-3 py-2',
                              'text-sm',
                              'border border-gray-300',
                              'rounded-md',
                              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </SortableItem>
              )
            })}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  )
}

export default TestimonialsSection
