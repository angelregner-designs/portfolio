# Frontend Rules

## Components
- Apply SRP (single responsibility principle)
  - Extract coherent functionality into separate utilities or hooks
- Keep components small and focused
- Put main component/function first, helpers after
- Move SVG elements to their own components

## Tailwind
- Use Tailwind for styling with CSS variables and theming per Figma design
- Use `cn` utility from `@angel-portfolio/shared` for conditional classes
- Class order: Layout → Sizing → Spacing → Typography → Colors → Effects → States
- Use `cn` when there's more than 3 classes and separate them line by line according to class order
- Example
  ```tsx
  <button
    className={cn(
      'flex items-center justify-center',
      'w-full h-12',
      'px-4 gap-2',
      'text-sm font-semibold',
      'text-white bg-blue-600',
      'rounded-lg shadow-sm transition',
      'hover:bg-blue-700 disabled:opacity-50',
      isActive && 'ring-2 ring-blue-500',
    )}
  />

  // Few classes (3 or less)
  <div className=('flex items-center justify-center') />
  ```

## Animations
- Use Framer Motion for complex animations beyond simple A→B transitions
- Add descriptive comment explaining animation intent

## Figma
- Use Figma MCP when applying design from Figma
- Aim for pixel perfect replication
