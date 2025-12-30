interface BoxSectionProps {
  box1Title: string
  box1Content: string
  box2Title: string
  box2Content: string
  onChange: (
    field: 'box1Title' | 'box1Content' | 'box2Title' | 'box2Content',
    value: string,
  ) => void
}

const BoxSection = ({
  box1Title,
  box1Content,
  box2Title,
  box2Content,
  onChange,
}: BoxSectionProps) => (
  <section className='bg-white rounded-lg shadow-md p-6 mb-6'>
    <h2 className='text-xl font-semibold mb-4'>Box Sections</h2>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div className='space-y-3'>
        <h3 className='font-medium text-gray-700'>Box 1</h3>
        <div>
          <label htmlFor='box1Title' className='block mb-1 text-sm font-medium'>
            Title
          </label>
          <input
            id='box1Title'
            type='text'
            value={box1Title}
            onChange={e => onChange('box1Title', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
        <div>
          <label htmlFor='box1Content' className='block mb-1 text-sm font-medium'>
            Content
          </label>
          <textarea
            id='box1Content'
            value={box1Content}
            onChange={e => onChange('box1Content', e.target.value)}
            rows={4}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
      </div>
      <div className='space-y-3'>
        <h3 className='font-medium text-gray-700'>Box 2</h3>
        <div>
          <label htmlFor='box2Title' className='block mb-1 text-sm font-medium'>
            Title
          </label>
          <input
            id='box2Title'
            type='text'
            value={box2Title}
            onChange={e => onChange('box2Title', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
        <div>
          <label htmlFor='box2Content' className='block mb-1 text-sm font-medium'>
            Content
          </label>
          <textarea
            id='box2Content'
            value={box2Content}
            onChange={e => onChange('box2Content', e.target.value)}
            rows={4}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
      </div>
    </div>
  </section>
)

export default BoxSection
