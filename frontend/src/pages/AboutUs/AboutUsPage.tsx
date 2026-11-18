import { Link } from 'react-router'
import './AboutUsPage.css'
export default function AboutUsPage() {
  return (
    <section
      className="catalog-page"
      aria-labelledby="about-title"
    >
      <span className="catalog-eyebrow">
        CONÓCENOS
      </span>

      <h1 id="about-title">Nosotros</h1>

      <p className="catalog-description">
        Conoce más sobre Corporación Azul,
        nuestras marcas y las soluciones
        que ofrecemos para proyectos de construcción.
      </p>

      <div className="about-content">
        <h2>Conoce Corporación Azul</h2>

        <p>
          Estamos preparando esta sección
          para compartir más información
          sobre nuestra empresa y su trayectoria.
        </p>

        <div className="about-actions">
          <Link to="/marcas" className="btn-primary">
            Explorar marcas
          </Link>

          <Link to="/sucursales" className="about-secondary">
            Ver sucursales →
          </Link>
        </div>
      </div>
    </section>
  )
}