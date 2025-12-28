interface LogoProps {
  className?: string
}

const Logo = ({ className = '' }: LogoProps) => (
  <svg
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Left decorative elements */}
    <path d="M8 25H18" stroke="currentColor" strokeWidth="1" />
    <path d="M12 18L18 25L12 32" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M4 18L10 25L4 32" stroke="currentColor" strokeWidth="1" fill="none" />

    {/* Center diamond with eye */}
    <path d="M50 8L70 25L50 42L30 25L50 8Z" stroke="currentColor" strokeWidth="1" fill="none" />
    <ellipse cx="50" cy="25" rx="8" ry="6" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="50" cy="25" r="3" fill="currentColor" />

    {/* Right decorative elements */}
    <path d="M82 25H92" stroke="currentColor" strokeWidth="1" />
    <path d="M88 18L82 25L88 32" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M96 18L90 25L96 32" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
)

export default Logo
