import { cn } from '@angel-portfolio/shared'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useEffect, useState } from 'react'
import { DecorativeLogo } from './DecorativeLogo'

const meta: Meta<typeof DecorativeLogo> = {
  component: DecorativeLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isExpanded: {
      control: 'boolean',
      description: 'When true, frames collapse and eyelids/pupil scale up',
    },
    isEyeOpen: {
      control: 'boolean',
      description: 'Controls eye open/close state. When undefined, auto-blinks',
    },
    shouldFollowMouse: {
      control: 'boolean',
      description: 'When true, pupil follows mouse position',
    },
    lookAtRandomDirectionCounter: {
      control: 'number',
      description: 'Increment to trigger pupil to look at random direction',
    },
  },
}

export default meta
type Story = StoryObj<typeof DecorativeLogo>

// Default view with auto-blinking
export const Default: Story = {}

// Expanded state
export const Expanded: Story = {
  args: {
    isExpanded: true,
  },
}

// Eye closed state
export const EyeClosed: Story = {
  args: {
    isEyeOpen: false,
  },
}

// Interactive expand toggle demo
export const InteractiveExpand: Story = {
  render: () => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
      <div className='flex flex-col items-center gap-8'>
        <button
          type='button'
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn('px-4 py-2', 'text-white bg-blue-500', 'rounded', 'hover:bg-blue-600')}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
        <div className='w-[200px]'>
          <DecorativeLogo isExpanded={isExpanded} className='w-full' />
        </div>
      </div>
    )
  },
}

// Interactive blink control demo
export const InteractiveBlink: Story = {
  render: () => {
    const [isEyeOpen, setIsEyeOpen] = useState(true)

    return (
      <div className='flex flex-col items-center gap-8'>
        <button
          type='button'
          onClick={() => setIsEyeOpen(!isEyeOpen)}
          className={cn('px-4 py-2', 'text-white bg-blue-500', 'rounded', 'hover:bg-blue-600')}
        >
          {isEyeOpen ? 'Close Eye' : 'Open Eye'}
        </button>
        <div className='w-[200px]'>
          <DecorativeLogo isEyeOpen={isEyeOpen} className='w-full' />
        </div>
      </div>
    )
  },
}

// Auto-toggling expand animation demo
export const AutoToggleExpand: Story = {
  render: () => {
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
      const interval = setInterval(() => {
        setIsExpanded(prev => !prev)
      }, 2000)
      return () => clearInterval(interval)
    }, [])

    return (
      <div className='w-[200px]'>
        <DecorativeLogo isExpanded={isExpanded} className='w-full' />
      </div>
    )
  },
}

export const OnDevLayout: Story = {
  decorators: [
    Story => (
      <div className='w-200 bg-neutral-500'>
        <Story />
      </div>
    ),
  ],
  args: {
    className: 'w-full h-full',
  },
}

// Pupil follows mouse
export const FollowMouse: Story = {
  args: {
    shouldFollowMouse: true,
  },
  decorators: [
    Story => (
      <div className='w-[200px]'>
        <p className={cn('mb-4', 'text-sm text-gray-500 text-center')}>Move mouse around</p>
        <Story />
      </div>
    ),
  ],
}

// Interactive random direction trigger
export const InteractiveRandomLook: Story = {
  render: () => {
    const [counter, setCounter] = useState(0)

    return (
      <div className='flex flex-col items-center gap-8'>
        <button
          type='button'
          onClick={() => setCounter(c => c + 1)}
          className={cn('px-4 py-2', 'text-white bg-blue-500', 'rounded', 'hover:bg-blue-600')}
        >
          Look Random Direction ({counter})
        </button>
        <div className='w-[200px]'>
          <DecorativeLogo lookAtRandomDirectionCounter={counter} className='w-full' />
        </div>
      </div>
    )
  },
}

// Toggle follow mouse demo
export const InteractiveFollowMouse: Story = {
  render: () => {
    const [shouldFollow, setShouldFollow] = useState(false)

    return (
      <div className='flex flex-col items-center gap-8'>
        <button
          type='button'
          onClick={() => setShouldFollow(!shouldFollow)}
          className={cn('px-4 py-2', 'text-white bg-blue-500', 'rounded', 'hover:bg-blue-600')}
        >
          {shouldFollow ? 'Stop Following' : 'Follow Mouse'}
        </button>
        <div className='w-[200px]'>
          <DecorativeLogo shouldFollowMouse={shouldFollow} className='w-full' />
        </div>
      </div>
    )
  },
}
