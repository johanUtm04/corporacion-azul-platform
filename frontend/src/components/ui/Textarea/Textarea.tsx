import type { TextareaHTMLAttributes } from 'react'
import './Textarea.css'

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label: string
  error?: string
}

export default function Textarea({
  id,
  label,
  error,
  className = '',
  ...props
}: TextareaProps) {
  const errorId = `${id}-error`

  return (
    <div className="ui-textarea-field">
      <label htmlFor={id}>{label}</label>

      <textarea
        {...props}
        id={id}
        className={`ui-textarea ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={
          [props['aria-describedby'], error ? errorId : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
      />

      {error && (
        <span id={errorId} className="ui-textarea-error">
          {error}
        </span>
      )}
    </div>
  )
}