import { cn } from '@angel-portfolio/shared'

type AboutSectionProps = {
  title: string
  content: string
}

export const AboutSection = ({ title, content }: AboutSectionProps) => {
  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim())

  return (
    <section
      id='about'
      className={cn('pt-10 pb-5 md:pb-20 px-6 md:px-10 desktop:px-20', 'bg-oathfire')}
    >
      <div className='max-w-[1112px] mx-auto'>
        <div
          className={cn(
            'flex flex-col',
            'gap-6 md:gap-10 p-6 md:p-10 desktop:p-20',
            'bg-earthward',
            'rounded-[12px]',
          )}
        >
          <h2
            className={cn(
              'text-[28px] md:text-[32px] desktop:text-[40px] font-light italic text-moon-paper',
            )}
          >
            {title}
          </h2>
          <div className={cn('text-[16px] md:text-[20px] italic text-moon-paper leading-normal')}>
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 50)}
                className={index < paragraphs.length - 1 ? 'mb-5' : ''}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
