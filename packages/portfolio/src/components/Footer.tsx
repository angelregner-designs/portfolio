interface FooterNav {
  projects: string
  testimonials: string
  about: string
}

interface FooterProps {
  copyright: string
  nav: FooterNav
  ctaText: string
}

export const Footer = ({ copyright, nav, ctaText }: FooterProps) => (
  <footer className="pt-50 pb-10 px-20 bg-[#770B1B]">
    <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-8">
      {/* Copyright */}
      <p className="text-[14px] text-[#F1EDE4]/70 text-center pb-64">
        {copyright}
      </p>

      {/* Navigation Card */}
      {/* <div className="bg-[#F1EDE4] border-2 border-[#AE8237] rounded-2xl p-3 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center gap-8">
        <nav className="flex items-center gap-4">
          <a
            href="#projects"
            className="px-3 text-[18px] italic text-[#AE8237] hover:text-[#770B1B] transition-colors"
          >
            {nav.projects}
          </a>
          <a
            href="#testimonials"
            className="px-3 text-[18px] italic text-[#AE8237] hover:text-[#770B1B] transition-colors"
          >
            {nav.testimonials}
          </a>
          <a
            href="#about"
            className="px-3 text-[18px] italic text-[#AE8237] hover:text-[#770B1B] transition-colors"
          >
            {nav.about}
          </a>
        </nav>
        <a
          href="#connect"
          className="bg-[#817548] rounded-lg px-5 py-3 text-[18px] font-light text-[#F1EDE4] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] hover:bg-[#AE8237] transition-colors"
        >
          {ctaText}
        </a>
      </div> */}
    </div>
  </footer>
)
