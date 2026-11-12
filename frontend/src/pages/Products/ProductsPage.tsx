import { useEffect, useState } from 'react'

import {
  getProducts,
  getProductFilters,
} from '../../services/api/products'

import type {
  ProductListResponse,
  ProductFiltersResponse,
} from '../../types/product'

import ProductGrid from '../../features/products/ProductGrid'
import ProductSearch from '../../features/products/ProductSearch'
import ProductFilters from '../../features/products/ProductFilters'
import ProductPagination from '../../features/products/ProductPagination'
import ProductGridSkeleton from '../../features/products/ProductGridSkeleton'

export default function ProductsPage() {
  const [catalog, setCatalog] = useState<ProductListResponse | null>(null)
  const [filterOptions, setFilterOptions] =
    useState<ProductFiltersResponse | null>(null)

  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtersError, setFiltersError] = useState<string | null>(null)

  // Load brand and category options.
  useEffect(() => {
    let active = true

    getProductFilters()
      .then((result) => {
        if (active) setFilterOptions(result)
      })
      .catch(() => {
        if (active) setFiltersError('No pudimos cargar los filtros.')
      })
      .finally(() => {
        if (active) setFiltersLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  // Load products whenever the page, search or filters change.
  useEffect(() => {
    let active = true

    getProducts({
      page,
      per_page: 12,
      search: search || undefined,
      brand: selectedBrand ?? undefined,
      category: selectedCategory ?? undefined,
    })
      .then((result) => {
        if (active) setCatalog(result)
      })
      .catch(() => {
        if (active) setError('No pudimos cargar los productos.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [page, search, selectedBrand, selectedCategory])

  function prepareNewRequest() {
    setLoading(true)
    setError(null)
    setCatalog(null)
  }

  function handleSearch(nextSearch: string) {
    if (nextSearch === search) return

    prepareNewRequest()
    setPage(1)
    setSearch(nextSearch)
  }

  function handleBrandChange(id: number | null) {
    if (id === selectedBrand) return

    prepareNewRequest()
    setPage(1)
    setSelectedBrand(id)
  }

  function handleCategoryChange(id: number | null) {
    if (id === selectedCategory) return

    prepareNewRequest()
    setPage(1)
    setSelectedCategory(id)
  }

  function handlePageChange(nextPage: number) {
    if (nextPage === page) return

    prepareNewRequest()
    setPage(nextPage)
  }

  return (
    <section className="catalog-page">
      <span className="catalog-eyebrow">
        NUESTRO CATÁLOGO
      </span>

      <h1>Productos</h1>

      <p className="catalog-description">
        Descubre nuestra selección de materiales y
        soluciones para tus proyectos de construcción.
      </p>

      <ProductSearch onSearch={handleSearch} />

      {filtersLoading && (
        <p role="status">Cargando filtros...</p>
      )}

      {filtersError && (
        <p role="alert">{filtersError}</p>
      )}

      {filterOptions && (
        <ProductFilters
          brands={filterOptions.brands}
          categories={filterOptions.categories}
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          onBrandChange={handleBrandChange}
          onCategoryChange={handleCategoryChange}
        />
      )}

      {loading && <ProductGridSkeleton count={6} />}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && catalog && (
        <>
          <p className="catalog-results">
            {catalog.pagination.total} productos encontrados
          </p>

          {catalog.data.length > 0 ? (
            <>
              <ProductGrid products={catalog.data} />

              <ProductPagination
                currentPage={catalog.pagination.page}
                totalPages={catalog.pagination.total_pages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <p>No encontramos productos disponibles.</p>
          )}
        </>
      )}
    </section>
  )
}