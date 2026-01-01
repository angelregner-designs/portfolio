type WhyIDesignSectionProps = {
  title: string
  content: string
}

export const WhyIDesignSection = ({ title, content }: WhyIDesignSectionProps) => {
  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim())

  return (
    <section className='pt-10 pb-40 px-20 bg-oathfire'>
      <div className='max-w-[1112px] mx-auto'>
        <div className='bg-golden-sol rounded-[12px] p-20 flex flex-col gap-10'>
          <h2 className='text-[40px] font-light italic text-moon-paper'>{title}</h2>
          <div className='text-[20px] italic text-moon-paper leading-normal'>
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
