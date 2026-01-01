import { cn } from '@angel-portfolio/shared'

type AboutSectionProps = {
  aboutMeTitle: string
  aboutMeContent: string
  whyIDesignTitle: string
  whyIDesignContent: string
  onChange: (
    field: 'aboutMeTitle' | 'aboutMeContent' | 'whyIDesignTitle' | 'whyIDesignContent',
    value: string,
  ) => void
}

const AboutSection = ({
  aboutMeTitle,
  aboutMeContent,
  whyIDesignTitle,
  whyIDesignContent,
  onChange,
}: AboutSectionProps) => (
  <section className={cn('mb-6 p-6', 'bg-white', 'rounded-lg shadow-md')}>
    <h2 className={cn('mb-4', 'text-xl font-semibold')}>About Sections</h2>
    <div className='space-y-6'>
      <div className='space-y-3'>
        <h3 className={cn('font-medium', 'text-gray-700')}>About Me</h3>
        <div>
          <label htmlFor='aboutMeTitle' className={cn('block', 'mb-1', 'text-sm font-medium')}>
            Title
          </label>
          <input
            id='aboutMeTitle'
            type='text'
            value={aboutMeTitle}
            onChange={e => onChange('aboutMeTitle', e.target.value)}
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
          <label htmlFor='aboutMeContent' className={cn('block', 'mb-1', 'text-sm font-medium')}>
            Content
          </label>
          <textarea
            id='aboutMeContent'
            value={aboutMeContent}
            onChange={e => onChange('aboutMeContent', e.target.value)}
            rows={6}
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
      <div className='space-y-3'>
        <h3 className={cn('font-medium', 'text-gray-700')}>Why I Design</h3>
        <div>
          <label htmlFor='whyIDesignTitle' className={cn('block', 'mb-1', 'text-sm font-medium')}>
            Title
          </label>
          <input
            id='whyIDesignTitle'
            type='text'
            value={whyIDesignTitle}
            onChange={e => onChange('whyIDesignTitle', e.target.value)}
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
          <label htmlFor='whyIDesignContent' className={cn('block', 'mb-1', 'text-sm font-medium')}>
            Content
          </label>
          <textarea
            id='whyIDesignContent'
            value={whyIDesignContent}
            onChange={e => onChange('whyIDesignContent', e.target.value)}
            rows={6}
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
    </div>
  </section>
)

export default AboutSection
