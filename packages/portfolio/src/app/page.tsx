const API_URL = process.env.API_URL || 'http://localhost:3001'

interface Project {
  id: string
  thumbnail: string
  photos: string[]
  description: string
  link: string
}

interface Testimonial {
  id: string
  content: string
  personName: string
}

interface Portfolio {
  id: string
  heroHeadline: string
  heroSubheadline: string
  projects: Project[]
  testimonials: Testimonial[]
  box1Title: string
  box1Content: string
  box2Title: string
  box2Content: string
  contactsHeadline: string
  contactsCtaText: string
  linkBehance: string
  linkLinkedin: string
  linkWhatsapp: string
  linkFacebook: string
  linkInstagram: string
  footerCopyright: string
  footerNavProjects: string
  footerNavTestimonials: string
  footerNavAbout: string
}

const fetchPortfolio = async (): Promise<Portfolio | null> => {
  try {
    const res = await fetch(`${API_URL}/portfolio`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const HomePage = async () => {
  const portfolio = await fetchPortfolio()

  if (!portfolio) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load portfolio data</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">{portfolio.heroHeadline}</h1>
          <p className="text-xl text-gray-600">{portfolio.heroSubheadline}</p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{portfolio.footerNavProjects}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.projects.map((project) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  {project.thumbnail && (
                    <img
                      src={project.thumbnail}
                      alt={project.description}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="p-4">
                    <p className="text-gray-700">{project.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Box Sections */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold mb-4">{portfolio.box1Title}</h3>
            <p className="text-gray-600">{portfolio.box1Content}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold mb-4">{portfolio.box2Title}</h3>
            <p className="text-gray-600">{portfolio.box2Content}</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{portfolio.footerNavTestimonials}</h2>
          <div className="space-y-8">
            {portfolio.testimonials.map((testimonial) => (
              <blockquote key={testimonial.id} className="bg-gray-50 rounded-lg p-6">
                <p className="text-lg text-gray-700 italic mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                <cite className="text-gray-600 font-medium not-italic">— {testimonial.personName}</cite>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="about" className="py-16 px-8 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{portfolio.contactsHeadline}</h2>
          <p className="text-xl text-gray-600 mb-8">{portfolio.contactsCtaText}</p>
          <div className="flex justify-center gap-6 flex-wrap">
            {portfolio.linkBehance && (
              <a href={portfolio.linkBehance} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                Behance
              </a>
            )}
            {portfolio.linkLinkedin && (
              <a href={portfolio.linkLinkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                LinkedIn
              </a>
            )}
            {portfolio.linkWhatsapp && (
              <a href={portfolio.linkWhatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                WhatsApp
              </a>
            )}
            {portfolio.linkFacebook && (
              <a href={portfolio.linkFacebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                Facebook
              </a>
            )}
            {portfolio.linkInstagram && (
              <a href={portfolio.linkInstagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                Instagram
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">{portfolio.footerCopyright}</p>
          <nav className="flex gap-6">
            <a href="#projects" className="text-gray-400 hover:text-white transition-colors">
              {portfolio.footerNavProjects}
            </a>
            <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">
              {portfolio.footerNavTestimonials}
            </a>
            <a href="#about" className="text-gray-400 hover:text-white transition-colors">
              {portfolio.footerNavAbout}
            </a>
          </nav>
        </div>
      </footer>
    </main>
  )
}

export default HomePage
