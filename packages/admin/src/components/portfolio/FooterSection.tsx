type FooterField = 'footerCopyright' | 'footerNavProjects' | 'footerNavTestimonials' | 'footerNavAbout'

interface FooterSectionProps {
  footerCopyright: string
  footerNavProjects: string
  footerNavTestimonials: string
  footerNavAbout: string
  onChange: (field: FooterField, value: string) => void
}

const FooterSection = ({
  footerCopyright,
  footerNavProjects,
  footerNavTestimonials,
  footerNavAbout,
  onChange
}: FooterSectionProps) => (
  <section className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">Footer</h2>
    <div className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Copyright Text</label>
        <input
          type="text"
          value={footerCopyright}
          onChange={(e) => onChange('footerCopyright', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <h3 className="font-medium text-gray-700 pt-2">Navigation Labels</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Projects</label>
          <input
            type="text"
            value={footerNavProjects}
            onChange={(e) => onChange('footerNavProjects', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Testimonials</label>
          <input
            type="text"
            value={footerNavTestimonials}
            onChange={(e) => onChange('footerNavTestimonials', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">About</label>
          <input
            type="text"
            value={footerNavAbout}
            onChange={(e) => onChange('footerNavAbout', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  </section>
)

export default FooterSection
