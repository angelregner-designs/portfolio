'use client'

import { cn } from '@angel-portfolio/shared'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'

type SortableItemProps = {
  id: string
  children: ReactNode
  className?: string
}

// Drag handle icon (6-dot grip)
const DragHandle = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='currentColor'
    className={cn('h-5 w-5', 'text-gray-400', className)}
    aria-hidden='true'
  >
    <circle cx='9' cy='6' r='1.5' />
    <circle cx='15' cy='6' r='1.5' />
    <circle cx='9' cy='12' r='1.5' />
    <circle cx='15' cy='12' r='1.5' />
    <circle cx='9' cy='18' r='1.5' />
    <circle cx='15' cy='18' r='1.5' />
  </svg>
)

// Wrapper for sortable items with drag handle
const SortableItem = ({ id, children, className }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('relative', isDragging && 'z-10 opacity-90 shadow-lg', className)}
    >
      {/* Drag handle - positioned at top left of item */}
      <button
        type='button'
        {...attributes}
        {...listeners}
        className={cn(
          'absolute top-4 left-2',
          'p-1',
          'cursor-grab',
          'rounded',
          'hover:bg-gray-100',
          'active:cursor-grabbing',
        )}
        aria-label='Drag to reorder'
      >
        <DragHandle />
      </button>
      {children}
    </div>
  )
}

export default SortableItem
