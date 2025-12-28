import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'md'
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'font-lato rounded-full transition-colors cursor-pointer'

  const variants = {
    primary: 'bg-gold text-burgundy-dark hover:bg-gold-light',
    outline: 'border border-gold text-gold hover:bg-gold hover:text-burgundy-dark',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-5 py-2 text-xs',
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
