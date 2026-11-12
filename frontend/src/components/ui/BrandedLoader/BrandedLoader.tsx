import './BrandedLoader.css'

interface BrandedLoaderProps {
  message?: string
}

export default function BrandedLoader({
  message = 'Preparando tu experiencia...',
}: BrandedLoaderProps) {
  return (
    <div className="branded-loader" role="status">
      <div className="branded-loader-content">
        <img
          src="/images/mascots/cruzazulito-base.png"
          alt=""
          className="branded-loader-mascot"
        />

        <p>{message}</p>

        <div className="branded-loader-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  )
}