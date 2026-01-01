import type { Testimonial } from '@/types/portfolio'
import { cn } from '@angel-portfolio/shared'

type TestimonialsSectionProps = {
  testimonials: Testimonial[]
}

export const TestimonialsSection = ({ testimonials }: TestimonialsSectionProps) => (
  <section id='testimonials' className={cn('pt-10 pb-30 px-10 desktop:px-20', 'bg-oathfire')}>
    <div className='max-w-[663px] mx-auto'>
      <div className='flex flex-col gap-20'>
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className='flex flex-col gap-4 text-center'>
            <div className={cn('text-[20px] italic text-moon-paper leading-normal')}>
              {testimonial.content
                .split('\n\n')
                .filter(p => p.trim())
                .map((paragraph, index, arr) => (
                  <p key={paragraph.slice(0, 50)} className={index < arr.length - 1 ? 'mb-5' : ''}>
                    {paragraph}
                  </p>
                ))}
            </div>
            <p className={cn('text-[24px] font-light italic text-golden-sol')}>
              {testimonial.personName}
              {testimonial.company && ` | ${testimonial.company}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
