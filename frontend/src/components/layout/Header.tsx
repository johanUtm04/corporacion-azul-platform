import { useState } from 'react'
import { NavLink } from 'react-router'
import MobileMenu from './MobileMenu'

const navigation = [
  { label: 'Inicio', path: '/' },
  { label: 'Productos', path: '/productos' },
  { label: 'Marcas', path: '/marcas' },
  { label: 'Sucursales', path: '/sucursales' },
  { label: 'Casos de éxito', path: '/casos-de-exito' },
  { label: 'Nosotros', path: '/nosotros' },
  { label: 'Contacto', path: '/contacto' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="site-header">
        <NavLink to="/" className="site-logo" aria-label="Corporación Azul - Inicio">
        <img
            src="/images/corporacion-azul-logo.png"
            alt="Corporación Azul"
        />
        </NavLink>
        <nav className="desktop-nav" aria-label="Navegación principal">
          <ul className="nav-links">
            {navigation.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <NavLink to="/contacto" className="header-cta">
        Solicitar información
        <span aria-hidden="true">↗</span>
        </NavLink>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label="Abrir menú"
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={navigation}
      />
    </>
  )
}