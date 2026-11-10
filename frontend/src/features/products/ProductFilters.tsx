import type { ProductFilterOption } from '../../types/product'
import './ProductFilters.css'

interface ProductFiltersProps {
  brands: ProductFilterOption[]
  categories: ProductFilterOption[]
  selectedBrand: number | null
  selectedCategory: number | null
  onBrandChange: (id: number | null) => void
  onCategoryChange: (id: number | null) => void
}

export default function ProductFilters({
  brands,
  categories,
  selectedBrand,
  selectedCategory,
  onBrandChange,
  onCategoryChange,
}: ProductFiltersProps) {
  return (
    <div className="product-filters">
      <div className="product-filter-field">
        <label htmlFor="brand-filter">Marca</label>

        <select
          id="brand-filter"
          value={selectedBrand ?? ''}
          onChange={(event) =>
            onBrandChange(
              event.target.value
                ? Number(event.target.value)
                : null
            )
          }
        >
          <option value="">Todas las marcas</option>

          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div className="product-filter-field">
        <label htmlFor="category-filter">Categoría</label>

        <select
          id="category-filter"
          value={selectedCategory ?? ''}
          onChange={(event) =>
            onCategoryChange(
              event.target.value
                ? Number(event.target.value)
                : null
            )
          }
        >
          <option value="">Todas las categorías</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}