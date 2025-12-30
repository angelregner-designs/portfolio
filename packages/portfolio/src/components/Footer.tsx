type FooterProps = {
  copyright: string
}

export const Footer = ({ copyright }: FooterProps) => (
  <footer className='pt-50 pb-64 px-20 bg-[#770B1B]'>
    <div className='max-w-[1280px] mx-auto flex flex-col items-center gap-8'>
      {/* Copyright */}
      <p className='text-[14px] text-[#F1EDE4]/70 text-center'>{copyright}</p>
    </div>
  </footer>
)
