import type { Testimonial } from '@/types/portfolio'

interface TestimonialsSectionProps {
  title: string
  testimonials: Testimonial[]
}

export const TestimonialsSection = ({ title, testimonials }: TestimonialsSectionProps) => (
  <section id="testimonials" className="py-16 px-8 bg-white">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="space-y-8">
        {testimonials.map((testimonial) => (
          <blockquote key={testimonial.id} className="bg-gray-50 rounded-lg p-6">
            <p className="text-lg text-gray-700 italic mb-4">&ldquo;{testimonial.content}&rdquo;</p>
            <cite className="text-gray-600 font-medium not-italic">— {testimonial.personName}</cite>
          </blockquote>
        ))}
      </div>
    </div>
  </section>
)
