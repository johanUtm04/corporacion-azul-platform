import './SectionLoader.css'

type LoaderSection = 'products' | 'contact' | 'branches'

interface SectionLoaderProps {
  section: LoaderSection
  message?: string
}

const messages: Record<LoaderSection, string> = {
  products: 'Preparando nuestros productos...',
  contact: 'Enviando tu mensaje...',
  branches: 'Buscando nuestras sucursales...',
}

export default function SectionLoader({
  section,
  message,
}: SectionLoaderProps) {
  return (
    <div
      className={`section-loader section-loader--${section}`}
      role="status"
      aria-live="polite"
    >
      <img
        src="/images/mascots/cruzazulito-base.png"
        alt=""
        className="section-loader-mascot"
      />

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