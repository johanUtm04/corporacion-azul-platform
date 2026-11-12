import Skeleton from '../../components/ui/Skeleton/Skeleton'
import './ProductGridSkeleton.css'

interface ProductGridSkeletonProps {
  count?: number
}

export default function ProductGridSkeleton({
  count = 6,
}: ProductGridSkeletonProps) {
  return (
    <div role="status">
      <span className="product-skeleton-sr-only">
        Cargando productos...
      </span>

      <div className="product-grid" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="product-skeleton-card"
          >
            {/* Product image */}
            <div className="product-skeleton-media">
              <Skeleton height="100%" />
            </div>

            {/* Brand and product ID */}
            <div className="product-skeleton-top">
              <Skeleton width="35%" height={14} />
              <Skeleton width="12%" height={12} />
            </div>

            {/* Category and product name */}
            <div className="product-skeleton-content">
              <Skeleton width="45%" height={12} />
              <Skeleton width="90%" height={24} />
              <Skeleton width="65%" height={24} />
            </div>

            {/* Contact link */}
            <Skeleton width="55%" height={16} />
          </div>
        ))}
      </div>
    </div>
  )
}