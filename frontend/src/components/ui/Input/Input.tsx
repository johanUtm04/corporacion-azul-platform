import type { InputHTMLAttributes } from 'react'
import './Input.css'

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
}

export default function Input({
  id,
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  const errorId = `${id}-error`

  return (
    <div className="ui-input-field">
      <label htmlFor={id}>{label}</label>

      <input
        {...props}
        id={id}
        className={`ui-input ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? errorId : props['aria-describedby']
        }
      />

      {error && (
        <span id={errorId} className="ui-input-error">
          {error}
        </span>
      )}
    </div>
  )
}