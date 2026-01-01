import { cn } from '@angel-portfolio/shared'

type FooterProps = {
  copyright: string
}

export const Footer = ({ copyright }: FooterProps) => (
  <footer className={cn('pt-50 pb-43 px-10 desktop:px-20', 'bg-oathfire')}>
    <div className={cn('flex flex-col items-center', 'max-w-[1280px] mx-auto', 'gap-8')}>
      {/* Copyright */}
      <p className={cn('text-[14px] text-moon-paper/70 text-center')}>{copyright}</p>
    </div>
  </footer>
)
