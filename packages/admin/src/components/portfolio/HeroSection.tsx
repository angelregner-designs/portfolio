import { cn } from '@angel-portfolio/shared'

type HeroSectionProps = {
  heroHeadline: string
  heroSubheadline: string
  onChange: (field: 'heroHeadline' | 'heroSubheadline', value: string) => void
}

const HeroSection = ({ heroHeadline, heroSubheadline, onChange }: HeroSectionProps) => (
  <section className={cn('mb-6 p-6', 'bg-white', 'rounded-lg shadow-md')}>
    <h2 className={cn('mb-4', 'text-xl font-semibold')}>Hero Section</h2>
    <div className='space-y-4'>
      <div>
        <label htmlFor='heroHeadline' className={cn('block', 'mb-2', 'text-sm font-medium')}>
          Headline
        </label>
        <input
          id='heroHeadline'
          type='text'
          value={heroHeadline}
          onChange={e => onChange('heroHeadline', e.target.value)}
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
        <label htmlFor='heroSubheadline' className={cn('block', 'mb-2', 'text-sm font-medium')}>
          Subheadline
        </label>
        <input
          id='heroSubheadline'
          type='text'
          value={heroSubheadline}
          onChange={e => onChange('heroSubheadline', e.target.value)}
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
  </section>
)

export default HeroSection
