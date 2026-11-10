import { useState } from 'react'
import { Link } from 'react-router'
import type { Product } from '../../types/product'

type ProductCardProps = {
  product: Product
}

// Temporary local images, indexed by WordPress product ID.
const productImages: Record<number, string> = {
  10: '/images/products/cemento-cruz-azul-50kg.webp',
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageSrc = productImages[product.id]

  return (
    <article className="product-card">
      <div className="product-card-media">
        {imageSrc && !imageFailed ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="product-card-image"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="product-card-placeholder">
            <span>Imagen no disponible</span>
          </div>
        )}
      </div>

      <div className="product-card-top">
        <span className="product-card-brand">
          {product.brand ?? 'Sin marca'}
        </span>
        <span className="product-card-id">
          #{product.id}
        </span>
      </div>

      <div className="product-card-content">
        <span className="product-card-category">
          {product.categories.join(' · ') || 'Sin categoría'}
        </span>
        <h2>{product.name}</h2>
      </div>

      <Link to="/contacto" className="product-card-link">
        Solicitar información
        <span aria-hidden="true">↗</span>
      </Link>
    </article>
  )
}