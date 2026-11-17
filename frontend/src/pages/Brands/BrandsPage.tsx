import { useEffect, useState } from 'react'

import { getProductFilters } from '../../services/api/products'
import type { ProductFilterOption } from '../../types/product'
import { Link } from 'react-router'
import './BrandsPage.css'

export default function BrandsPage() {
  const [brands, setBrands] = useState<ProductFilterOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getProductFilters()
      .then((response) => {
        if (active) {
          setBrands(response.brands)
        }
      })
      .catch(() => {
        if (active) {
          setError('No pudimos cargar las marcas.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <section
      className="catalog-page"
      aria-labelledby="brands-title"
    >
      <span className="catalog-eyebrow">
        NUESTRO PORTAFOLIO
      </span>

      <h1 id="brands-title">Nuestras marcas</h1>

      <p className="catalog-description">
        Conoce las marcas que forman parte de nuestra
        oferta de materiales y soluciones para construcción.
      </p>

      {loading && (
        <p role="status">Cargando marcas...</p>
      )}

      {error && (
        <p role="alert">{error}</p>
      )}

      {!loading && !error && brands.length === 0 && (
        <p>No hay marcas disponibles por el momento.</p>
      )}

      {!loading && !error && brands.length > 0 && (
        <ul className="brands-grid">
        {brands.map((brand) => (
          <li key={brand.id} className="brands-card">
            <Link
              to={`/productos?brand=${brand.id}`}
              className="brands-card-link"
            >
              {brand.logo_url && (
                <img
                  src={brand.logo_url}
                  alt=""
                  className="brands-card-logo"
                  loading="lazy"
                  decoding="async"
                />
              )}

              <h2>{brand.name}</h2>

              <span className="brands-card-action">
                Ver productos <span aria-hidden="true">↗</span>
              </span>
            </Link>
          </li>
        ))}
        </ul>
      )}
    </section>
  )
}