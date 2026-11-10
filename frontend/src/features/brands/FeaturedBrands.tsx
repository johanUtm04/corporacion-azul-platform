import { Link } from 'react-router'
import './FeaturedBrands.css'

const brands = [
  'Cruz Azul',
  'CEMIX',
  'SIKA',
  'ROTOPLAS',
  'DEACERO',
  'CREST',
]

export default function FeaturedBrands() {
  return (
    <section
      className="featured-brands"
      aria-labelledby="featured-brands-title"
    >
      <div className="featured-brands-header">
        <div>
          <span className="featured-brands-eyebrow">
            NUESTRO PORTAFOLIO
          </span>

          <h2 id="featured-brands-title">
            Marcas que acompañan
            <span> cada proyecto.</span>
          </h2>

          <p>
            Conoce algunas de las marcas que forman
            parte de nuestra oferta de materiales
            y soluciones para construcción.
          </p>
        </div>

        <Link to="/marcas" className="featured-brands-link">
          Explorar marcas
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <ul className="featured-brands-grid">
        {brands.map((brand, index) => (
          <li className="brand-card" key={brand}>
            <span className="brand-card-number">
              {String(index + 1).padStart(2, '0')}
            </span>

            <h3>{brand}</h3>

            <span className="brand-card-accent" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </section>
  )
}