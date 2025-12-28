interface Testimonial {
  id: string
  quote: string
  author: string
  title: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      'In less than 18 months, she demonstrated extraordinary growth, rising from a trainee under a seasoned professional with 20 years of experience to leading the entire Design Department. She not only mastered her craft but also built and trained her own team, established a cohesive design language, and implemented clear processes that elevated both quality and accountability.',
    author: 'Daniel Munoz',
    title: 'Propelio',
  },
  {
    id: '2',
    quote:
      "Working with Angelica has been the best decision we've made in our business. She's been an integral part of our team for months, and we're beyond happy we found her. Angelica is hardworking, communicates clearly, stays organized, and consistently delivers thoughtful updates.",
    author: 'Jack',
    title: 'Villa Vision Builders',
  },
  {
    id: '3',
    quote:
      'Working with Angelica and her team has been an absolute pleasure for us. Their attention to detail, responsiveness and collaboration has been fantastic. I would recommend them to anyone looking for a great partner to help with all of their design needs going forward.',
    author: 'Gus Bieberbach',
    title: 'LIT BOX Studio',
  },
]

const Testimonials = () => (
  <section className="bg-burgundy-dark px-8 md:px-12 lg:px-16 py-12">
    <div className="max-w-3xl mx-auto space-y-10">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="text-center">
          <blockquote className="font-cormorant text-cream/80 text-sm md:text-base italic leading-relaxed mb-3">
            {testimonial.quote}
          </blockquote>
          <div className="font-lato text-xs">
            <span className="text-gold">{testimonial.author}</span>
            <span className="text-cream/40"> | </span>
            <span className="text-cream/50">{testimonial.title}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
)

export default Testimonials
