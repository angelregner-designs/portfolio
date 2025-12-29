interface SocialLinks {
  behance?: string
  linkedin?: string
  whatsapp?: string
  facebook?: string
  instagram?: string
}

interface ContactSectionProps {
  headline: string
  ctaText: string
  socialLinks: SocialLinks
}

export const ContactSection = ({ headline, ctaText, socialLinks }: ContactSectionProps) => (
  <section id="about" className="py-16 px-8 bg-gradient-to-b from-gray-50 to-gray-100">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">{headline}</h2>
      <p className="text-xl text-gray-600 mb-8">{ctaText}</p>
      <div className="flex justify-center gap-6 flex-wrap">
        {socialLinks.behance && (
          <a href={socialLinks.behance} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
            Behance
          </a>
        )}
        {socialLinks.linkedin && (
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
            LinkedIn
          </a>
        )}
        {socialLinks.whatsapp && (
          <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
            WhatsApp
          </a>
        )}
        {socialLinks.facebook && (
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
            Facebook
          </a>
        )}
        {socialLinks.instagram && (
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
            Instagram
          </a>
        )}
      </div>
    </div>
  </section>
)
