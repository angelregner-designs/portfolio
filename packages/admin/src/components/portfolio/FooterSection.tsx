type FooterField =
  | 'footerCopyright'
  | 'footerNavProjects'
  | 'footerNavTestimonials'
  | 'footerNavAbout'
  | 'footerCtaText'

type FooterSectionProps = {
  footerCopyright: string
  footerNavProjects: string
  footerNavTestimonials: string
  footerNavAbout: string
  footerCtaText: string
  onChange: (field: FooterField, value: string) => void
}

const FooterSection = ({
  footerCopyright,
  footerNavProjects,
  footerNavTestimonials,
  footerNavAbout,
  footerCtaText,
  onChange,
}: FooterSectionProps) => (
  <section className='bg-white rounded-lg shadow-md p-6 mb-6'>
    <h2 className='text-xl font-semibold mb-4'>Footer</h2>
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label htmlFor='footerCopyright' className='block mb-1 text-sm font-medium'>
            Copyright Text
          </label>
          <input
            id='footerCopyright'
            type='text'
            value={footerCopyright}
            onChange={e => onChange('footerCopyright', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
        <div>
          <label htmlFor='footerCtaText' className='block mb-1 text-sm font-medium'>
            CTA Button Text
          </label>
          <input
            id='footerCtaText'
            type='text'
            value={footerCtaText}
            onChange={e => onChange('footerCtaText', e.target.value)}
            placeholder="Let's Work Together"
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
      </div>
      <h3 className='font-medium text-gray-700 pt-2'>Navigation Labels</h3>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label htmlFor='footerNavProjects' className='block mb-1 text-sm font-medium'>
            Projects
          </label>
          <input
            id='footerNavProjects'
            type='text'
            value={footerNavProjects}
            onChange={e => onChange('footerNavProjects', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
        <div>
          <label htmlFor='footerNavTestimonials' className='block mb-1 text-sm font-medium'>
            Testimonials
          </label>
          <input
            id='footerNavTestimonials'
            type='text'
            value={footerNavTestimonials}
            onChange={e => onChange('footerNavTestimonials', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
        <div>
          <label htmlFor='footerNavAbout' className='block mb-1 text-sm font-medium'>
            About
          </label>
          <input
            id='footerNavAbout'
            type='text'
            value={footerNavAbout}
            onChange={e => onChange('footerNavAbout', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
      </div>
    </div>
  </section>
)

export default FooterSection
