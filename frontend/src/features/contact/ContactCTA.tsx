import { Link } from 'react-router'
import './ContactCTA.css'

export default function ContactCTA() {
  return (
    <section
      className="contact-cta"
      aria-labelledby="contact-cta-title"
    >
      <div className="contact-cta-content">
        <span className="contact-cta-eyebrow">
          ESTAMOS PARA AYUDARTE
        </span>

        <h2 id="contact-cta-title">
          Tu próximo proyecto
          <span> comienza aquí.</span>
        </h2>

        <p>
          Encuentra los materiales que necesitas
          y recibe atención para llevar tu proyecto
          al siguiente nivel.
        </p>

        <div className="contact-cta-actions">
          <Link to="/contacto" className="contact-cta-primary">
            Solicitar información
            <span aria-hidden="true">↗</span>
          </Link>

          <Link to="/sucursales" className="contact-cta-secondary">
            Encontrar sucursal
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <span className="contact-cta-decoration" aria-hidden="true">
        CA
      </span>
    </section>
  )
}