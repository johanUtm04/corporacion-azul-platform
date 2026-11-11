
import ContactForm from '../../features/contact/ContactForm'

export default function ContactPage() {
  return (
    <section className="catalog-page">
      <span className="catalog-eyebrow">
        ESTAMOS PARA AYUDARTE
      </span>

      <h1>Contacto</h1>

      <p className="catalog-description">
        ¿Tienes alguna pregunta sobre nuestros productos,
        sucursales o servicios? Envíanos un mensaje.
      </p>

      <ContactForm />
    </section>
  )
}
