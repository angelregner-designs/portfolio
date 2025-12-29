interface FooterNav {
  projects: string
  testimonials: string
  about: string
}

interface FooterProps {
  copyright: string
  nav: FooterNav
}

export const Footer = ({ copyright, nav }: FooterProps) => (
  <footer className="py-8 px-8 bg-gray-900 text-white">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-gray-400">{copyright}</p>
      <nav className="flex gap-6">
        <a href="#projects" className="text-gray-400 hover:text-white transition-colors">
          {nav.projects}
        </a>
        <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">
          {nav.testimonials}
        </a>
        <a href="#about" className="text-gray-400 hover:text-white transition-colors">
          {nav.about}
        </a>
      </nav>
    </div>
  </footer>
)
