import { Link } from 'react-router'
import './SuccessStoriesPage.css'
export default function SuccessStoriesPage() {
  return (
    <section
      className="catalog-page"
      aria-labelledby="success-stories-title"
    >
      <span className="catalog-eyebrow">
        NUESTROS PROYECTOS
      </span>

      <h1 id="success-stories-title">
        Casos de éxito
      </h1>

      <p className="catalog-description">
        Un espacio para conocer proyectos,
        experiencias y soluciones de construcción
        en los que participa Corporación Azul.
      </p>

      <div className="success-stories-empty">
        <h2>Aún no hay casos publicados</h2>

        <p>
          Estamos preparando esta sección para
          compartir proyectos documentados.
        </p>

        <Link to="/productos" className="btn-primary">
          Explorar productos
        </Link>
      </div>
    </section>
  )
}