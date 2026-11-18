
import { useEffect, useState } from 'react'
import './ProductsPage.css'
import { useSearchParams } from 'react-router'

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
  // API data
  const [catalog, setCatalog] = useState<ProductListResponse | null>(null)
  const [filterOptions, setFilterOptions] =
    useState<ProductFiltersResponse | null>(null)

  // Search and filters
  const [search, setSearch] = useState('')
  const [searchDraft, setSearchDraft] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [searchParams, setSearchParams] = useSearchParams()

  const brandId = Number(searchParams.get('brand'))

  const selectedBrand =
    Number.isSafeInteger(brandId) && brandId > 0
      ? brandId
      : null

  // Loading and errors
  const [loading, setLoading] = useState(true)
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtersError, setFiltersError] = useState<string | null>(null)
  const [productsRetryKey, setProductsRetryKey] = useState(0)
  const [filtersRetryKey, setFiltersRetryKey] = useState(0)

  // Load brand and category options
  useEffect(() => {
    let active = true

    getProductFilters()
      .then((result) => {
        if (active) setFilterOptions(result)
      })
      .catch(() => {
        if (active) {
          setFiltersError('No pudimos cargar los filtros.')
        }
      })
      .finally(() => {
        if (active) setFiltersLoading(false)
      })

    return () => {
      active = false
    }
  }, [filtersRetryKey])

  // Load products whenever search, filters, or page changes
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
        if (active) {
          setCatalog(result)
        }
      })
      .catch(() => {
        if (active) {
          setError('No pudimos cargar los productos.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    // Ignore outdated requests
    return () => {
      active = false
    }
  }, [page, search, selectedBrand, selectedCategory, productsRetryKey])

  // Keep previous results while requesting new ones
  function prepareNewRequest() {
    setLoading(true)
    setError(null)
  }

  function handleRetryProducts() {
    prepareNewRequest()
    setProductsRetryKey((current) => current + 1)
  }

  function handleRetryFilters() {
    setFiltersLoading(true)
    setFiltersError(null)
    setFiltersRetryKey((current) => current + 1)
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

    setSearchParams((current) => {
      const next = new URLSearchParams(current)

      if (id === null) {
        next.delete('brand')
      } else {
        next.set('brand', String(id))
      }

      return next
    })
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

  function handleClearFilters() {
    setSearchDraft('')

    if (
      !search &&
      selectedBrand === null &&
      selectedCategory === null
    ) return

    prepareNewRequest()
    setSearch('')
    setSelectedCategory(null)
    setPage(1)

    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.delete('brand')
      return next
    })
  }

  const hasActiveFilters =
    Boolean(search) ||
    selectedBrand !== null ||
    selectedCategory !== null

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

      {/* Search */}
      <ProductSearch
        query={searchDraft}
        onQueryChange={setSearchDraft}
        onSearch={handleSearch}
      />

      {/* Filter loading and errors */}
      {filtersLoading && (
        <p role="status">Cargando filtros...</p>
      )}
      {filtersError && (
        <div role="alert">
          <p>{filtersError}</p>

          <button
            type="button"
            className="btn-primary"
            onClick={handleRetryFilters}
          >
            Reintentar filtros
          </button>
        </div>
      )}
      {/* Filters */}
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

      {/* Skeletons only when no catalog data exists yet */}
      {loading && !catalog && (
        <ProductGridSkeleton count={6} />
      )}

      {/* Feedback while updating existing products */}
      {loading && catalog && (
        <p className="catalog-updating" role="status">
          Actualizando productos...
        </p>
      )}

      {/* API errors */}
      {error && (
        <div role="alert">
          <p>{error}</p>

          <button
            type="button"
            className="btn-primary"
            onClick={handleRetryProducts}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Catalog results */}
      {!error && catalog && (
        <>
          {/* Hide outdated result counts during updates */}
          {!loading && catalog.pagination.total > 0 && (
            <div className="catalog-results-bar">
              <p className="catalog-results">
                {catalog.pagination.total}{' '}
                {catalog.pagination.total === 1
                  ? 'producto encontrado'
                  : 'productos encontrados'}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  className="catalog-clear-filters"
                  onClick={handleClearFilters}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          {catalog.data.length > 0 ? (
            <>
              {/* Keep previous products visible while updating */}
              <div
                className={`catalog-grid-region ${
                  loading
                    ? 'catalog-grid-region--updating'
                    : ''
                }`}
                aria-busy={loading}
              >
                <ProductGrid products={catalog.data} />
              </div>

              {/* Hide outdated pagination during updates */}
              {!loading && (
                <ProductPagination
                  currentPage={catalog.pagination.page}
                  totalPages={catalog.pagination.total_pages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            /* Show empty state only after loading completes */
            !loading && (
              <div className="catalog-empty" role="status">
                <h2>Sin resultados</h2>

                <p>
                  {hasActiveFilters
                    ? 'No encontramos productos que coincidan con tu búsqueda o filtros.'
                    : 'Aún no hay productos disponibles en nuestro catálogo.'}
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleClearFilters}
                  >
                    Limpiar búsqueda y filtros
                  </button>
                )}
              </div>
            )
          )}
        </>
      )}
    </section>
  )
}