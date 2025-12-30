import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DecorativeLogo } from './DecorativeLogo'

const meta: Meta<typeof DecorativeLogo> = {
  component: DecorativeLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DecorativeLogo>

// Default view on light background
export const Default: Story = {}

// On burgundy background (as used in hero section)
export const OnBurgundyBackground: Story = {
  decorators: [
    Story => (
      <div className='bg-[#770B1B] p-10'>
        <Story />
      </div>
    ),
  ],
}

// On dark background
export const OnDarkBackground: Story = {
  decorators: [
    Story => (
      <div className='bg-black p-10'>
        <Story />
      </div>
    ),
  ],
}
