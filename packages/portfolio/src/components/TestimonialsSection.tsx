import type { Testimonial } from '@/types/portfolio'

type TestimonialsSectionProps = {
  testimonials: Testimonial[]
}

export const TestimonialsSection = ({ testimonials }: TestimonialsSectionProps) => (
  <section id='testimonials' className='pt-50 px-20 bg-[#770B1B]'>
    <div className='max-w-[663px] mx-auto ml-auto mr-[80px] lg:mx-auto'>
      <div className='flex flex-col gap-20'>
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className='flex flex-col gap-4 text-center'>
            <div className='text-[20px] italic text-[#F1EDE4] leading-normal'>
              {testimonial.content
                .split('\n\n')
                .filter(p => p.trim())
                .map((paragraph, index, arr) => (
                  <p key={paragraph.slice(0, 50)} className={index < arr.length - 1 ? 'mb-5' : ''}>
                    {paragraph}
                  </p>
                ))}
            </div>
            <p className='text-[24px] font-light italic text-[#AE8237]'>
              {testimonial.personName}
              {testimonial.company && ` | ${testimonial.company}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
