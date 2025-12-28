import { Button } from '../ui'

const Footer = () => (
  <footer className="bg-burgundy-dark px-8 md:px-12 lg:px-16 py-6">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-lato text-cream/40 text-[10px]">
          © 2024 Angel Regner • I love design begins with empathy.
        </p>

        <div className="flex items-center gap-4">
          <FooterLink href="#">Client Works</FooterLink>
          <FooterLink href="#">Testimonials</FooterLink>
          <FooterLink href="#">About</FooterLink>
          <Button variant="outline" size="sm">
            Let's Work Together
          </Button>
        </div>
      </div>
    </div>
  </footer>
)

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="font-lato text-cream/50 text-[10px] hover:text-gold transition-colors">
    {children}
  </a>
)

export default Footer
