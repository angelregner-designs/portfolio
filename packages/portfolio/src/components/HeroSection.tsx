interface HeroSectionProps {
  headline: string
  subheadline: string
}

export const HeroSection = ({ headline, subheadline }: HeroSectionProps) => (
  <section className="py-20 px-8 bg-gradient-to-b from-gray-50 to-white">
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-5xl font-bold mb-4">{headline}</h1>
      <p className="text-xl text-gray-600">{subheadline}</p>
    </div>
  </section>
)
