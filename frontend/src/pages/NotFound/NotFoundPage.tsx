import './NotFoundPage.css'
import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section className="catalog-page not-found-page" aria-labelledby="not-found-title">
      <span className="catalog-eyebrow">ERROR 404</span>

      <h1 id="not-found-title">Página no encontrada</h1>

      <p className="catalog-description">
        Lo sentimos, la página que buscas no existe
        o ha cambiado de dirección.
      </p>

      <Link to="/" className="btn-primary">
        Volver al inicio
      </Link>
    </section>
  )
}