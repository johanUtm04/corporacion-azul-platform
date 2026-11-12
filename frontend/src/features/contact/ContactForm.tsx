import { useState, type FormEvent } from 'react'
import {
  contactSchema,
  contactSubjects,
  mexicoStates,
} from './contactSchema'
import {
  ContactApiError,
  submitContact,
} from '../../services/api/contact'
import './ContactForm.css'

//Rehusable Components
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import Textarea from '../../components/ui/Textarea/Textarea'
import SectionLoader from '../../components/ui/SectionLoader/SectionLoader'

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  state: '',
  subject: '',
  message: '',
  privacy_accepted: false,
}

type Field = keyof typeof initialValues
type FieldErrors = Partial<Record<Field, string>>

const textFields = [
  { name: 'first_name', label: 'Nombre', type: 'text', autoComplete: 'given-name' },
  { name: 'last_name', label: 'Apellidos', type: 'text', autoComplete: 'family-name' },
  { name: 'email', label: 'Correo electrónico', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Teléfono', type: 'tel', autoComplete: 'tel' },
] as const

const stateOptions = mexicoStates.map((state) => ({
  value: state,
  label: state,
}))

const subjectOptions = contactSubjects.map((subject) => ({
  value: subject,
  label: subject,
}))

export default function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  function updateField<K extends Field>(
    field: K,
    value: (typeof initialValues)[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))

    setFeedback(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setFeedback(null)
    setErrors({})

    const validation = contactSchema.safeParse(values)

    if (!validation.success) {
      const nextErrors: FieldErrors = {}

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as Field

        if (field in initialValues && !nextErrors[field]) {
          nextErrors[field] = issue.message
        }
      })

      setErrors(nextErrors)
      return
    }

    setSubmitting(true)

    try {
      await submitContact(validation.data)

      setValues({ ...initialValues })
      setFeedback({
        type: 'success',
        message: 'Tu mensaje se envió correctamente. Gracias por contactarnos.',
      })
    } catch (error) {
      if (error instanceof ContactApiError) {
        const serverErrors: FieldErrors = {}

        Object.entries(error.fieldErrors).forEach(([field, messages]) => {
          if (field in initialValues && messages.length > 0) {
            serverErrors[field as Field] = messages[0]
          }
        })

        setErrors(serverErrors)
        setFeedback({
          type: 'error',
          message: error.message,
        })
      } else {
        setFeedback({
          type: 'error',
          message: 'Ocurrió un error inesperado.',
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="contact-form-grid">
        {textFields.map((field) => (
          <Input
            key={field.name}
            id={`contact-${field.name}`}
            label={`${field.label} *`}
            type={field.type}
            autoComplete={field.autoComplete}
            value={values[field.name]}
            onChange={(event) =>
              updateField(field.name, event.target.value)
            }
            error={errors[field.name]}
            disabled={submitting}
          />
        ))}
        <Select
          id="contact-state"
          label="Estado *"
          options={stateOptions}
          placeholder="Selecciona tu estado"
          value={values.state}
          onChange={(event) =>
            updateField('state', event.target.value)
          }
          error={errors.state}
          disabled={submitting}
        />

        <Select
          id="contact-subject"
          label="Asunto *"
          options={subjectOptions}
          placeholder="Selecciona un asunto"
          value={values.subject}
          onChange={(event) =>
            updateField('subject', event.target.value)
          }
          error={errors.subject}
          disabled={submitting}
        />
      </div>

      <Textarea
        id="contact-message"
        label="Mensaje *"
        rows={6}
        maxLength={3000}
        value={values.message}
        onChange={(event) =>
          updateField('message', event.target.value)
        }
        error={errors.message}
        disabled={submitting}
        placeholder="Cuéntanos cómo podemos ayudarte..."
      />

      <div className="contact-privacy">
        <label>
          <input
            type="checkbox"
            checked={values.privacy_accepted}
            onChange={(event) =>
              updateField('privacy_accepted', event.target.checked)
            }
            disabled={submitting}
          />
          He leído y acepto el Aviso de Privacidad.
        </label>

        {errors.privacy_accepted && (
          <span className="contact-field-error">
            {errors.privacy_accepted}
          </span>
        )}
      </div>

      <Button
        variant="primary"
        type="submit"
        disabled={submitting}
      >
        {submitting ? 'Enviando mensaje...' : 'Enviar mensaje'}
      </Button>

      {submitting && (
        <SectionLoader section="contact" />
      )}

      {feedback && (
        <p
          className={`contact-feedback contact-feedback-${feedback.type}`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
        >
          {feedback.message}
        </p>
      )}
    </form>
  )
}