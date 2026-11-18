export async function fetchApiJson<T>(url: URL): Promise<T> {
  let response: Response

  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    })
  } catch {
    throw new Error(
      'No pudimos conectar con el servidor. Inténtalo nuevamente.'
    )
  }

  if (response.status === 429) {
    throw new Error(
      'Demasiadas solicitudes. Inténtalo más tarde.'
    )
  }

  if (response.status >= 500) {
    throw new Error(
      'El servicio no está disponible temporalmente.'
    )
  }

  if (!response.ok) {
    throw new Error(
      'No pudimos cargar la información. Inténtalo nuevamente.'
    )
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new Error(
      'El servidor devolvió una respuesta no válida.'
    )
  }
}
