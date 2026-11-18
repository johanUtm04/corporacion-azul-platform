import './SectionLoader.css'

type LoaderSection = 'home' | 'products' | 'contact' | 'branches'

interface SectionLoaderProps {
  section: LoaderSection
  message?: string
  fullscreen?: boolean
}

const messages: Record<LoaderSection, string> = {
  products: 'Preparando nuestros productos...',
  contact: 'Enviando tu mensaje...',
  branches: 'Buscando nuestras sucursales...',
  home: 'Preparando tu experiencia...',
}

export default function SectionLoader({
  section,
  message,
  fullscreen = false,
}: SectionLoaderProps) {
  const mascotSrc =
  section === 'contact'
    ? '/images/mascots/cruzazulito-contact.webp'
    : '/images/mascots/cruzazulito-base.png'
  return (
    <div
      className={`section-loader section-loader--${section} ${
        fullscreen ? 'section-loader--fullscreen' : ''
      }`}
      role="status"
      aria-live="polite"
    >

      {section === 'home' ? (
        <picture>
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet="/images/mascots/cruzazulito-home.png"
          />
          <source
            type="image/webp"
            srcSet="/images/mascots/cruzazulito-home.webp"
          />
          <img
            src="/images/mascots/cruzazulito-home.gif"
            alt=""
            className="section-loader-mascot"
          />
        </picture>
      ) : (
        <img
          src={mascotSrc}
          alt=""
          className="section-loader-mascot"
        />
      )}
      <div className="section-loader-info">
        <p className="section-loader-message">
          {message ?? messages[section]}
        </p>

        <div className="section-loader-track" aria-hidden="true">
          <span className="section-loader-progress" />
        </div>
      </div>
    </div>
  )
}