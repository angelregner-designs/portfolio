import { cn } from '@angel-portfolio/shared'

type ContactField =
  | 'contactsHeadline'
  | 'contactsCtaText'
  | 'linkBehance'
  | 'linkLinkedin'
  | 'linkWhatsapp'
  | 'linkFacebook'
  | 'linkInstagram'
  | 'linkEmail'

type ContactsSectionProps = {
  contactsHeadline: string
  contactsCtaText: string
  linkBehance: string
  linkLinkedin: string
  linkWhatsapp: string
  linkFacebook: string
  linkInstagram: string
  linkEmail: string
  onChange: (field: ContactField, value: string) => void
}

const ContactsSection = ({
  contactsHeadline,
  contactsCtaText,
  linkBehance,
  linkLinkedin,
  linkWhatsapp,
  linkFacebook,
  linkInstagram,
  linkEmail,
  onChange,
}: ContactsSectionProps) => (
  <section className={cn('mb-6 p-6', 'bg-white', 'rounded-lg shadow-md')}>
    <h2 className={cn('mb-4', 'text-xl font-semibold')}>Contacts Section</h2>
    <div className='space-y-4'>
      <div className={cn('grid grid-cols-1 md:grid-cols-2', 'gap-4')}>
        <div>
          <label htmlFor='contactsHeadline' className={cn('block', 'mb-1', 'text-sm font-medium')}>
            Headline
          </label>
          <input
            id='contactsHeadline'
            type='text'
            value={contactsHeadline}
            onChange={e => onChange('contactsHeadline', e.target.value)}
            className={cn(
              'w-full',
              'px-3 py-2',
              'border border-gray-300',
              'rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            )}
          />
        </div>
        <div>
          <label htmlFor='contactsCtaText' className={cn('block', 'mb-1', 'text-sm font-medium')}>
            CTA Text
          </label>
          <input
            id='contactsCtaText'
            type='text'
            value={contactsCtaText}
            onChange={e => onChange('contactsCtaText', e.target.value)}
            className={cn(
              'w-full',
              'px-3 py-2',
              'border border-gray-300',
              'rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            )}
          />
        </div>
      </div>

      <h3 className={cn('pt-2', 'font-medium', 'text-gray-700')}>Social Links</h3>
      <div className={cn('grid grid-cols-1 md:grid-cols-2', 'gap-4')}>
        <div>
          <label htmlFor='linkBehance' className={cn('block', 'mb-1', 'text-sm font-medium')}>
            Behance
          </label>
          <input
            id='linkBehance'
            type='text'
            value={linkBehance}
            onChange={e => onChange('linkBehance', e.target.value)}
            placeholder='https://behance.net/...'
            className={cn(
              'w-full',
              'px-3 py-2',
              'text-sm',
              'border border-gray-300',
              'rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            )}
          />
        </div>
        <div>
          <label htmlFor='linkLinkedin' className={cn('block', 'mb-1', 'text-sm font-medium')}>
            LinkedIn
          </label>
          <input
            id='linkLinkedin'
            type='text'
            value={linkLinkedin}
            onChange={e => onChange('linkLinkedin', e.target.value)}
            placeholder='https://linkedin.com/in/...'
            className={cn(
              'w-full',
              'px-3 py-2',
              'text-sm',
              'border border-gray-300',
              'rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            )}
          />
        </div>
        <div>
          <label htmlFor='linkWhatsapp' className={cn('block', 'mb-1', 'text-sm font-medium')}>
            WhatsApp
          </label>
          <input
            id='linkWhatsapp'
            type='text'
            value={linkWhatsapp}
            onChange={e => onChange('linkWhatsapp', e.target.value)}
            placeholder='https://wa.me/...'
            className={cn(
              'w-full',
              'px-3 py-2',
              'text-sm',
              'border border-gray-300',
              'rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            )}
          />
        </div>
        <div>
          <label htmlFor='linkFacebook' className={cn('block', 'mb-1', 'text-sm font-medium')}>
            Facebook
          </label>
          <input
            id='linkFacebook'
            type='text'
            value={linkFacebook}
            onChange={e => onChange('linkFacebook', e.target.value)}
            placeholder='https://facebook.com/...'
            className={cn(
              'w-full',
              'px-3 py-2',
              'text-sm',
              'border border-gray-300',
              'rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            )}
          />
        </div>
        <div>
          <label htmlFor='linkInstagram' className={cn('block', 'mb-1', 'text-sm font-medium')}>
            Instagram
          </label>
          <input
            id='linkInstagram'
            type='text'
            value={linkInstagram}
            onChange={e => onChange('linkInstagram', e.target.value)}
            placeholder='https://instagram.com/...'
            className={cn(
              'w-full',
              'px-3 py-2',
              'text-sm',
              'border border-gray-300',
              'rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            )}
          />
        </div>
        <div>
          <label htmlFor='linkEmail' className={cn('block', 'mb-1', 'text-sm font-medium')}>
            Email
          </label>
          <input
            id='linkEmail'
            type='text'
            value={linkEmail}
            onChange={e => onChange('linkEmail', e.target.value)}
            placeholder='mailto:email@example.com'
            className={cn(
              'w-full',
              'px-3 py-2',
              'text-sm',
              'border border-gray-300',
              'rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            )}
          />
        </div>
      </div>
    </div>
  </section>
)

export default ContactsSection
