type HamburgerIconProps = {
  className?: string
  onClick?: () => void
}

export const HamburgerIcon = ({ className, onClick }: HamburgerIconProps) => (
  <button type='button' onClick={onClick} className={className} aria-label='Open menu'>
    <svg
      width='48'
      height='48'
      viewBox='0 0 48 48'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      {/* Three horizontal lines for hamburger menu */}
      <line x1='8' y1='14' x2='40' y2='14' stroke='#AE8237' strokeWidth='2' strokeLinecap='round' />
      <line x1='8' y1='24' x2='40' y2='24' stroke='#AE8237' strokeWidth='2' strokeLinecap='round' />
      <line x1='8' y1='34' x2='40' y2='34' stroke='#AE8237' strokeWidth='2' strokeLinecap='round' />
    </svg>
  </button>
)
