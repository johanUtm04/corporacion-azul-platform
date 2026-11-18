import type { ButtonHTMLAttributes } from 'react'
import './Button.css'

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
}

export default function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`ui-button ui-button--${variant} ${className}`.trim()}
    />
  )
}