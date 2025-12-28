import { Button, SocialIcon } from '../ui'

const Contact = () => (
  <section className="bg-burgundy px-8 md:px-12 lg:px-16 py-12">
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="font-cormorant text-cream text-2xl md:text-3xl mb-6">Let's Connect</h2>

      <div className="flex justify-center gap-3 mb-6">
        <SocialIcon type="linkedin" href="https://linkedin.com" />
        <SocialIcon type="behance" href="https://behance.net" />
        <SocialIcon type="dribbble" href="https://dribbble.com" />
        <SocialIcon type="instagram" href="https://instagram.com" />
        <SocialIcon type="email" href="mailto:hello@example.com" />
      </div>

      <Button variant="outline">Let's Work Together</Button>
    </div>
  </section>
)

export default Contact
