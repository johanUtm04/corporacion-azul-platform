import type { ContactFormData } from '../../features/contact/contactSchema'

interface ContactApiResponse {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
}

export class ContactApiError extends Error {
  status: number
  fieldErrors: Record<string, string[]>

  constructor(
    message: string,
    status: number,
    fieldErrors: Record<string, string[]> = {}
  ) {
    super(message)

    this.name = 'ContactApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

export async function submitContact(
  data: ContactFormData
): Promise<string> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  if (!baseUrl) {
    throw new ContactApiError(
      'La API no está configurada.',
      0
    )
  }

  const url = new URL('/api/v1/contact', baseUrl)

  let response: Response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  } catch {
    throw new ContactApiError(
      'No pudimos conectar con el servidor.',
      0
    )
  }

  const result: ContactApiResponse | null =
    await response.json().catch(() => null)

  if (response.status === 422) {
    throw new ContactApiError(
      'Revisa los campos del formulario.',
      422,
      result?.errors ?? {}
    )
  }

  if (response.status === 429) {
    throw new ContactApiError(
      'Demasiados intentos. Intenta nuevamente más tarde.',
      429
    )
  }

  if (response.status === 502 || response.status === 503) {
    throw new ContactApiError(
      'El servicio de contacto no está disponible temporalmente.',
      response.status
    )
  }

  if (!response.ok || result?.success !== true) {
    throw new ContactApiError(
      'No pudimos enviar tu mensaje. Intenta nuevamente.',
      response.status
    )
  }

  return result.message ?? 'Mensaje enviado correctamente.'
}
