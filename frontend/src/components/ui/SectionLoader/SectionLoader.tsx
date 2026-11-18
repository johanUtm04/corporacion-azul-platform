import './SectionLoader.css'

type LoaderSection = 'home' | 'products' |'brands'| 'contact' | 'branches'

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
  brands: 'Preparando nuestras marcas...',
}

export default function SectionLoader({
  section,
  message,
  fullscreen = false,
}: SectionLoaderProps) {
  return (
    <div
      className={`section-loader section-loader--${section} ${
        fullscreen ? 'section-loader--fullscreen' : ''
      }`}
      role="status"
      aria-live="polite"
    >

      {section === 'products' ? (
        <picture>
        <source
          media="(prefers-reduced-motion: reduce)"
          srcSet="/images/mascots/cruzazulito-base.png"
        />
          <img
            src="/images/mascots/cruzazulito-products.gif"
            alt=""
            className="section-loader-mascot"
          />
        </picture>
        ) : section === 'brands' ? (
          <picture>
            <source
              media="(prefers-reduced-motion: reduce)"
              srcSet="/images/mascots/cruzazulito-brands.png"
            />
            <img
              src="/images/mascots/cruzazulito-brands.gif"
              alt=""
              className="section-loader-mascot"
            />
          </picture>
        ) : section === 'home' ? (

      <picture>
        <source
          media="(prefers-reduced-motion: reduce)"
          srcSet="/images/mascots/cruzazulito-base.png"
        />
        <img
          src="/images/mascots/cruzazulito-home.webp"
          alt=""
          className="section-loader-mascot"
        />
      </picture>

      ) : section === 'contact' ? (
        <picture>
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet="/images/mascots/cruzazulito-base.png"
          />
          <img
            src="/images/mascots/cruzazulito-contact.webp"
            alt=""
            className="section-loader-mascot"
          />
        </picture>
      ) : (
        <img
          src="/images/mascots/cruzazulito-base.png"
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