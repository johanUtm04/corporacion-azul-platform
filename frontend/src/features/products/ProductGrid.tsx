import type { Product } from '../../types/product'
import ProductCard from './ProductCard'
import './ProductGrid.css'

type ProductGridProps = {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  )
}