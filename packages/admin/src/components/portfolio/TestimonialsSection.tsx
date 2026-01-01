'use client'

import type { Testimonial } from '@/types/portfolio'
import { cn } from '@angel-portfolio/shared'

type TestimonialsSectionProps = {
  testimonials: Testimonial[]
  onChange: (testimonials: Testimonial[]) => void
}

const TestimonialsSection = ({ testimonials, onChange }: TestimonialsSectionProps) => {
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

      <div className='space-y-4'>
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.id} className={cn('p-4', 'border border-gray-200', 'rounded-lg')}>
            <div className={cn('flex justify-between items-center', 'mb-3')}>
              <span className={cn('font-medium', 'text-gray-700')}>Testimonial {index + 1}</span>
              <button
                type='button'
                onClick={() => removeTestimonial(testimonial.id)}
                className={cn('text-sm', 'text-red-600', 'hover:text-red-800')}
              >
                Remove
              </button>
            </div>
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
                  onChange={e => updateTestimonial(testimonial.id, 'personName', e.target.value)}
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
                  onChange={e => updateTestimonial(testimonial.id, 'company', e.target.value)}
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
                  onChange={e => updateTestimonial(testimonial.id, 'content', e.target.value)}
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
          </div>
        ))}
      </div>
    </section>
  )
}

export default TestimonialsSection
