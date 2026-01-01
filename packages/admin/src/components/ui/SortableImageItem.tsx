'use client'

import { cn } from '@angel-portfolio/shared'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'

type SortableImageItemProps = {
  id: string
  children: ReactNode
}

// Compact sortable wrapper for image items in a list
const SortableImageItem = ({ id, children }: SortableImageItemProps) => {
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
      className={cn(
        'flex items-center gap-2',
        isDragging && 'z-10 opacity-90 shadow-lg bg-white rounded',
      )}
    >
      {/* Inline drag handle */}
      <button
        type='button'
        {...attributes}
        {...listeners}
        className={cn(
          'flex-shrink-0',
          'p-1',
          'cursor-grab',
          'rounded',
          'hover:bg-gray-100',
          'active:cursor-grabbing',
        )}
        aria-label='Drag to reorder'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className={cn('h-4 w-4', 'text-gray-400')}
          aria-hidden='true'
        >
          <circle cx='9' cy='6' r='1.5' />
          <circle cx='15' cy='6' r='1.5' />
          <circle cx='9' cy='12' r='1.5' />
          <circle cx='15' cy='12' r='1.5' />
          <circle cx='9' cy='18' r='1.5' />
          <circle cx='15' cy='18' r='1.5' />
        </svg>
      </button>
      {children}
    </div>
  )
}

export default SortableImageItem
