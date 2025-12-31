import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Sticky } from './Sticky'

const meta: Meta<typeof Sticky> = {
  component: Sticky,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    topOffset: {
      control: { type: 'number', min: 0, max: 200 },
      description: 'Distance from viewport top when sticky',
    },
  },
}

export default meta
type Story = StoryObj<typeof Sticky>

// 2K monitor height is 1440px, use 2x for scroll testing
const SCROLL_HEIGHT = 2880

// Wrapper to create scrollable area for testing
const ScrollableWrapper = ({
  children,
  stickyPosition = 'middle',
}: {
  children: React.ReactNode
  stickyPosition?: 'top' | 'middle'
}) => (
  <div style={{ minHeight: SCROLL_HEIGHT }} className='bg-gray-800 p-8'>
    <p className='text-gray-300 mb-4'>Scroll down to see sticky behavior</p>
    {stickyPosition === 'top' && children}
    {stickyPosition === 'middle' && (
      <>
        <div className='h-[500px] bg-blue-900 rounded-lg p-4 mb-4'>
          <p className='text-blue-200'>Content before sticky element</p>
        </div>
        {children}
      </>
    )}
    <div style={{ height: SCROLL_HEIGHT - 600 }} className='bg-green-900 rounded-lg p-4 mt-4'>
      <p className='text-green-200'>Content after sticky element (scroll to test)</p>
    </div>
  </div>
)

// Default sticky behavior
export const Default: Story = {
  args: {
    topOffset: 0,
    children: (
      <div className='bg-red-500 p-4 rounded shadow-lg'>I become sticky when scrolled to top</div>
    ),
  },
  decorators: [
    Story => (
      <ScrollableWrapper>
        <Story />
      </ScrollableWrapper>
    ),
  ],
}

// With top offset
export const WithTopOffset: Story = {
  args: {
    topOffset: 20,
    children: <div className='bg-purple-500 p-4 rounded shadow-lg'>I stick 20px from top</div>,
  },
  decorators: [
    Story => (
      <ScrollableWrapper>
        <Story />
      </ScrollableWrapper>
    ),
  ],
}

// Large offset
export const LargeOffset: Story = {
  args: {
    topOffset: 100,
    children: <div className='bg-orange-500 p-4 rounded shadow-lg'>I stick 100px from top</div>,
  },
  decorators: [
    Story => (
      <ScrollableWrapper>
        <Story />
      </ScrollableWrapper>
    ),
  ],
}

// Sticky from top of page
export const StickyFromTop: Story = {
  args: {
    topOffset: 0,
    children: (
      <div className='bg-teal-500 p-4 rounded shadow-lg'>Header-like sticky (from page top)</div>
    ),
  },
  decorators: [
    Story => (
      <ScrollableWrapper stickyPosition='top'>
        <Story />
      </ScrollableWrapper>
    ),
  ],
}

// Complex children
export const ComplexChildren: Story = {
  args: {
    topOffset: 10,
    children: (
      <nav className='bg-gray-900 border border-gray-700 rounded-lg shadow-md p-4 flex gap-4'>
        <button type='button' className='px-3 py-1 bg-blue-500 rounded'>
          Home
        </button>
        <button type='button' className='px-3 py-1 bg-gray-700 rounded'>
          About
        </button>
        <button type='button' className='px-3 py-1 bg-gray-700 rounded'>
          Contact
        </button>
      </nav>
    ),
  },
  decorators: [
    Story => (
      <ScrollableWrapper>
        <Story />
      </ScrollableWrapper>
    ),
  ],
}

// Centered content to test left positioning
export const CenteredContent: Story = {
  args: {
    topOffset: 0,
    className: 'max-w-md mx-auto',
    children: (
      <div className='bg-indigo-500 p-4 rounded shadow-lg text-center'>
        Centered sticky element - maintains position when sticky
      </div>
    ),
  },
  decorators: [
    Story => (
      <ScrollableWrapper>
        <Story />
      </ScrollableWrapper>
    ),
  ],
}

// Right-aligned to test position tracking
export const RightAligned: Story = {
  args: {
    topOffset: 20,
    className: 'w-64 ml-auto',
    children: <div className='bg-pink-500 p-4 rounded shadow-lg'>Right-aligned sticky</div>,
  },
  decorators: [
    Story => (
      <ScrollableWrapper>
        <Story />
      </ScrollableWrapper>
    ),
  ],
}

// Flex child to test position tracking in flex containers
export const FlexChild: Story = {
  args: {
    topOffset: 16,
    children: <div className='bg-cyan-500 p-4 rounded shadow-lg'>Sticky in flex layout</div>,
  },
  render: args => (
    <div style={{ minHeight: SCROLL_HEIGHT }} className='bg-gray-800 p-8'>
      <p className='text-gray-300 mb-4'>Scroll down to see sticky behavior in flex layout</p>
      <div className='h-[500px] bg-blue-900 rounded-lg p-4 mb-4'>
        <p className='text-blue-200'>Content before flex container</p>
      </div>
      <div className='flex gap-4'>
        <div className='flex-1 bg-gray-700 rounded-lg p-4'>
          <p className='text-gray-300'>Left column (non-sticky)</p>
        </div>
        <Sticky {...args} className='flex-1' />
        <div className='flex-1 bg-gray-700 rounded-lg p-4'>
          <p className='text-gray-300'>Right column (non-sticky)</p>
        </div>
      </div>
      <div style={{ height: SCROLL_HEIGHT - 600 }} className='bg-green-900 rounded-lg p-4 mt-4'>
        <p className='text-green-200'>Content after flex container (scroll to test)</p>
      </div>
    </div>
  ),
}
