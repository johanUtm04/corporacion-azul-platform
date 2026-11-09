import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router'

type NavigationItem = {
  label: string
  path: string
}

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
  items: NavigationItem[]
}

export default function MobileMenu({
  isOpen,
  onClose,
  items,
}: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      id="mobile-navigation"
      className="mobile-drawer"
      aria-label="Menú principal"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="mobile-drawer-header">
        <NavLink
        to="/"
        className="site-logo"
        aria-label="Corporación Azul - Inicio"
        onClick={onClose}
        >
        <img
            src="/images/corporacion-azul-logo.webp"
            alt="Corporación Azul"
        />
        </NavLink>
        <button
          type="button"
          className="mobile-close"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          ×
        </button>
      </div>

      <nav aria-label="Navegación móvil">
        <ul className="mobile-nav-links">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive ? 'mobile-link active' : 'mobile-link'
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <NavLink
        to="/contacto"
        className="btn-primary mobile-contact"
        onClick={onClose}
      >
        Solicitar información ↗
      </NavLink>
    </dialog>
  )
}