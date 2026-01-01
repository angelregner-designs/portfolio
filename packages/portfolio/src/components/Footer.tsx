import { cn } from '@angel-portfolio/shared'

type FooterProps = {
  copyright: string
}

export const Footer = ({ copyright }: FooterProps) => (
  <footer
    className={cn(
      'pt-10 md:pt-50 pb-6 md:pb-16 desktop:pb-43 px-6 md:px-10 desktop:px-20',
      'bg-oathfire',
    )}
  >
    <div className={cn('flex flex-col items-center', 'max-w-[1280px] mx-auto', 'gap-8')}>
      {/* Copyright */}
      <p className={cn('text-[14px] italic text-moon-paper text-center')}>{copyright}</p>
    </div>
  </footer>
)
