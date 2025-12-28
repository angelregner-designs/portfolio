import { Logo } from '../ui'

const Hero = () => (
  <section className="bg-burgundy pt-8 pb-6 px-8 md:px-12 lg:px-16">
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-start">
        <div className="max-w-lg">
          <h1 className="font-cormorant text-2xl md:text-3xl text-cream italic font-normal leading-snug mb-3">
            I design with intention,
            <br />
            balancing creative expression
            <br />
            with clarity and purpose.
          </h1>
          <p className="font-lato text-gold text-xs tracking-wide">
            Angel Regner | Product, Brand, and Digital Designer
          </p>
        </div>
        <Logo className="w-14 h-7 md:w-16 md:h-8 text-cream flex-shrink-0" />
      </div>
    </div>
  </section>
)

export default Hero
