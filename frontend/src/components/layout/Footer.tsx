import { NavLink } from 'react-router'

const footerLinks = [
  { label: 'Inicio', path: '/' },
  { label: 'Productos', path: '/productos' },
  { label: 'Marcas', path: '/marcas' },
  { label: 'Nosotros', path: '/nosotros' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <NavLink
            to="/"
            className="footer-logo"
            aria-label="Corporación Azul - Inicio"
          >
            <img
              src="/images/corporacion-azul-logo.webp"
              alt="Corporación Azul"
            />
          </NavLink>

          <p>
            Materiales, marcas y soluciones para
            acompañar cada proyecto de construcción.
          </p>
        </div>

        <div className="footer-column">
          <h3>Explorar</h3>

          {footerLinks.map((link) => (
            <NavLink key={link.path} to={link.path}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="footer-column">
          <h3>Estamos para ayudarte</h3>

          <NavLink to="/sucursales">Sucursales</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
          <NavLink to="/casos-de-exito">
            Casos de éxito
          </NavLink>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Corporación Azul.
          Todos los derechos reservados.
        </span>
      </div>
    </footer>
  )
}