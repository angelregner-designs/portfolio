type Box = {
  title: string
  content: string
}

type BoxesSectionProps = {
  box1: Box
  box2: Box
}

export const BoxesSection = ({ box1, box2 }: BoxesSectionProps) => (
  <section className='py-16 px-8 bg-gray-50'>
    <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
      <div className='bg-white rounded-lg shadow-md p-8'>
        <h3 className='text-2xl font-bold mb-4'>{box1.title}</h3>
        <p className='text-gray-600'>{box1.content}</p>
      </div>
      <div className='bg-white rounded-lg shadow-md p-8'>
        <h3 className='text-2xl font-bold mb-4'>{box2.title}</h3>
        <p className='text-gray-600'>{box2.content}</p>
      </div>
    </div>
  </section>
)
