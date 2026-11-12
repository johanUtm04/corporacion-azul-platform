import type { SelectHTMLAttributes } from 'react'
import './Select.css'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  id: string
  label: string
  options: readonly SelectOption[]
  placeholder?: string
  error?: string
}

export default function Select({
  id,
  label,
  options,
  placeholder = 'Selecciona una opción',
  error,
  className = '',
  ...props
}: SelectProps) {
  const errorId = `${id}-error`

  return (
    <div className="ui-select-field">
      <label htmlFor={id}>{label}</label>

      <select
        {...props}
        id={id}
        className={`ui-select ${className}`.trim()}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error
            ? [props['aria-describedby'], errorId]
                .filter(Boolean)
                .join(' ')
            : props['aria-describedby']
        }
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span id={errorId} className="ui-select-error">
          {error}
        </span>
      )}
    </div>
  )
}