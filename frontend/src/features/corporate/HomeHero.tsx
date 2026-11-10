import { Link } from 'react-router'
import './HomeHero.css'

export default function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <div className="home-hero-content">
        <span className="home-hero-eyebrow">
          CORPORACIÓN AZUL
        </span>

        <h1 id="home-hero-title">
          Materiales para construir
          <span> lo que sigue.</span>
        </h1>

        <p>
          Descubre nuestras marcas, explora materiales
          para tu proyecto y encuentra soluciones
          para cada etapa de construcción.
        </p>

        <div className="home-hero-actions">
          <Link to="/productos" className="btn-primary">
            Explorar productos
            <span aria-hidden="true">↗</span>
          </Link>

          <Link to="/contacto" className="home-hero-secondary">
            Solicitar información
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="home-hero-visual" aria-hidden="true">
        <div className="home-hero-shape home-hero-shape-one" />
        <div className="home-hero-shape home-hero-shape-two" />
        <div className="home-hero-shape home-hero-shape-three" />
      </div>
    </section>
  )
}