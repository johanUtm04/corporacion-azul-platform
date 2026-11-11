import { z } from 'zod'

export const mexicoStates = [
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Ciudad de México',
  'Coahuila',
  'Colima',
  'Durango',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Estado de México',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
] as const

export const contactSubjects = [
  'Solicitar cotización',
  'Información de productos',
  'Consultar sucursales y cobertura',
  'Pedidos y entregas',
  'Atención al cliente',
  'Otro asunto',
] as const

export const contactSchema = z.object({
  first_name: z.string().trim()
    .min(1, 'Ingresa tu nombre.')
    .max(100, 'Máximo 100 caracteres.'),

  last_name: z.string().trim()
    .min(1, 'Ingresa tus apellidos.')
    .max(100, 'Máximo 100 caracteres.'),

  email: z.email('Ingresa un correo válido.')
    .max(255, 'Máximo 255 caracteres.'),

  phone: z.string().trim()
    .min(1, 'Ingresa tu teléfono.')
    .max(30, 'Máximo 30 caracteres.'),

  state: z.enum(mexicoStates, {
    error: 'Selecciona un estado válido.',
  }),

  subject: z.enum(contactSubjects, {
    error: 'Selecciona un asunto válido.',
  }),

  message: z.string().trim()
    .min(1, 'Escribe tu mensaje.')
    .max(3000, 'Máximo 3000 caracteres.'),

  privacy_accepted: z.literal(true, {
    error: 'Debes aceptar el aviso de privacidad.',
  }),
})

export type ContactFormData = z.infer<typeof contactSchema>